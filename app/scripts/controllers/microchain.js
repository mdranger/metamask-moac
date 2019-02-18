const ObservableStore = require('obs-store')
const extend = require('xtend')
const log = require('loglevel')

// every ten minutes
const POLLING_INTERVAL = 10 * 60 * 1000
/*
 * This is the controller used to connect with 
 * MicroChain monitors. Modified from infura.js
 * obs-store only stores a single value, not enough 
 * for MicroChain status.
 * Should be used to update the MicroChain info, not linked yet.
*/
class MicrochainController {

  // need to input the MicroChain monitor info
  // in the opts.
  constructor (opts = {}) {
    const initState = extend({
      chainNetworkStatus: {},
    }, opts.initState)
    this.store = new ObservableStore(initState)
  }

  //
  // PUBLIC METHODS
  //

  // Responsible for retrieving the status of Infura's nodes. Can return either
  // ok, degraded, or down.
  async checkChainNetworkStatus () {
    const response = await fetch('https://127.0.0.1:8548')
    const parsedResponse = await response.json()
    this.store.updateState({
      infuraNetworkStatus: parsedResponse,
    })
    return parsedResponse
  }

  scheduleChainNetworkCheck () {
    if (this.conversionInterval) {
      clearInterval(this.conversionInterval)
    }
    this.conversionInterval = setInterval(() => {
      this.checkChainNetworkStatus().catch(log.warn)
    }, POLLING_INTERVAL)
  }
}

module.exports = MicrochainController
