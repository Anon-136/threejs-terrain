import * as THREE from 'three'
import { noiseGenerator, setHeightGenerator } from '../libs/noises/generator'
import { sampleData } from '../libs/noises/sampleNoise'
import { fragmentShader, vertexShader } from '../shaders/hypsometricTints'

export const MIN_CHUNK_SIZE = 750
export const RESOLUTION = 256
export class Chunk {
  constructor(w, x, z, options) {
    this.setParam(w, x, z, options)
    this.geometry = new THREE.PlaneGeometry(w, w, RESOLUTION, RESOLUTION)
    this.geometry.rotateX(-Math.PI / 2)

    // Comment this out to show quadtree parttition
    // this.mesh = new THREE.GridHelper(this.width, 1, 0x00000)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(x, 0, z)
  }
  setParam(w, x, z, options) {
    this.width = w
    this.offset = [x, z]
    this.options = options
    this.material = new THREE.ShaderMaterial({
      wireframe: false,
      uniforms: options.uniforms,
      vertexShader,
      fragmentShader,
    })
  }
  generate(options = this.options) {
    const vertices = this.geometry.getAttribute('position')
    const heightMap = sampleData(vertices, this.offset, options.seed, options)
    for (let i = 0; i < vertices.count; i++) {
      vertices.setY(
        i,
        Math.max(options.oceanLevel, heightMap[i]) * options.height
      )
    }
    this.geometry.setAttribute(
      'height',
      new THREE.BufferAttribute(heightMap, 1)
    )

    const moistureMap = sampleData(
      vertices,
      this.offset,
      options.moiseSeed,
      options
    )
    this.geometry.setAttribute(
      'moisture',
      new THREE.BufferAttribute(moistureMap, 1)
    )

    this.geometry.computeVertexNormals()
    vertices.needsUpdate = true
  }
  *rebuild(options = this.options) {
    const vertices = this.geometry.getAttribute('position')
    const heightMap = yield* noiseGenerator(
      vertices,
      this.offset,
      options.seed,
      options
    )
    yield* setHeightGenerator(vertices, heightMap, options)
    this.geometry.setAttribute(
      'height',
      new THREE.BufferAttribute(heightMap, 1)
    )

    const moistureMap = yield* noiseGenerator(
      vertices,
      this.offset,
      options.moiseSeed,
      options
    )
    this.geometry.setAttribute(
      'moisture',
      new THREE.BufferAttribute(moistureMap, 1)
    )

    yield
    const [x, z] = this.offset
    this.mesh.position.set(x, 0, z)
    this.geometry.computeVertexNormals()
    vertices.needsUpdate = true
  }
  destroy() {
    this.geometry.dispose()
    this.material.dispose()
  }

  hide() {
    this.mesh.visible = false
  }

  show() {
    this.mesh.visible = true
  }
}
