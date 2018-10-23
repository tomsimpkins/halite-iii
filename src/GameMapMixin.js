const hlt = require("../hlt")

const { constants } = hlt

const mixin = {
  resetPathCache() {
    this.pathCache = null
  },

  /**
   * Compute the cheapest path between a pair of Positions.
   * Accounts for wrap-around.
   * @param cache The cache that will be populated
   * @param source The source from where to calculate
   * @param target The target to where calculate
   * @returns An object with cost and an array of directions to follow
   */
  cheapestPath(cache, source, target) {
    const key = `${source.toString()}_${target.toString()}`
    if (cache.has(key)) return cache.get(key)

    const directions = this.getUnsafeMoves(source, target)
    let res

    if (directions.length === 0) {
      res = { cost: 0, directions: [] };
      cache.set(key, res)
      return res
    }


    directions.forEach(option => {
      const next = this.cheapestPath(cache, source.directionalOffset(option), target)
      const cost = next.cost + 1 / constants.MOVE_COST_RATIO * this.get(source).haliteAmount

      if (res === undefined || cost < res.cost) {
        res = {
          cost,
          directions: [...next.directions, option]
        }
      }
    })

    cache.set(key, res)
    return res
  }
}

module.exports = mixin