import * as THREE from 'three'
import { Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createGraphics } from '../graphics/graphics'

const defaultState = {}

function createGame(OnInitailize) {
  const graphics = createGraphics()

  if (!graphics) {
    alert('WebGL2 is not available')
    return defaultState
  }

  const { scene, camera, renderer, graphicsUpdate } = graphics

  // Create control
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.update()

  function tick() {
    // Update Orbital Controls
    controls.update()

    // Update scene
    graphicsUpdate()

    // Call tick again on the next frame
    requestAnimationFrame(tick)
  }

  OnInitailize(scene)
  tick()

  return {
    scene,
    renderer,
  }
}

export default createGame
