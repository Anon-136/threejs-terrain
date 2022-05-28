import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky'

class TerrainSky {
  constructor(gui, guiParams) {
    this.sky = new Sky()
    this.sunDirection = new THREE.Vector3()

    this.sky.scale.setScalar(450000)
    // GUI
    guiParams.sky = {
      turbidity: 10.0,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
    }

    guiParams.sun = {
      up: 25,
      azimuth: 0,
    }

    const onShaderChange = () => {
      for (let k in guiParams.sky) {
        this.sky.material.uniforms[k].value = guiParams.sky[k]
      }
    }

    const onSunChange = () => {
      const phi = THREE.MathUtils.degToRad(90 - guiParams.sun.up)
      const theta = THREE.MathUtils.degToRad(guiParams.sun.azimuth)
      // Calcuate sun position from given phi and theta
      this.sunDirection.setFromSphericalCoords(1, phi, theta)
      // Set sun position in sky's shader
      this.sky.material.uniforms['sunPosition'].value.copy(this.sunDirection)
    }

    const skyRollup = gui.addFolder('Sky')
    skyRollup
      .add(guiParams.sky, 'turbidity', 0.0, 20.0, 0.1)
      .onChange(onShaderChange)
    skyRollup.add(guiParams.sky, 'rayleigh', 0.0, 4.0).onChange(onShaderChange)
    skyRollup
      .add(guiParams.sky, 'mieCoefficient', 0.0, 0.1, 0.001)
      .onChange(onShaderChange)
    skyRollup
      .add(guiParams.sky, 'mieDirectionalG', 0.0, 1.0, 0.001)
      .onChange(onShaderChange)

    const sunRollup = gui.addFolder('Sun')
    sunRollup.add(guiParams.sun, 'up', 0.0, 360, 0.1).onChange(onSunChange)
    sunRollup
      .add(guiParams.sun, 'azimuth', -180, 180, 0.1)
      .onChange(onSunChange)

    onShaderChange()
    onSunChange()
  }

  update(camera) {
    this.sky.position.x = camera.position.x
    this.sky.position.z = camera.position.z
  }
}

export default TerrainSky
