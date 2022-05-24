import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
// Core functions
import createGame from '../libs/game/Game'
// Shaders
import { terrainShader } from '../shaders/terrainShader'
import { Chunk } from '../terrain/ChunkManager'

const resolution = 256
export default function Infinite() {
  useEffect(() => {
    const game = createGame()

    // Create control
    const controls = new OrbitControls(game.camera, game.renderer.domElement)
    controls.listenToKeyEvents(window)
    controls.keyPanSpeed = 50
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.keys = {
      LEFT: 'KeyA',
      UP: 'KeyW',
      RIGHT: 'KeyD',
      BOTTOM: 'KeyS',
    }

    let material = new THREE.ShaderMaterial({
      vertexShader: terrainShader.VS,
      fragmentShader: terrainShader.PS,
    })

    // Generate Chunk
    const options = {
      octaves: 5,
      scale: 250,
      height: 500,
      gap: 2,
      exp: 1,
      persistence: 1,
      noiseType: 'simplex',
    }

    const chunks = [
      new Chunk(material, resolution, -1, -1),
      new Chunk(material, resolution, 0, -1),
      new Chunk(material, resolution, 1, -1),
      new Chunk(material, resolution, -1, 0),
      new Chunk(material, resolution, 0, 0),
      new Chunk(material, resolution, 1, 0),
      new Chunk(material, resolution, -1, 1),
      new Chunk(material, resolution, 0, 1),
      new Chunk(material, resolution, 1, 1),
    ]
    const onChange = () => {
      for (const chunk of chunks) {
        chunk.generate(options)
      }
    }
    onChange()

    const gui = new GUI()
    const terrainFolder = gui.addFolder('Terrain')
    terrainFolder.add(options, 'height', 0, 1000).onChange(onChange)
    terrainFolder.add(options, 'scale', 1, 1000).onChange(onChange)
    terrainFolder.add(options, 'exp', 0, 5).onChange(onChange)
    terrainFolder.add(options, 'gap', 0, 10).onChange(onChange)
    terrainFolder.add(options, 'persistence', 0, 10).onChange(onChange)
    terrainFolder.add(options, 'octaves', 1, 10, 1).onChange(onChange)
    terrainFolder
      .add(options, 'noiseType', {
        perlin: 'perlin',
        simplex: 'simplex',
      })
      .onChange(onChange)

    // Mesh

    for (const chunk of chunks) {
      game.scene.add(chunk.mesh)
    }

    game.scene.background = new THREE.Color(0xffffff)
    game.start(() => {
      controls.update()
    })

    return () => {
      for (const chunk of chunks) {
        chunk.destroy()
      }
      material.dispose()
      gui.destroy()
    }
  }, [])

  return <div id="container" />
}
