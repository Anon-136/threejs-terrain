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
    this.geometry = geometry
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x * MIN_CHUNK_SIZE, 0, z * MIN_CHUNK_SIZE)
    this.mesh = mesh
  }
  generate(options) {
    const vertices = this.geometry.getAttribute('position')
    const heightMap = generateHeight(
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
    vertices.needsUpdate = true
  }
  destroy() {
    this.geometry.dispose()
  }
}
