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
