import { sampleNoise } from '../libs/noises/sampleNoise'

import * as THREE from 'three'
import { genearteBiomesColor } from '../libs/biomes'
import { terrainShader } from '../shaders/terrainShader'

const MIN_CHUNK_SIZE = 500

const resolution = 256
export class ChunkManager {
  chunks = {}
  constructor(options) {
    this.options = options
  }
  createChunk(scene, x, z) {
    const newChunk = new Chunk(resolution, x, z)
    newChunk.generate(this.options)
    scene.add(newChunk.mesh)
  }
  update(camera, scene) {
    const [x, z] = this.cellIndex(camera.position)
    const newKey = this.key(x, z)
    if (newKey in this.chunks) {
      return
    }
    this.chunks[newKey] = {
      position: [x, z],
      chunk: this.createChunk(scene, x, z),
    }
  }
  cellIndex(p) {
    const x = Math.floor(p.x / MIN_CHUNK_SIZE + 0.5)
    const z = Math.floor(p.z / MIN_CHUNK_SIZE + 0.5)
    return [x, z]
  }
  key(x, z) {
    return `${x}/${z}`
  }
  destroy() {
    for (const val of Objects.values(this.chunks)) {
      const { chunk } = val
      chunk.destroy()
    }
  }
}

export class Chunk {
  constructor(resolution, x, z) {
    this.resolution = resolution
    this.offset = [x * (resolution - 1), z * (resolution - 1)]
    const geometry = new THREE.PlaneGeometry(
      MIN_CHUNK_SIZE,
      MIN_CHUNK_SIZE,
      resolution - 1,
      resolution - 1
    )
    geometry.rotateX(-Math.PI / 2)
    this.geometry = geometry
    const material = new THREE.ShaderMaterial({
      vertexShader: terrainShader.VS,
      fragmentShader: terrainShader.PS,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x * MIN_CHUNK_SIZE, 0, z * MIN_CHUNK_SIZE)
    this.mesh = mesh
  }
  // TODO: make this function be generator
  generate(options) {
    const vertices = this.geometry.getAttribute('position')
    const heightMap = sampleNoise(
      this.resolution,
      this.resolution,
      options,
      this.offset
    )

    for (let i = 0; i < vertices.count; i++) {
      vertices.setY(i, Math.max(0.1, heightMap[i]) * options.height)
    }

    const moistureMap = sampleNoise(this.resolution, this.resolution, options)
    const colors = genearteBiomesColor(heightMap, moistureMap) // get color of each vertex
    this.geometry.setAttribute(
      'biomeColor',
      new THREE.BufferAttribute(colors, 3)
    )

    this.geometry.computeVertexNormals()
    vertices.needsUpdate = true
  }
  destroy() {
    this.geometry.dispose()
  }

  Hide() {
    this.mesh.visible = false
  }

  Show() {
    this.mesh.visible = true
  }
}
