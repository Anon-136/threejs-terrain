import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import WebGL from 'three/examples/jsm/capabilities/WebGL'

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

function createGraphics() {
  if (!WebGL.isWebGL2Available()) {
    return false
  }

  // Create WebGL renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.5

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  // Add three.js renderer to cantainer
  const container = document.getElementById('container')
  container.innerHTML = ''
  container.appendChild(renderer.domElement)

  // Create Stats element to show fps
  const stats = new Stats()
  container.appendChild(stats.dom)

  const fov = 60
  const aspect = window.innerWidth / window.innerHeight
  const near = 10
  const far = 10000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(70, 700, 0)

  const scene = new THREE.Scene()

  const graphicsUpdate = (timeInSeconds) => {
    renderer.render(scene, camera)
    stats.update()
  }

  const onWindowResize = () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize)

  return {
    scene,
    camera,
    renderer,
    graphicsUpdate,
  }
}
export { createGraphics, getImageData, getPixel }
