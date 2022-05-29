import * as THREE from 'three'
import { QuadTree } from './Quadtree'
import { Chunk, MIN_CHUNK_SIZE } from './Chunk'
import { dictDifference, dictIntersection } from '../libs/utils'
import { ChunkBuilder } from './ChunkBuilder'

export class ChunkManager {
  chunks = {}
  constructor(game, options, sunDir) {
    this.group = new THREE.Group()
    game.addObject(this.group)
    this.options = options
    this.sunDir = sunDir
    this.builder = new ChunkBuilder()
  }
  generateChunk(x, z, w) {
    return this.builder.allocateChunk(
      this.group,
      w,
      x,
      z,
      this.sunDir,
      this.options
    )
  }
  update(camera) {
    // this.updateSingle(camera)
    this.updateQuadTree(camera)
  }
  updateQuadTree(camera) {
    this.builder.update()
    if (this.builder.busy) {
      return
    }
    const quadTree = new QuadTree({
      min: new THREE.Vector2(-32000, -32000),
      max: new THREE.Vector2(32000, 32000),
    })
    quadTree.insert(camera.position)

    const key = (x, z, w) => `${x}/${z}[${w}]`
    const newChunks = {}
    const children = quadTree.getChildren()
    for (const node of children) {
      const [x, z] = node.center
      const w = node.size
      const newKey = key(x, z, w)
      newChunks[newKey] = node
    }
    const oldChunks = this.chunks
    const difference = dictDifference(newChunks, oldChunks)
    const intersection = dictIntersection(oldChunks, newChunks)
    const recycle = dictDifference(oldChunks, newChunks)
    this.builder.pushOldChunks(Object.values(recycle))
    const chunks = intersection
    for (const [key, node] of Object.entries(difference)) {
      const [x, z] = node.center
      const w = node.size
      chunks[key] = {
        params: [x, z, w],
        chunk: this.generateChunk(x, z, w),
      }
    }
    this.chunks = chunks
  }

  // ! below are unused
  createChunk(x, z, w) {
    const newChunk = Chunk(w, x, z, this.sunDir, this.options)
    newChunk.generate()
    this.group.add(newChunk.mesh)
    return newChunk
  }
  updateSingle(camera) {
    const key = (x, z) => `${x}/${z}`
    const [x, z] = this.cellIndex(camera.position)
    const newKey = key(x, z)
    if (newKey in this.chunks) {
      return
    }
    this.chunks[newKey] = {
      position: [x, z],
      chunk: this.createChunk(
        x * MIN_CHUNK_SIZE,
        z * MIN_CHUNK_SIZE,
        MIN_CHUNK_SIZE
      ),
    }
  }
  cellIndex(p) {
    const x = Math.floor(p.x / MIN_CHUNK_SIZE + 0.5)
    const z = Math.floor(p.z / MIN_CHUNK_SIZE + 0.5)
    return [x, z]
  }
  rebuild(options) {
    this.options = options
    for (const obj of Object.values(this.chunks)) {
      const { chunk } = obj
      chunk.generate(options)
    }
  }
  destroy(chunks = this.chunks) {
    for (const obj of Object.values(chunks)) {
      this.group.remove(obj.chunk.mesh)
      obj.chunk.destroy()
    }
  }
}
