import { useEffect } from 'react'
import { init } from './test.script'

export default function test() {
  useEffect(() => {
    init()
  }, [])
  return <div id="container" />
}
