import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
// Core functions
import createGame from '../libs/game/Game'
import { generateHeight } from '../libs/noises/generateHeight'
// Shaders
import { terrainShader } from '../libs/shaders/terrainShader'

const worldWidth = 256
const worldDepth = 256
export default function Elevation() {
  useEffect(() => {
    const game = createGame()

    // Create control
    const controls = new OrbitControls(game.camera, game.renderer.domElement)

    // Objects
    const geometry = new THREE.PlaneGeometry(
      500,
      500,
      worldWidth - 1,
      worldDepth - 1
    )
    geometry.rotateX(-Math.PI / 2)

    const options = {
      octaves: 5,
      scale: 50,
      height: 100,
      gap: 2,
      exp: 1,
      persistence: 1,
      noiseType: 'perlin',
    }

    let material = new THREE.ShaderMaterial({
      vertexShader: terrainShader.VS,
      fragmentShader: terrainShader.PS,
    })

    function updateTexture(heightMap) {
      // if (!material) {
      //   material = new THREE.MeshBasicMaterial({ map: texture })
      // } else {
      //   material.map = texture
      //   material.needsUpdate = true
      // }
    }

    // Generate height map
    const vertices = geometry.getAttribute('position')
    function generate() {
      const heightMap = generateHeight(worldWidth, worldDepth, options)
      for (let i = 0; i < vertices.count; i++) {
        vertices.setY(i, heightMap[i])
      }
      vertices.needsUpdate = true
    }

    generate()

    const gui = new GUI()
    const terrainFolder = gui.addFolder('Terrain')
    terrainFolder.add(options, 'height').min(0).max(500).onChange(generate)
    terrainFolder.add(options, 'exp').min(0).max(5).onChange(generate)
    terrainFolder.add(options, 'scale').min(1).max(1000).onChange(generate)
    terrainFolder.add(options, 'gap').min(0).max(10).onChange(generate)
    terrainFolder.add(options, 'persistence').min(0).max(10).onChange(generate)
    terrainFolder
      .add(options, 'octaves')
      .min(1)
      .max(10)
      .step(1)
      .onChange(generate)
    terrainFolder
      .add(options, 'noiseType', {
        perlin: 'perlin',
        simplex: 'simplex',
      })
      .onChange(generate)

    // Mesh
    const plane = new THREE.Mesh(geometry, material)
    game.scene.add(plane)

    game.scene.background = new THREE.Color(0xffffff)
    game.start(() => {
      controls.update()
    })

    return () => {
      material.dispose()
      gui.destroy()
      geometry.dispose()
    }
  }, [])

  return <div id="container" />
}
