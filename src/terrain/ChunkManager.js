import * as THREE from 'three'
import { QuadTree } from './Quadtree'
import { Chunk, MIN_CHUNK_SIZE } from './Chunk'

export const resolution = 256
export class ChunkManager {
  chunks = {}
  constructor(scene, options, camera) {
    this.group = new THREE.Group()
    scene.add(this.group)
    this.options = options
    this.updateQuadTree(camera)
  }
  createChunk(x, z, width) {
    const newChunk = new Chunk(width, resolution, x, z)
    newChunk.generate(this.options)
    this.group.add(newChunk.mesh)
  }
  update() {}
  updateQuadTree(camera) {
    const quadTree = new QuadTree({
      min: new THREE.Vector2(-32000, -32000),
      max: new THREE.Vector2(32000, 32000),
    })
    quadTree.insert(camera.position)

    const children = quadTree.getChildren()
    const newChunks = {}
    const key = (x, z, w) => `${x}/${z}[${w}]`
    for (const child of children) {
      console.log(child)
      const [x, z] = child.center
      const w = child.size.x
      const newKey = key(x, z, w)
      if (newKey in this.chunks) {
        return
      }
      this.chunks[newKey] = {
        position: [x, z, w],
        chunk: this.createChunk(x, z, w),
      }
    }
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
  destroy() {
    for (const val of Objects.values(this.chunks)) {
      const { chunk } = val
      chunk.destroy()
    }
  }
}
