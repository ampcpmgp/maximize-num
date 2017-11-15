const dev = process.argv.some(item => item !== 'prod')

const ifWin = (winRatio) => winRatio > Math.random()
dev && (() => {
  let winNum = 0
  Array.from({length: 10000}).forEach(() => {
    winNum += ifWin(0.6) ? 1 : 0
  })
  console.assert(winNum > 5000 && winNum < 7000, 'ifWin')
})()

/**
 * 1をスタートとして、勝率。損益率、試行回数に基づき、いくらになるかを取得する
 * @param {number} winRatio 勝率
 * @param {number} benefitRatio 1回当たりの損益率
 * @param {number} num 試行回数
 * @return {number} 最終値
 */
const getAssetAfterTrial = (winRatio, benefitRatio, num) => {
  let assets = 100
  Array.from({length: num}).forEach(() => {
    const diff = assets * benefitRatio
    assets += ifWin(winRatio) ? diff : -diff
  })
  return Math.round(assets) / 100
}
dev && (() => {
  const assets = getAssetAfterTrial(0.5, 0.5, 120)
  console.assert(assets < 1, 'getAssetAfterTrial')
})()

/**
 * getAssetAfterTrialをretryNum回数分繰り返し、その結果の配列を取得する
 * @param {number} winRatio 勝率
 * @param {number} benefitRatio 1回当たりの損益率
 * @param {number} num 試行回数
 * @param {number} retryNum 上記試行回数を何度繰り返すか
 * @return {object} 最終値の配列
 */
const retryTrial = exports.retryTrial = (winRatio, benefitRatio, num, retryNum) =>
  Array.from({length: retryNum}).map(() => getAssetAfterTrial(winRatio, benefitRatio, num))
dev && (() => {
  const results = retryTrial(0.55, 0.1, 1000, 20)
  console.assert(results.filter(result => result > 1).length > 14, 'retryTrial')
})()
