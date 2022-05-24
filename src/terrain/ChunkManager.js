import { generateHeight } from '../libs/noises/generateHeight'

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
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x * MIN_CHUNK_SIZE, 0, z * MIN_CHUNK_SIZE)
    this.mesh = mesh
  }
  generate(options) {
    const vertices = this.mesh.geometry.getAttribute('position')
    const heightMap = generateHeight(
      this.resolution,
      this.resolution,
      this.offset,
      options
    )
    for (let i = 0; i < vertices.count; i++) {
      vertices.setY(i, heightMap[i])
    }
    vertices.needsUpdate = true
  }
  destroy() {
    this.mesh.geometry.dispose()
  }
}
