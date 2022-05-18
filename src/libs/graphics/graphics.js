import * as THREE from 'three'
import Stats from '../stats.module'
import { WEBGL } from '../WebGL'

function getImageData() {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)

  return context.getImageData(0, 0, image.width, image.height)
}

function getPixel(imagedata, x, y) {
  const position = (x + imagedata.width * y) * 4
  const data = imagedata.data
  return {
    r: data[position],
    g: data[position + 1],
    b: data[position + 2],
    a: data[position + 3],
  }
}

class Graphics {
  constructor() {}

  initialize() {
    if (!WEBGL.isWebGL2Available()) {
      return false
    }

    // Create WebGL renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    // Add three.js renderer to cantainer
    const container = document.getElementById('container')
    container.innerHTML = ''
    container.appendChild(this.renderer.domElement)

    // Create Stats element to show fps
    this.stats = new Stats()

    window.addEventListener('resize', this.onWindowResize)

    const fov = 60
    const aspect = 1920 / 1080
    const near = 0.1
    const far = 10000.0
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 2

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xbfd1e5)
  }

  update() {
    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }

  onWindowResize() {
    // Update camera
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
}

module.exports = {
  Graphics,
  getImageData,
  getPixel,
}
