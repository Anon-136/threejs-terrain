import { useEffect } from 'react'
import useGame from '../libs/game/Game'
import * as THREE from 'three'

export default function BasicPlane() {
  const worldWidth = 256,
    worldDepth = 256,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2

  useEffect(() => {
    const onInitialize = (scene) => {
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

      scene.add(plane)
    }

    // send callback with scene as a paramater to useGame()
    useGame(onInitialize)
  }, [])

  return <div id="container" />
}
