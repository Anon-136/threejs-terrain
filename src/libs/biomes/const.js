import { biomesHSL } from '.'

export const oceanColor = {
  point: 0.1,
  hslColor: [biomesHSL.OCEAN.h, biomesHSL.OCEAN.s, biomesHSL.OCEAN.l],
}

export const beachColor = {
  point: 0.12,
  hslColor: [biomesHSL.BEACH.h, biomesHSL.BEACH.s, biomesHSL.BEACH.l],
}

export const arids = [
  {
    point: 0.0,
    hslColor: [biomesHSL.BARE.h, biomesHSL.BARE.s, biomesHSL.BARE.l],
  },
  {
    point: 0.35,
    hslColor: [biomesHSL.DESERT.h, biomesHSL.DESERT.s, biomesHSL.DESERT.l],
  },
  {
    point: 1.0,
    hslColor: [biomesHSL.SNOW.h, biomesHSL.SNOW.s, biomesHSL.SNOW.l],
  },
]

export const humids = [
  {
    point: 0.0,
    hslColor: [
      biomesHSL.FOREST_BOREAL.h,
      biomesHSL.FOREST_BOREAL.s,
      biomesHSL.FOREST_BOREAL.l,
    ],
  },
  {
    point: 0.5,
    hslColor: [
      biomesHSL.FOREST_TOPICAL.h,
      biomesHSL.FOREST_TOPICAL.s,
      biomesHSL.OCEAN.l,
    ],
  },
  {
    point: 1.0,
    hslColor: [biomesHSL.SNOW.h, biomesHSL.SNOW.s, biomesHSL.SNOW.l],
  },
]
