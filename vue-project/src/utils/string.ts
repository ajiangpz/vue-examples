let maxTick = 20
export const interval = (duration, tickCount = maxTick) => {
  let res = []
  if (duration <= maxTick) {
    for (let i = 0; i <= Math.floor(duration); i++) {
      res.push(i)
    }
    return res
  } else {
    for (let i = 0; i <= tickCount; i++) {
      const tickSecond = (i / tickCount) * duration
      res.push(tickSecond)
    }
    return res
  }
}