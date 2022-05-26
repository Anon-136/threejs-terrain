/*
 * https://github.com/simondevyoutube/ProceduralTerrain_Part3/blob/master/src/noise.js
 * https://www.youtube.com/watch?v=U9q-jM3-Phc&list=PLRL3Z3lpLmH3PNGZuDNf2WXnLTHpN9hXy&index=2
 */

import { perlin3, simplex3 } from '.'

const generator = {
  perlin: perlin3,
  simplex: simplex3,
}

export function sampleNoise(width, depth, options = {}, offset = []) {
  const [offsetX = 0, offsetY = 0] = offset
  const {
    seed = 1,
    octaves = 1,
    scale = 100,
    gap = 1,
    exp = 1,
    persistence = 1,
    noiseType = 'perlin',
  } = options
  const size = width * depth
  const data = new Float32Array(size)
  const g = Math.pow(2, -persistence)
  for (let i = 0; i < size; i++) {
    let amplitude = 1
    let frequency = 1
    let norm = 0
    let e = 0
    for (let j = 0; j < octaves; j++) {
      const x = i % width
      const y = ~~(i / width)
      const noiseValue = generator[noiseType](
        ((x + offsetX) / scale) * frequency,
        ((y + offsetY) / scale) * frequency,
        seed
      )
      e += amplitude * (noiseValue * 0.5 + 0.5)
      norm += amplitude
      amplitude *= g
      frequency *= gap
    }
    e /= norm
    data[i] = Math.pow(e, exp)
  }
  return data
}
