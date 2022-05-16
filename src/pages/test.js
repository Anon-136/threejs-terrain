import { useEffect } from 'react'
import { init } from '../script1'

export default function Home() {
  useEffect(() => {
    init()
  }, [])
  return <div id="container" />
}
