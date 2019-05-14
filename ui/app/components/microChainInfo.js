// const BN = require('ethjs').BN
const BN = require('bn.js')
const zero = new BN(0)
var request = require('request');
const Chain3 = require('chain3')

/*
 * Handles MOAC MicroChain
 * token balances
 * replace the contract object with Mointor
 * address  - MicroChain address
 * symbol   - MicroChain symbol if any
 * balance  - balance of MicroChain token of the owner
 * decimals - number of decimals for the balance, default is 0
 * owner    - owner of the token
 * url      - MicroChain monitor url
*/
class microChainInfo {

  constructor (opts = {}) {
    const { address, symbol, balance, decimals, url, owner } = opts
    console.log("build microChain with:", opts)
    this.isLoading = !address || !symbol || !balance || !decimals
    this.address = address || '0x0'  //microChain address
    this.symbol  = symbol || 'TESTChain'
    this.balance = new BN(balance || '0', 16)
    this.decimals = new BN(decimals || 0)
    this.owner = owner

    this.url = url
    this._chain3 = new Chain3();
    this._chain3.setScsProvider(new this._chain3.providers.HttpProvider(this.url));//101

    this.update()
    .catch((reason) => {
      console.error('MicroChain info updating failed', reason)
    })
  }

  // Update the Account info with MicroChain token
  async update() {
    const results = await Promise.all([
      // this.updateSymbol(),
      this.updateBalance(),
      // this.updateDecimals(),
    ])
    this.isLoading = false
    return results
  }

  serialize() {
    return {
      address: this.address,
      symbol: this.symbol,
      balance: this.balance.toString(10),
      decimals: parseInt(this.decimals.toString()),
      url: this.url,
      string: this.stringify(),
    }
  }

  stringify() {
    if (this.balance.eq(zero)) {
      return '0'
    }
    let bal = this.balance.toString()
    let decimals = parseInt(this.decimals.toString())
    const len = bal.length
    const result = `${bal.substr(0, len - decimals)}.${bal.substr(decimals - 1)}`
    return result
  }

  // async updateSymbol() {
  //   const symbol = await this.updateValue('symbol')
  //   if (symbol) {
  //     this.symbol = symbol
  //   }
  //   return this.symbol
  // }

  async updateBalance() {
    const balance = await this.updateValue('balance')
    this.balance = balance
    return this.balance
  }

  // async updateDecimals() {
  //   if (this.decimals !== undefined) return this.decimals
  //   var decimals = await this.updateValue('decimals')
  //   if (decimals) {
  //     this.decimals = decimals
  //   }
  //   return this.decimals
  // }

  // New update value can get balance 
  // from the monitor
  async updateValue(key) {

    let result
    try {
      switch (key) {
        case 'balance':
          console.log("Calling scs.getBalance:", this._chain3.scs.getBalance(this.address,this.owner))
          result = this._chain3.scs.getBalance(this.address,this.owner).toString();
          console.log("Block:", this._chain3.scs.getBlockNumber(this.address), " Bal:", result)
          break
        default:
          // methodName = key
          result = null
      }
      //May need to check the format of commands
      // console.log("Call the contract method to get the value:", result)
      //scs.getBalance()

    } catch (e) {
      console.warn(`failed to load ${key} for microChain at ${this.address}`)
      // console.log("Error is:", e)
      if (key === 'balance') {
        throw e
      }
    }

    if (result) {
      const val = result[0]
      return val
    }

    return this[key]
  }
  // Send calls to the server
  // to update the following values:
  // balance
  //  
  // async oldUpdateValue(key) {
  //   let methodName
  //   let args = []

  //   switch (key) {
  //     case 'balance':
  //       methodName = 'balanceOf'
  //       break
  //     default:
  //       methodName = key
  //   }

  //   let result
  //   try {
  //     // result = await this.contract[methodName](...args)
  //     //May need to check the format of commands
  //     console.log("Call the contract method to get the value")
  //     //scs.getBalance()

  //   } catch (e) {
  //     console.warn(`failed to load ${key} for chain at ${this.address}`)
  //     if (key === 'balance') {
  //       throw e
  //     }
  //   }

  //   if (result) {
  //     const val = result[0]
  //     return val
  //   }

  //   return this[key]
  // }

}

module.exports = microChainInfo
