const OCEAN = 'ocean'
const BEACH = 'beach'
const SCORCHED = 'scorehed'
const BARE = 'bare'
const TUNDRA = 'tundra'
const SNOW = 'snow'
const TEMPERATE_DESERT = 'desert'
const SHRUBLAND = 'shrubland'
const GRASSLAND = 'grass'
const TEMPERATE_FOREST = 'temperateForest'
const TROPICAL_FOREST = 'topicalForest'
const RAIN_FOREST = 'rainForest'

const biomeColor = {
  ocean: [0.267, 0.267, 0.478],
  beach: [0.627, 0.564, 0.467],
  scorehed: [0.823, 0.725, 0.545],
  bare: [0.533, 0.533, 0.533],
  tundra: [0.733, 0.733, 0.667],
  snow: [0.867, 0.867, 0.894],
  desert: [0.823, 0.823, 0.608],
  shrubland: [0.533, 0.6, 0.467],
  grass: [0.533, 0.667, 0.333],
  temperateForest: [0.333, 0.6, 0.267],
  topicalForest: [0.267, 0.533, 0.333],
  rainForest: [0.2, 0.467, 0.333],
}

/**
 * generate biome value for each vertex using height value and moisture value
 * heightMap and moistureMap must have the same data type and size
 */
export function genearteBiomesColor(heightMap, moistureMap) {
  const colors = new Float32Array(heightMap.length * 3)
  for (let i = 0; i < heightMap.length; i++) {
    const biome = getBiome(heightMap[i], moistureMap[i])
    const j = i * 3
    colors[j] = biomeColor[biome][0]
    colors[j + 1] = biomeColor[biome][1]
    colors[j + 2] = biomeColor[biome][2]
  }
  return colors
}

function getBiome(h, m) {
  if (h < 0.1) return OCEAN
  if (h < 0.12) return BEACH

  if (h > 0.8) {
    if (m < 0.1) return SCORCHED
    if (m < 0.2) return BARE
    if (m < 0.5) return TUNDRA
    return SNOW
  }

  if (h > 0.6) {
    if (m < 0.33) return TEMPERATE_DESERT
    if (m < 0.66) return SHRUBLAND
    return TUNDRA
  }

  if (h > 0.3) {
    if (m < 0.16) return TEMPERATE_DESERT
    if (m < 0.5) return GRASSLAND
    if (m < 0.83) return TEMPERATE_FOREST
    return TROPICAL_FOREST
  }

  if (m < 0.16) return TEMPERATE_DESERT
  if (m < 0.33) return GRASSLAND
  if (m < 0.66) return TROPICAL_FOREST
  return RAIN_FOREST
}
