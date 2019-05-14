/*
 * handle the info for MicroChain
 * Note the MicroChain tokens need to be swapped with MotherChain tokens or moac.
 * 
*/
const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const Identicon = require('./identicon')
// const prefixForNetwork = require('../../lib/etherscan-prefix-for-network')
const selectors = require('../selectors')
const actions = require('../actions')
const { conversionUtil, multiplyCurrencies } = require('../conversion-util')
// Update with MicroChain
const ChainMenuDropdown = require('./dropdowns/chain-menu-dropdown.js')



function mapStateToProps (state) {
  return {
    network: state.metamask.network,
    currentCurrency: state.metamask.currentCurrency,
    selectedChainAddress: state.metamask.selectedChainInfo.address,
    userAddress: selectors.getSelectedAddress(state),
    contractExchangeRates: state.metamask.contractExchangeRates,
    conversionRate: state.metamask.conversionRate,
    sidebarOpen: state.appState.sidebarOpen,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSelectedChain: address => dispatch(actions.setSelectedChain(address)),
    hideSidebar: () => dispatch(actions.hideSidebar()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ChainInfo)

inherits(ChainInfo, Component)
function ChainInfo () {
  Component.call(this)

  this.state = {
    chainMenuOpen: false,
  }
}

// Set the value of the component with the state variables
ChainInfo.prototype.render = function () {
  const { chainMenuOpen } = this.state
  const props = this.props
  const {
    address,
    symbol,
    string,
    network,
    setSelectedChain,
    selectedChainAddress,
    contractExchangeRates,
    conversionRate,
    hideSidebar,
    sidebarOpen,
    currentCurrency,
    // userAddress,
  } = props

  let currentTokenToFiatRate
  let currentTokenInFiat
  let formattedFiat = ''

  if (contractExchangeRates[address]) {
    currentTokenToFiatRate = multiplyCurrencies(
      contractExchangeRates[address],
      conversionRate
    )
    currentTokenInFiat = conversionUtil(string, {
      fromNumericBase: 'dec',
      fromCurrency: symbol,
      toCurrency: currentCurrency.toUpperCase(),
      numberOfDecimals: 2,
      conversionRate: currentTokenToFiatRate,
    })
    formattedFiat = currentTokenInFiat.toString() === '0'
      ? ''
      : `${currentTokenInFiat} ${currentCurrency.toUpperCase()}`
  }

  const showFiat = Boolean(currentTokenInFiat) && currentCurrency.toUpperCase() !== symbol

  return (
    h('div.chain-list-item', {
      className: `chain-list-item ${selectedChainAddress === address ? 'chain-list-item--active' : ''}`,
      // style: { cursor: network === '1' ? 'pointer' : 'default' },
      // onClick: this.view.bind(this, address, userAddress, network),
      onClick: () => {
        setSelectedChain(address)
        selectedChainAddress !== address && sidebarOpen && hideSidebar()
      },
    }, [

      h(Identicon, {
        className: 'chain-list-item__identicon',
        diameter: 50,
        address,
        network,
      }),

      h('div.chain-list-item__balance-ellipsis', null, [
        h('div.chain-list-item__balance-wrapper', null, [
          h('div.chain-list-item__chain-balance', `${string || 0}`),
          h('div.chain-list-item__chain-symbol', symbol),
          showFiat && h('div.chain-list-item__fiat-amount', {
            style: {},
          }, formattedFiat),
        ]),

        h('i.fa.fa-ellipsis-h.fa-lg.chain-list-item__ellipsis.cursor-pointer', {
          onClick: (e) => {
            e.stopPropagation()
            this.setState({ chainMenuOpen: true })
          },
        }),

      ]),


      chainMenuOpen && h(ChainMenuDropdown, {
        onClose: () => this.setState({ chainMenuOpen: false }),
        chain: { symbol, address },
      }),

      /*
      h('button', {
        onClick: this.send.bind(this, address),
      }, 'SEND'),
      */

    ])
  )
}

// Send MicroChain token
ChainInfo.prototype.send = function (address, event) {
  event.preventDefault()
  event.stopPropagation()
  //Should be used to connect the URL
  const url = address
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

function moacExplorerLinkFor (chainAddress, address, network) {
  if (network == 99){
    return `https://explorer.moac.io/mclist/${chainAddress}?a=${address}`
  }else if( network == 101){
    return `http://testnet.moac.io:3000/mclist/${chainAddress}?a=${address}`
  }else
    return null
}


