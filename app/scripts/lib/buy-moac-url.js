module.exports = getBuyMoacUrl

/**
 * Gives the caller a url at which the user can acquire MOAC, depending on the network they are in
 *
 * @param {object} opts Options required to determine the correct url
 * @param {string} opts.network The network for which to return a url
 * @param {string} opts.amount The amount of MOAC to buy on coinbene. Only relevant if network === '99'.
 * @param {string} opts.address The address the bought MOAC should be sent to.  Only relevant if network === '99'.
 * @returns {string|undefined} The url at which the user can access MOAC, while in the given network. If the passed
 * network does not match any of the specified cases, or if no network is given, returns undefined.
 *
 */
function getBuyMoacUrl ({ network, amount, address }) {
  let url
  switch (network) {
    case '99':
      url = 'https://www.coinbene.com/#/market?pairId=MOACUSDT'
      break
    case '101':
      url = 'https://faucet.moacchina.com'
      //old url: 'http://119.28.13.213:3000'
      break
  }
  return url
}
