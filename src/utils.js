const memoize = k => f => {
  const cache = new Map()
  return (...args) => {
    const key = k(...args)
    if (cache.has(key)) return cache.get(key)

    cache.set(key, f(...args))

    return cache.get(key)
  }
}

module.exports = {
  memoize 
}