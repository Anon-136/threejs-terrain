// React
import { useEffect } from 'react'
// Threejs
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// Custom libraries
import createGame from '../libs/game/Game'

function createSky() {
  const loader = new THREE.CubeTextureLoader()

  const texture = loader.load([
    '/cubemap/px.jpg',
    '/cubemap/nx.jpg',
    '/cubemap/py.jpg',
    '/cubemap/ny.jpg',
    '/cubemap/pz.jpg',
    '/cubemap/nz.jpg',
  ])

  return texture
}

export default function BasicPlane() {
  const worldWidth = 256,
    worldDepth = 256

  useEffect(() => {
    const game = createGame()

    // Create control
    const controls = new OrbitControls(game.camera, game.renderer.domElement)

    controls.update()

    // Objects
    const geometry = new THREE.PlaneGeometry(
      500,
      500,
      worldWidth - 1,
      worldDepth - 1
    )
    geometry.rotateX(-Math.PI / 2)

    // Materials
    const material = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0xffffff,
      side: THREE.FrontSide,
      vertexColors: THREE.VertexColors,
    })

    // Mesh
    const plane = new THREE.Mesh(geometry, material)
    plane.castShadow = false
    plane.receiveShadow = true

    game.scene.add(plane)

    // create sky
    const texture = createSky()
    game.scene.background = texture

    game.start((timeInSeconds) => {
      controls.update()
      /**
        Add code to update game objects below here
       */
    })
  }, [])

  return <div id="container" />
}
