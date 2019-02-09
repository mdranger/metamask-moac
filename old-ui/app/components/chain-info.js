// Display the microChain info
// Replace the token-cell.js
const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const Identicon = require('./identicon')

module.exports = ChainInfo

inherits(ChainInfo, Component)
function ChainInfo () {
  Component.call(this)
}

ChainInfo.prototype.render = function () {
  const props = this.props
  const { address, symbol, string, network, userAddress } = props

  return (
    h('li.chain-info', {
      style: { cursor: network === '1' ? 'pointer' : 'default' },
      onClick: this.view.bind(this, address, userAddress, network),
    }, [

      h(Identicon, {
        diameter: 50,
        address,
        network,
      }),

      h('h3', `${string || 0} ${symbol}`),

      h('span', { style: { flex: '1 0 auto' } }),

      
      h('button', {
        onClick: this.send.bind(this, address),
      }, 'SEND'),
      
      h('button', {
        onClick: this.deposit.bind(this, address),
      }, 'DEPOSIT'),

      h('button', {
        onClick: this.withdraw.bind(this, address),
      }, 'WITHDRAW'),

    ])
  )
}

// the following info are not working
// Send token on the MicroChain
ChainInfo.prototype.send = function (address, event) {
  event.preventDefault()
  event.stopPropagation()
  const url = microChainInfoMonitor(address)
  if (url) {
    navigateTo(url)
  }
}

// Deposit the MOAC on the MicroChain
// to get MicroChain tokens
ChainInfo.prototype.deposit = function (address, event) {
  event.preventDefault()
  event.stopPropagation()
  const url = microChainInfoMonitor(address)
  if (url) {
    navigateTo(url)
  }
}

// Deposit the MOAC on the MicroChain
// to get MicroChain tokens
ChainInfo.prototype.withdraw = function (address, event) {
  event.preventDefault()
  event.stopPropagation()
  const url = microChainInfoMonitor(address)
  if (url) {
    navigateTo(url)
  }
}

ChainInfo.prototype.view = function (address, userAddress, network, event) {
  const url = moacExplorerLinkFor(address, userAddress, network)
  if (url) {
    navigateTo(url)
  }
}

function navigateTo (url) {
  global.platform.openWindow({ url })
}
/*
 * MicroChain explorer
*/
function moacExplorerLinkFor (chainAddress, address, network) {
  // const prefix = prefixForNetwork(network)
  // return `https://${prefix}etherscan.io/token/${chainAddress}?a=${address}`
  if (network == 99){
    return `https://explorer.moac.io/token/${chainAddress}?a=${address}`
  }else if( network == 101){
    return `http://testnet.moac.io:3000/token/${chainAddress}?a=${address}`
  }else
    return null
}

function microChainInfoMonitor (chainAddress) {
  return `https://testnet.moac.io/mcList/${chainAddress}`
}

