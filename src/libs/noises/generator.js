import { getBiome } from '../biomes'
import { noise } from './sampleNoise'

const NUM_STEPS = 20000
export function* noiseGenerator(vertices, offset, seed, options) {
  let count = 0

  const size = vertices.count
  const data = new Float32Array(size)
  const [offsetX, offsetZ] = offset
  for (let i = 0; i < size; i++) {
    data[i] = noise(
      vertices.getX(i) + offsetX,
      vertices.getZ(i) + offsetZ,
      seed,
      options
    )

    if (++count === NUM_STEPS) {
      count = 0
      yield
    }
  }
  return data
}

export function* setHeightGenerator(vertices, heightMap, options) {
  let count = 0
  for (let i = 0; i < vertices.count; i++) {
    vertices.setY(
      i,
      Math.max(options.oceanLevel, heightMap[i]) * options.height
    )
    if (++count === NUM_STEPS) {
      count = 0
      yield
    }
  }
}
