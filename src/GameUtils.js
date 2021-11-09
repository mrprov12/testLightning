const getMatchingPatterns = (regex, tiles) => {
  const patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  return patterns.reduce((sets, pattern) => {
    const normalized = pattern
      .map(tileIndex => {
        return tiles[tileIndex]
      })
      .join('')
    if (regex.test(normalized)) {
      sets.push(pattern)
    }
    return sets
  }, [])
}

const getFutureWinningIndex = tiles => {
  let index = -1
  const player = /(ex{2}|x{2}e|xex)/i
  const ai = /(e0{2}|0{2}e|0e0)/i

  const set = [...getMatchingPatterns(player, tiles), ...getMatchingPatterns(ai, tiles)]

  if (set.length) {
    set.pop().forEach(tileIndex => {
      if (tiles[tileIndex] === 'e') {
        index = tileIndex
      }
    })
  }
  return index
}

const AI = tiles => {
  return getFutureWinningIndex(tiles)
}

const getWinner = tiles => {
  const player = /(ex{2}|x{2}e|xex)/i
  const ai = /(e0{2}|0{2}e|0e0)/i

  const set = [...getMatchingPatterns(player, tiles), ...getMatchingPatterns(ai, tiles)]

  let winner

  // if (set.length) {
  //   set.pop().forEach(tileIndex => {
  //     if (tiles[tileIndex] === 'e') {
  //       winner = undefined
  //     }
  //   })
  // }

  console.log('Set', set)
  return 'x'
}

export default { getMatchingPatterns, getFutureWinningIndex, AI, getWinner }
