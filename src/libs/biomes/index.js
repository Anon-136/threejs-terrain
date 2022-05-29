import { Color } from 'three'

const OCEAN = new Color(0x606096)
const BEACH = new Color(0xa09078)
const BARE = new Color(0xb7a67d)
const TUNDRA = new Color(0xdddde4)
const SNOW = new Color(0xffffff)
const DESERT = new Color(0xf1e1bc)
const FOREST_TOPICAL = new Color(0x559944)
const FOREST_BOREAL = new Color(0x29c100)
const GRASSLAND = new Color()
const SHRUBLAND = new Color()
GRASSLAND.lerpColors(BARE, FOREST_BOREAL, 0.5)
SHRUBLAND.lerpColors(DESERT, FOREST_TOPICAL, 0.5)

export const biomesHSL = {
  OCEAN: { h: 0, s: 0, l: 0 },
  BEACH: { h: 0, s: 0, l: 0 },
  BARE: { h: 0, s: 0, l: 0 },
  GRASSLAND: { h: 0, s: 0, l: 0 },
  FOREST_BOREAL: { h: 0, s: 0, l: 0 },
  DESERT: { h: 0, s: 0, l: 0 },
  SHRUBLAND: { h: 0, s: 0, l: 0 },
  FOREST_TOPICAL: { h: 0, s: 0, l: 0 },
  TUNDRA: { h: 0, s: 0, l: 0 },
  SNOW: { h: 0, s: 0, l: 0 },
}

OCEAN.getHSL(biomesHSL.OCEAN)
BEACH.getHSL(biomesHSL.BEACH)
BARE.getHSL(biomesHSL.BARE)
DESERT.getHSL(biomesHSL.DESERT)
GRASSLAND.getHSL(biomesHSL.GRASSLAND)
SHRUBLAND.getHSL(biomesHSL.SHRUBLAND)
FOREST_BOREAL.getHSL(biomesHSL.FOREST_BOREAL)
FOREST_TOPICAL.getHSL(biomesHSL.FOREST_TOPICAL)
TUNDRA.getHSL(biomesHSL.TUNDRA)
SNOW.getHSL(biomesHSL.SNOW)

/**
 * generate biome value for each vertex using height value and moisture value
 * heightMap and moistureMap must have the same data type and size
 */
export function generateBiomesColor(heightMap, moistureMap) {
  const colors = new Float32Array(heightMap.length * 3)
  for (let i = 0; i < heightMap.length; i++) {
    const color = getBiome(heightMap[i], moistureMap[i])
    const j = i * 3
    colors[j] = color.r
    colors[j + 1] = color.g
    colors[j + 2] = color.b
  }
  return colors
}

export function getBiome(h, m) {
  if (h < 0.1) return OCEAN
  if (h < 0.12) return BEACH

  if (h > 0.9) {
    return SNOW
  }
  if (h > 0.8) {
    return TUNDRA
  }

  if (h > 0.4) {
    if (m < 0.33) return DESERT
    if (m < 0.66) return SHRUBLAND
    return FOREST_TOPICAL
  }

  if (m < 0.33) return BARE
  if (m < 0.66) return GRASSLAND
  return FOREST_BOREAL
}
