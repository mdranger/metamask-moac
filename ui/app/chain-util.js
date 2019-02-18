const log = require('loglevel')
const util = require('./util')

function chainInfoGetter () {
  const chains = {}

  return async (address) => {
    if (chains[address]) {
      return chains[address]
    }

    chains[address] = await getSymbolAndDecimals(address)

    return chains[address]
  }
}

async function getSymbolAndDecimals (chainAddress, existingChains = []) {
  const existingChain = existingChains.find(({ address }) => chainAddress === address)
  if (existingChain) {
    return existingChain
  }
  
  let result = []
  try {
    const chain = util.getContractAtAddress(chainAddress)

    result = await Promise.all([
      chain.symbol(),
      chain.decimals(),
    ])
  } catch (err) {
    log.warn(`symbol() and decimal() calls for chain at address ${chainAddress} resulted in error:`, err)
  }

  const [ symbol = [], decimals = [] ] = result

  return {
    symbol: symbol[0] || null,
    decimals: decimals[0] && decimals[0].toString() || null,
  }
}

function calcTokenAmount (value, decimals) {
  const multiplier = Math.pow(10, Number(decimals || 0))
  const amount = Number(value / multiplier)

  return amount
}


module.exports = {
  chainInfoGetter,
  calcTokenAmount,
  getSymbolAndDecimals,
}
