const getDirections = (source, target) => {
  const res = []
  if (source.x < target.x) res.push({ x: 1, y: 0 })
  else if (source.x > target.x) res.push({ x: -1, y: 0 })

  if (source.y < target.y) res.push({ x: 0, y: 1 })
  else if (source.y > target.y) res.push({ x: 0, y: -1 })

  return res
}

const game = {
  halite: (cache => (x, y)  => {
    const key = `${x}_${y}`

    if (cache.has(key)) return cache.get(key)
    const h = Math.floor(Math.random() * 100)

    cache.set(key, h)
    return h

  })(new Map())
}

const add = (d1, d2) => ({ x: d1.x + d2.x, y: d1.y + d2.y })

const memoize = k => f => {
  const cache = new Map()
  return (...args) => {
    const key = k(...args)
    if (cache.has(key)) return cache.get(key)

    cache.set(key, f(...args))

    return cache.get(key)
  }
}

const cheapestPath = memoize((s, t) => `${s.x}_${s.y}_${t.x}_${t.y}`)((source, target) => {
  const directions = getDirections(source, target)

  if (directions.length === 0) return { cost: 0, directions: [] }

  let res
  directions.forEach(option => {
    const next = cheapestPath({ x: source.x + option.x, y: source.y + option.y }, target)

    if (res === undefined || next.cost + 0.1 * game.halite(source.x, source.y) < res.cost) {
      res = {
        cost: next.cost + 0.1 * game.halite(source.x, source.y),
        directions: [...next.directions, option]
      }
    }
  })

  return res
})

console.time("cheapestPath")
const res = cheapestPath({x: 0, y: 0}, { x: 20, y: 20 })
console.timeEnd("cheapestPath")
console.log(res)