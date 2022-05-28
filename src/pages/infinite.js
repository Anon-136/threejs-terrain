import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
// Core functions
import createGame from '../libs/game/Game'
// Shaders
import { ChunkManager } from '../terrain/ChunkManager'
import TerrainSky from '../libs/TerrianSky'

export default function Infinite() {
  useEffect(() => {
    const game = createGame()
    const gui = new GUI()
    const guiParams = {}

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

    // Sky
    const terrainSky = new TerrainSky(gui, guiParams)
    game.addObject(terrainSky.sky)

    // Generate Chunk
    const options = {
      seed: 2,
      moiseSeed: 3,
      octaves: 5,
      scale: 2000,
      height: 1000,
      gap: 5,
      exp: 2.2,
      persistence: 2.6,
      noiseType: 'simplex',
    }

    const chunkManager = new ChunkManager(
      game,
      options,
      terrainSky.sunDirection
    )

    const onChange = () => {
      chunkManager.rebuild(options)
    }

    const terrainFolder = gui.addFolder('Terrain')
    terrainFolder.add(options, 'height', 0, 3000).onChange(onChange)
    terrainFolder.add(options, 'scale', 1, 5000).onChange(onChange)
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

    game.start(() => {
      controls.update()
      terrainSky.update(game.camera)
      chunkManager.update(game.camera)
    })

    return () => {
      // for (const chunk of chunks) {
      //   chunk.destroy()
      // }
      // material.dispose()
      chunkManager.destroy()
      gui.destroy()
      game.destroyScene()
    }
  }, [])

  return <div id="container" />
}
