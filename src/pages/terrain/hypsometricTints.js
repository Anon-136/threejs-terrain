import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
import { randomRangeInt } from '../../libs/utils'
import createGame from '../../libs/game/Game'

// noise
import { sampleNoise } from '../../libs/noises/sampleNoise'

// Shaders
import * as hypsometricTints from '../../shaders/hypsometricTints'
import { biomesHSL } from '../../libs/biomes'

// Objects
import TerrainSky from '../../libs/TerrianSky'

const worldWidth = 256
const worldDepth = 256

export default function TerrainWithHypsometricTints() {
  const oceanColor = {
    point: 0.1,
    hslColor: [biomesHSL.OCEAN.h, biomesHSL.OCEAN.s, biomesHSL.OCEAN.l],
  }

  const beachColor = {
    point: 0.12,
    hslColor: [biomesHSL.BEACH.h, biomesHSL.BEACH.s, biomesHSL.BEACH.l],
  }

  const arids = [
    {
      point: 0.0,
      hslColor: [biomesHSL.BARE.h, biomesHSL.BARE.s, biomesHSL.BARE.l],
    },
    {
      point: 0.35,
      hslColor: [biomesHSL.DESERT.h, biomesHSL.DESERT.s, biomesHSL.DESERT.l],
    },
    {
      point: 1.0,
      hslColor: [biomesHSL.SNOW.h, biomesHSL.SNOW.s, biomesHSL.SNOW.l],
    },
  ]

  const humids = [
    {
      point: 0.0,
      hslColor: [
        biomesHSL.FOREST_BOREAL.h,
        biomesHSL.FOREST_BOREAL.s,
        biomesHSL.FOREST_BOREAL.l,
      ],
    },
    {
      point: 0.5,
      hslColor: [
        biomesHSL.FOREST_TOPICAL.h,
        biomesHSL.FOREST_TOPICAL.s,
        biomesHSL.OCEAN.l,
      ],
    },
    {
      point: 1.0,
      hslColor: [biomesHSL.SNOW.h, biomesHSL.SNOW.s, biomesHSL.SNOW.l],
    },
  ]

  useEffect(() => {
    const game = createGame()

    // Create control
    const controls = new OrbitControls(game.camera, game.renderer.domElement)

    const gui = new GUI()
    const guiParams = {}

    // sky
    const skyTerrain = new TerrainSky(gui, guiParams)
    game.addObject(skyTerrain.sky)

    // Objects
    const geometry = new THREE.PlaneGeometry(
      500,
      500,
      worldWidth - 1,
      worldDepth - 1
    )
    geometry.rotateX(-Math.PI / 2)
    const vertices = geometry.getAttribute('position')

    guiParams.terrain = {
      octaves: 5,
      scale: 50,
      gap: 2,
      exp: 1.5,
      persistence: 1,
      noiseType: 'perlin',
      height: 180,
    }

    guiParams.moisture = {
      seed: 5,
      octaves: 3,
      scale: 200,
      gap: 2,
      exp: 1,
      persistence: 2,
      noiseType: 'simplex',
    }

    // Terrain generation
    let heightMap = sampleNoise(worldWidth, worldDepth, guiParams.terrain)
    let moistureMap = sampleNoise(worldWidth, worldDepth, guiParams.moisture)
    const onTerrainChange = () => {
      heightMap = sampleNoise(worldWidth, worldDepth, guiParams.terrain)
      generate(heightMap, moistureMap)
    }

    const onMoistureChange = () => {
      moistureMap = sampleNoise(worldWidth, worldDepth, guiParams.moisture)
      generate(heightMap, moistureMap)
    }

    const generate = (heightMap, moistureMap) => {
      for (let i = 0; i < vertices.count; i++) {
        // make water surface smooth
        if (heightMap[i] <= 0.1) {
          vertices.setY(i, 0.1 * guiParams.terrain.height)
        } else {
          vertices.setY(i, heightMap[i] * guiParams.terrain.height)
        }
      }

      geometry.computeVertexNormals()
      vertices.needsUpdate = true

      // Set shader attributes
      geometry.setAttribute('height', new THREE.BufferAttribute(heightMap, 1))
      geometry.setAttribute(
        'moisture',
        new THREE.BufferAttribute(moistureMap, 1)
      )
    }

    generate(heightMap, moistureMap)

    // GUI
    const terrainFolder = gui.addFolder('Terrain')
    terrainFolder
      .add(guiParams.terrain, 'height', 0, 1000)
      .onChange(onTerrainChange)
    terrainFolder
      .add(guiParams.terrain, 'scale', 1, 1000)
      .onChange(onTerrainChange)
    terrainFolder.add(guiParams.terrain, 'exp', 0, 5).onChange(onTerrainChange)
    terrainFolder.add(guiParams.terrain, 'gap', 0, 10).onChange(onTerrainChange)
    terrainFolder
      .add(guiParams.terrain, 'persistence', 0, 10)
      .onChange(onTerrainChange)
    terrainFolder
      .add(guiParams.terrain, 'octaves', 1, 10, 1)
      .onChange(onTerrainChange)
    terrainFolder
      .add(guiParams.terrain, 'noiseType', {
        perlin: 'perlin',
        simplex: 'simplex',
      })
      .onChange(onTerrainChange)

    const moistureFolder = gui.addFolder('Moisture')
    moistureFolder
      .add(guiParams.moisture, 'scale', 1, 1000)
      .onChange(onMoistureChange)
    moistureFolder
      .add(guiParams.moisture, 'exp', 0, 5)
      .onChange(onMoistureChange)
    moistureFolder
      .add(guiParams.moisture, 'gap', 0, 10)
      .onChange(onMoistureChange)
    moistureFolder
      .add(guiParams.moisture, 'persistence', 0, 10)
      .onChange(onMoistureChange)
    moistureFolder
      .add(guiParams.moisture, 'octaves', 1, 10, 1)
      .onChange(onMoistureChange)
    moistureFolder
      .add(guiParams.moisture, 'noiseType', {
        perlin: 'perlin',
        simplex: 'simplex',
      })
      .onChange(onMoistureChange)

    const uniforms = {
      sunDirection: {
        value: skyTerrain.sunDirection,
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

    let material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: hypsometricTints.vertexShader,
      fragmentShader: hypsometricTints.fragmentShader,
    })

    // Mesh
    const plane = new THREE.Mesh(geometry, material)
    game.addObject(plane)

    game.scene.background = new THREE.Color(0xd3d3d3)
    game.start(() => {
      skyTerrain.update(game.camera)
      controls.update()
    })

    return () => {
      gui.destroy()
      controls.dispose()
      game.destroyScene()
    }
  }, [])

  return <div id="container" />
}
