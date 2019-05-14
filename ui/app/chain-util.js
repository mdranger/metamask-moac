const log = require('loglevel')
const util = require('./util')

/*
 * MOAC MicroChain needs to have 
*/
function chainInfoGetter () {
  const chains = {}

  return async (address) => {
    if (chains[address]) {
      return chains[address]
    }

    chains[address] = await getChainSymbolAndUrls(address)

    return chains[address]
  }
}

// Not working well
async function getChainSymbolAndUrls (chainAddress, existingChains = []) {
  const existingChain = existingChains.find(({ address }) => chainAddress === address)
  if (existingChain) {
    return existingChain
  }
  
  let result = []
  try {
    // const chain = util.getContractAtAddress(chainAddress)
    const chainInfo = util.getChainInfoByAddress(chainAddress)

    result = await Promise.all([
      chainInfo.symbol,
      chainInfo.url,
    ])
  } catch (err) {
    log.warn(`symbol() and url() calls for chain at address ${chainAddress} resulted in error:`, err)
  }

  const [ symbol = [], urls = [] ] = result

  return {
    symbol: symbol[0] || null,
    urls: urls[0] || null,
  }
}

// Notice Chain decimals is defined in the subchainbase contract
function calcChainTokenAmount (value, decimals) {
  const multiplier = Math.pow(10, Number(decimals || 0))
  const amount = Number(value / multiplier)

  return amount
}


module.exports = {
  chainInfoGetter,
  calcChainTokenAmount,
  getChainSymbolAndUrls,
}
