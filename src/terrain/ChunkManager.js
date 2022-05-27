import { sampleNoise } from '../libs/noises/sampleNoise'

import * as THREE from 'three'

const MIN_CHUNK_SIZE = 500

export class Chunk {
  constructor(material, resolution, x, z) {
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
      vertices.setY(i, heightMap[i] * options.height)
    }
    this.geometry.setAttribute(
      'height',
      new THREE.Float32BufferAttribute(heightMap, 1)
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
