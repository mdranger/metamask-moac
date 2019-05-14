const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
// const ChainTracker = require('eth-token-tracker')
const ChainTracker = require('./moac-chain-tracker.js')
const ChainInfo = require('./chain-info.js')
const connect = require('react-redux').connect
const selectors = require('../selectors')
const log = require('loglevel')
const savedMicrochains = require('./microchains.json')

/*
 * The MicroChain need to load from the state
 * 
*/
function mapStateToProps (state) {
  return {
    network: state.metamask.network,
    microchains: state.metamask.microchains,
    userAddress: selectors.getSelectedAddress(state),
    // chainAddress: selectors.getSelectedChainAddress(state),
  }
}

// for microchain, just add the address into the 
// by passing the microchain address, alias and monitor port
const defaultChains = []
// The state saved the Chain info as the following structure:
// selectedChainInfo:{
//   address: null,
//   url: null,
//   symbol: null,
// },
// const microchains = require('eth-contract-metadata')
for (const address in savedMicrochains) {
  const mcChain = savedMicrochains[address]
  if (mcChain.scstype == 'asm') {
    mcChain.address = address
    defaultChains.push(mcChain)
  }
}

ChainList.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps)(ChainList)


inherits(ChainList, Component)
function ChainList () {
  this.state = {
    microchains: [],
    isLoading: true,
    network: null,
  }
  Component.call(this)
}

ChainList.prototype.render = function () {
  const { userAddress } = this.props
  const state = this.state
  const { microchains, isLoading, error } = state

  if (isLoading) {
    return this.message(this.context.t('loadingMicroChainInfo'))
  }

  if (error) {
    log.error(error)
    return h('.hotFix', {
      style: {
        padding: '80px',
      },
    }, [
      this.context.t('troubleChainBalances'),
      h('span.hotFix', {
        style: {
          color: 'rgba(247, 134, 28, 1)',
          cursor: 'pointer',
        },
        onClick: () => {
          global.platform.openWindow({
          // url: `https://ethplorer.io/address/${userAddress}`,
          url: `http://explorer.moac.io/address/${userAddress}`,
        })
        },
      }, this.context.t('here')),
    ])
  }

  return h('div', microchains.map((chainData) => h(ChainInfo, chainData)))

}

ChainList.prototype.message = function (body) {
  return h('div', {
    style: {
      display: 'flex',
      height: '250px',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px',
    },
  }, body)
}

//
ChainList.prototype.componentDidMount = function () {
  this.createFreshChainTokenTracker()
}

/*
 * opts.userAddress
 * opts.chains //microChains
 * opts.pollingInterval
 */

ChainList.prototype.createFreshChainTokenTracker = function () {
  if (this.tracker) {
    // Clean up old trackers when refreshing:
    this.tracker.stop()
    this.tracker.removeListener('update', this.balanceUpdater)
    this.tracker.removeListener('error', this.showError)
  }

  if (!global.moacProvider) return
  const { userAddress } = this.props

  // for MicroChain Tracker, need to input
  // the microChain Info in the state
  // Since each MicroChain has its own monitor
  // no need to pass the global.moacProvider
  this.tracker = new ChainTracker({
    userAddress,
    // provider: global.moacProvider,
    microchains: this.props.microchains,
    pollingInterval: 10000,
  })


  // Set up listener instances for cleaning up
  this.balanceUpdater = this.updateBalances.bind(this)
  this.showError = (error) => {
    this.setState({ error, isLoading: false })
  }
  this.tracker.on('update', this.balanceUpdater)
  this.tracker.on('error', this.showError)

  this.tracker.updateBalances()
  .then(() => {
    this.updateBalances(this.tracker.serialize())
  })
  .catch((reason) => {
    log.error(`Problem updating balances`, reason)
    this.setState({ isLoading: false })
  })
}

ChainList.prototype.componentDidUpdate = function (nextProps) {
  const {
    network: oldNet,
    userAddress: oldAddress,
    microchains,
  } = this.props
  const {
    network: newNet,
    userAddress: newAddress,
    microchains: newTokens,
  } = nextProps

  const isLoading = newNet === 'loading'
  const missingInfo = !oldNet || !newNet || !oldAddress || !newAddress
  const sameUserAndNetwork = oldAddress === newAddress && oldNet === newNet
  const shouldUpdateChainTokens = isLoading || missingInfo || sameUserAndNetwork

  const oldTokensLength = microchains ? microchains.length : 0
  const chainTokensLengthUnchanged = oldTokensLength === newTokens.length

  if (chainTokensLengthUnchanged && shouldUpdateChainTokens) return

  this.setState({ isLoading: true })
  this.createFreshChainTokenTracker()
}

// Should be update to only load the subchain balances
ChainList.prototype.updateBalances = function (microchains) {
  this.setState({ microchains, isLoading: false })
}

ChainList.prototype.componentWillUnmount = function () {
  if (!this.tracker) return
  this.tracker.stop()
}

