import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
// Core functions
import createGame from '../libs/game/Game'
import { sampleNoise } from '../libs/noises/sampleNoise'
import { randomRangeInt } from '../libs/utils'
import { genearteBiomesColor } from '../libs/biomes'
// Shaders
import { terrainShader } from '../shaders/terrainShader'

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
      gap: 2,
      exp: 1,
      persistence: 1,
      noiseType: 'perlin',
      height: 150,
    }

    const options2 = {
      seed: randomRangeInt(1, 50),
      octaves: 3,
      scale: 50,
      gap: 2,
      exp: 1,
      persistence: 1,
      noiseType: 'perlin',
    }

    let material = new THREE.ShaderMaterial({
      vertexShader: terrainShader.VS,
      fragmentShader: terrainShader.PS,
    })

    // Generate height map
    const vertices = geometry.getAttribute('position')
    function generate() {
      const heightMap = sampleNoise(worldWidth, worldDepth, options)
      const moistureMap = sampleNoise(worldWidth, worldDepth, options2)
      const colors = genearteBiomesColor(heightMap, moistureMap) // get color of each vertex

      for (let i = 0; i < vertices.count; i++) {
        // make water surface smooth
        if (heightMap[i] <= 0.1) {
          vertices.setY(i, 0.1 * options.height)
        } else {
          vertices.setY(i, heightMap[i] * options.height)
        }
      }

      // Set shader attributes
      geometry.setAttribute('biomeColor', new THREE.BufferAttribute(colors, 3))

      geometry.computeVertexNormals()
      vertices.needsUpdate = true
    }

    generate()

    const gui = new GUI()
    const terrainFolder = gui.addFolder('Terrain')
    terrainFolder.add(options, 'height', 0, 1000).onChange(generate)
    terrainFolder.add(options, 'scale', 1, 1000).onChange(generate)
    terrainFolder.add(options, 'exp', 0, 5).onChange(generate)
    terrainFolder.add(options, 'gap', 0, 10).onChange(generate)
    terrainFolder.add(options, 'persistence', 0, 10).onChange(generate)
    terrainFolder.add(options, 'octaves', 1, 10, 1).onChange(generate)
    terrainFolder
      .add(options, 'noiseType', {
        perlin: 'perlin',
        simplex: 'simplex',
      })
      .onChange(generate)

    // Mesh
    const plane = new THREE.Mesh(geometry, material)
    game.scene.add(plane)

    game.scene.background = new THREE.Color(0xd3d3d3)
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
