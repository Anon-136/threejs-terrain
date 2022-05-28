import * as THREE from 'three'
import { genearteBiomesColor } from '../libs/biomes'
import { sampleData } from '../libs/noises/sampleNoise'
import { terrainShader } from '../shaders/terrainShader'

export const MIN_CHUNK_SIZE = 750

export class Chunk {
  constructor(width, resolution, x, z) {
    this.width = width
    this.resolution = resolution
    this.offset = [x, z]
    this.geometry = new THREE.PlaneGeometry(
      width,
      width,
      resolution - 1,
      resolution - 1
    )
    this.geometry.rotateX(-Math.PI / 2)
    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      vertexShader: terrainShader.VS,
      fragmentShader: terrainShader.PS,
    })

    // Comment this out to show quadtree parttition
    // this.mesh = new THREE.GridHelper(this.width, 1, 0x00000)

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(x, 0, z)
  }
  // TODO: make this function be generator
  generate(options) {
    const vertices = this.geometry.getAttribute('position')
    const heightMap = sampleData(vertices, this.offset, options.seed, options)
    for (let i = 0; i < vertices.count; i++) {
      vertices.setY(i, Math.max(0.1, heightMap[i]) * options.height)
    }
    const moistureMap = sampleData(
      vertices,
      this.offset,
      options.moiseSeed,
      options
    )
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

  hide() {
    this.mesh.visible = false
  }

  show() {
    this.mesh.visible = true
  }
}
