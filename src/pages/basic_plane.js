import { useEffect } from 'react'
import Game from '../libs/game/Game'
import * as graphics from '../libs/graphics/graphics'

export default function BasicPlane() {
  const worldWidth = 256,
    worldDepth = 256,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2

  let App = null

  useEffect(() => {
    const App = new Game()
  }, [])
  return <div id="container" />
}
