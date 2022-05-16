import { useEffect } from 'react'
import { init } from '../script'

export default function Home() {
  useEffect(() => {
    init()
  }, [])
  return <canvas className="webgl" />
}
