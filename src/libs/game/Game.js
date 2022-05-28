import { createGraphics } from '../graphics/graphics'
import ResourceTracker from '../ResourceTracker'

const defaultState = {}

// OnInitialize callback to call when scene is being created
// OnStep callback to call in each frame
function createGame() {
  const graphics = createGraphics()
  const resMgr = new ResourceTracker()
  const track = resMgr.track.bind(resMgr)

  if (!graphics) {
    alert('WebGL2 is not available')
    return defaultState
  }

  const { scene, camera, renderer, graphicsUpdate } = graphics

  let previousRAF = null
  let onStep = null
  const minFrameTime = 1.0 / 10.0

  const start = (updateCallback) => {
    onStep = updateCallback
    // execute game loop
    tick()
  }

  const addObject = (gameObject) => {
    scene.add(track(gameObject))
  }

  const destroyScene = () => {
    resMgr.dispose()
  }

  function tick() {
    requestAnimationFrame((t) => {
      if (previousRAF === null) {
        previousRAF = t
      }
      render(t - previousRAF)
      previousRAF = t
    })
  }

  function render(timeInMS) {
    const timeInSeconds = Math.min(timeInMS * 0.001, minFrameTime)

    onStep(timeInSeconds)

    // Update scene
    graphicsUpdate(timeInSeconds)

    // Call tick again on the next frame
    tick()
  }

  return {
    scene,
    renderer,
    camera,
    start,
    destroyScene,
    addObject,
  }
}

export default createGame
