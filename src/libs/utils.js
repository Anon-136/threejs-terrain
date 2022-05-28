export function randomRange(min, max) {
  if (max - min < 0) {
    throw new Error('max must be greater than min')
  }
  return Math.random() * (max - min) + min
}

export function randomRangeInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

export function dictIntersection(dictA, dictB) {
  const intersection = {}
  for (let k in dictB) {
    if (k in dictA) {
      intersection[k] = dictA[k]
    }
  }
  return intersection
}

export function dictDifference(dictA, dictB) {
  const diff = { ...dictA }
  for (let k in dictB) {
    delete diff[k]
  }
  return diff
}
