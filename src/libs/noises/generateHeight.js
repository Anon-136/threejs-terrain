import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'

export function generateHeight(width, depth, options = {}) {
  const {
    seed = 1,
    octaves = 1,
    scale = 100,
    height = 100,
    gap = 1,
    exp = 1,
    persistence = 1,
  } = options
  const size = width * depth
  const data = new Uint16Array(size)
  const perlin = new ImprovedNoise()
  const g = Math.pow(2, -persistence)
  for (let i = 0; i < size; i++) {
    let amplitude = 1
    let frequency = 1
    let norm = 0
    for (let j = 0; j < octaves; j++) {
      const x = i % width
      const y = ~~(i / width)
      const noiseValue = perlin.noise(
        (x * frequency) / scale,
        (y * frequency) / scale,
        seed
      )
      data[i] += amplitude * Math.abs(noiseValue) * height
      amplitude *= g
      norm += amplitude
      frequency *= gap
    }
    data[i] /= norm
    data[i] = Math.pow(data[i], exp)
  }
  return data
}
