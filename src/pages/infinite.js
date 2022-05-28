import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
// Core functions
import createGame from '../libs/game/Game'
// Shaders
import { ChunkManager } from '../terrain/ChunkManager'

export default function Infinite() {
  useEffect(() => {
    const game = createGame()

    // Create control
    const controls = new OrbitControls(game.camera, game.renderer.domElement)
    controls.listenToKeyEvents(window)
    controls.keyPanSpeed = 50
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false

    controls.minDistance = 200
    controls.maxDistance = 3000

    controls.maxPolarAngle = Math.PI / 2
    controls.keys = {
      LEFT: 'KeyA',
      UP: 'KeyW',
      RIGHT: 'KeyD',
      BOTTOM: 'KeyS',
    }

    // Generate Chunk
    const options = {
      octaves: 5,
      scale: 400,
      height: 200,
      gap: 2,
      exp: 2,
      persistence: 1,
      noiseType: 'simplex',
    }

    const chunkManager = new ChunkManager(game.scene, options, game.camera)
    // const onChange = () => {
    //   for (const chunk of chunks) {
    //     chunk.generate(options)
    //   }
    // }
    // onChange()

    // const gui = new GUI()
    // const terrainFolder = gui.addFolder('Terrain')
    // terrainFolder.add(options, 'height', 0, 1000).onChange(onChange)
    // terrainFolder.add(options, 'scale', 1, 1000).onChange(onChange)
    // terrainFolder.add(options, 'exp', 0, 5).onChange(onChange)
    // terrainFolder.add(options, 'gap', 0, 10).onChange(onChange)
    // terrainFolder.add(options, 'persistence', 0, 10).onChange(onChange)
    // terrainFolder.add(options, 'octaves', 1, 10, 1).onChange(onChange)
    // terrainFolder
    //   .add(options, 'noiseType', {
    //     perlin: 'perlin',
    //     simplex: 'simplex',
    //   })
    //   .onChange(onChange)

    // Mesh

    // for (const chunk of chunks) {
    //   game.scene.add(chunk.mesh)
    // }

    const color = new THREE.Color(0xffffff)
    game.scene.background = color
    game.start(() => {
      controls.update()
      chunkManager.update(game.camera)
    })

    return () => {
      // for (const chunk of chunks) {
      //   chunk.destroy()
      // }
      // material.dispose()
      // gui.destroy()
    }
  }, [])

  return <div id="container" />
}
