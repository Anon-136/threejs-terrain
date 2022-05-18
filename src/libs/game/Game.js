import * as THREE from 'three'
// import { GUI } from '../dat.gui.module'
import { OrbitControls } from '../controls/OrbitControls'
import { Graphics } from '../graphics/graphics.js'

class Game {
  constructor() {
    this.initialize()
  }

  initialize() {
    this.graphics = new Graphics()
    if (this.graphics.initialize()) {
      this.displayError('WebGL2 is not available')
      return
    }

    // Create control
    const controls = new OrbitControls(
      this.graphics.camera,
      this.graphics.renderer.domElement
    )

    controls.update()
    this.controls = controls

    // // Create GUI
    // this.guiParams = {
    //   general: {},
    // }

    // this.gui = new GUI()
    // this.gui.addFolder('General')
    // this.gui.close()

    this.tick()
  }

  displayError(errorText) {
    alert(errorText)
  }

  tick() {
    if (this) {
      // Update Orbital Controls
      this.controls.update()

      // Update scene
      this.graphics.update()

      // Call tick again on the next frame
      requestAnimationFrame(this.tick)
    }
  }
}

export default Game
