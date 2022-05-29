import { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
// Core functions
import createGame from '../libs/game/Game'
// Shaders
import { ChunkManager } from '../terrain/ChunkManager'
import TerrainSky from '../libs/TerrianSky'
import { arids, beachColor, humids, oceanColor } from '../libs/biomes/const'

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

    const uniforms = {
      sunDirection: {
        value: terrainSky.sunDirection,
      },
      ocean: {
        value: oceanColor,
      },
      beach: {
        value: beachColor,
      },
      aridSpline: {
        value: arids,
      },
      humidSpline: {
        value: humids,
      },
    }
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
      oceanLevel: 0.1,
      uniforms: uniforms,
    }

    const chunkManager = new ChunkManager(game, options)

    const rebuildTerrain = () => {
      chunkManager.rebuild(options)
    }

    const terrainFolder = gui.addFolder('Terrain')
    terrainFolder.add(options, 'height', 0, 3000).listen()
    terrainFolder.add(options, 'scale', 1, 5000).listen()
    terrainFolder.add(options, 'exp', 0, 5).listen()
    terrainFolder.add(options, 'gap', 0, 10).listen()
    terrainFolder.add(options, 'persistence', 0, 10).listen()
    terrainFolder.add(options, 'octaves', 1, 10, 1).listen()
    terrainFolder
      .add(options, 'noiseType', {
        perlin: 'perlin',
        simplex: 'simplex',
      })
      .listen()

    guiParams.rebuild = rebuildTerrain
    terrainFolder.add(guiParams, 'rebuild')

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
