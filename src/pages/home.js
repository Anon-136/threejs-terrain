import { useEffect } from 'react'
import { init } from './home.script'

export default function Home() {
  useEffect(() => {
    init()
  }, [])
  return <canvas className="webgl" />
}
