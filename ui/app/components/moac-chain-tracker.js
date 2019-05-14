
const EventEmitter = require('events').EventEmitter
const deepEqual = require('deep-equal')
// const Chain3 = require('chain3')
// const util = require('../util')
const microChainInfo = require('./microChainInfo')

/*
 * Main class to track the Microchains
 * Need input with MicroChains
 * Link to the MicroChain Monitor REST-API server
 * to get updates of the blocks
 * also need to pass the info from the moacstate
 * opts.userAddress
 * opts.chainAddressList: 
 * opts.chainUrlList
 * opts.pollingInterval
*/
class ChainTracker extends EventEmitter {

  constructor (opts = {}) {
    super()

    this.userAddress = opts.userAddress || '0x0'
    //MicroChain address
    // this.chainAddressList = opts.chainAddressList
    // this.provider = opts.provider
    // this.chainUrlList = opts.chainUrlList
    const pollingInterval = opts.pollingInterval || 8000
    const chains = opts.microchains || []
    // Setup the MicroChain tracker

    // Initial the microChains with input info
    this.microchains = chains.map((chainOpts) => {
      // console.log("Array item", chainOpts.symbol)
      const owner = this.userAddress
      // const address = chainOpts
      const { address, symbol, balance, decimals, url } = chainOpts

      // Extract the chain info from the Chain object
      // by using getBalance methods on SCS server ports
      // console.log('init chain', chainOpts)
      return new microChainInfo({ address, symbol, balance, decimals, url, owner })
    })

    this.running = true
    //this.updateBalances.bind(this)
    // this.blockTracker.on('latest', this.updateBalances.bind(this))
    // this.blockTracker.start()
  }

  serialize() {
    return this.microchains.map(chain => chain.serialize())
  }

  async updateBalances() {
    const oldBalances = this.serialize()
    // When MOACMask started, mcAddress has no default value,
    // Skip the getBalance method if input mcAddress is not a valid value
    //debug only
    // this.mcAddress="0x389e82806cc945d3be793d24226931bfda410e75"
    // this.url="http://47.107.75.89:8547"
    // if ( util.isValidAddress(this.mcAddress) && util.isValidAddress(this.userAddress)){
    //   return Promise.all(this._chain3.scs.getBalance(this.mcAddress,this.userAddress))
    //   .then(() => {
    //     const newBalances = this.serialize()
    //     if (!deepEqual(newBalances, oldBalances)) {
    //       if (this.running) {
    //         this.emit('update', newBalances)
    //       }
    //     }
    //   })
    // }
    //Update all the microChainn info
    try {
    await Promise.all(this.microchains.map((chain) => {
      return chain.updateBalance()
    }))

    const newBalances = this.serialize()
    // return Promise.all(this._chain3.scs.getBalance(this.mcAddress,this.userAddress))
    // .then(() => {
    //   const newBalances = this.serialize()
      if (!deepEqual(newBalances, oldBalances)) {
        if (this.running) {
          this.emit('update', newBalances)
        }
      }
    } catch (e) {
      this.emit('error', e)
    }

  }

  // Used the input options to create the MicroChain object
  createMicorChainFrom (opts) {
    const owner = this.userAddress
    const { address, symbol, balance, decimals, url } = opts
    // console.log('create chain', opts)
    return new microChainInfo({ address, symbol, balance, decimals, url, owner })
  }

  add(opts){
    const mcChain = this.createMicorChainFrom(opts)
    this.microchains.push(mcChain)
  }

  stop(){
    this.running = false
    // this.blockTracker.stop()
  }
}

module.exports = ChainTracker
