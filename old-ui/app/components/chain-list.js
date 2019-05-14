const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const MicroChainMonitor = require('eth-token-tracker')
const chainInfo = require('./chain-info.js')
const log = require('loglevel')

/*
 * MicroChain List used to add and
 * remove chain list
*/
module.exports = ChainList

inherits(ChainList, Component)
function ChainList () {
  this.state = {
    chains: [],
    isLoading: true,
    network: null,
  }
  Component.call(this)
}

ChainList.prototype.render = function () {
  const state = this.state
  const { chains, isLoading, error } = state
  const { userAddress, network } = this.props

  if (isLoading) {
    return this.message('Loading')
  }

  if (error) {
    log.error(error)
    return h('.hotFix', {
      style: {
        padding: '80px',
      },
    }, [
      'We had trouble loading the MicroChain monitors. You can view them ',
      h('span.hotFix', {
        style: {
          color: 'rgba(174, 174, 174, 1)',
          cursor: 'pointer',
        },
        onClick: () => {
          global.platform.openWindow({
          url: `https://explorer.moac.io/mclist`, //list the MicroChain Info
        })
        },
      }, 'here'),
    ])
  }

  const microChainViews = chains.map((mchainData) => {
    //Vnode network the MicroChain linked to
    mchainData.network = network
    mchainData.userAddress = userAddress
    return h(chainInfo, mchainData)
  })

  return h('.full-flex-height', [
    this.renderMicroChainStatusBar(),

    h('ol.full-flex-height.flex-column', {
      style: {
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      },
    }, [
      h('style', `

        li.chain-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 10px;
          min-height: 50px;
        }

        li.chain-info > h3 {
          margin-left: 12px;
        }

        li.chain-info:hover {
          background: white;
          cursor: pointer;
        }

      `),
      ...microChainViews,
      h('.flex-grow'),
    ]),
  ])
}

ChainList.prototype.renderMicroChainStatusBar = function () {
  const { chains } = this.state

  let msg
  if (chains.length === 1) {
    msg = `You have 1 MicroChain listed`
  } else if (chains.length > 1) {
    msg = `You have ${chains.length} MicroChains`
  } else {
    msg = `No MicroChain found`
  }

  return h('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '70px',
      padding: '10px',
    },
  }, [
    h('span', msg),
    h('button', {
      key: 'reveal-account-bar',
      onClick: (event) => {
        event.preventDefault()
        this.props.addChain()
      },
      style: {
        display: 'flex',
        height: '40px',
        padding: '10px',
        justifyContent: 'center',
        alignItems: 'center',
      },
    }, [
      'ADD CHAIN',
    ]),
  ])
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

ChainList.prototype.componentDidMount = function () {
  this.createMicroChainMonitor()
}

// This should be changed to microChainMonitor
ChainList.prototype.createMicroChainMonitor = function () {
  if (this.tracker) {
    // Clean up old trackers when refreshing:
    this.tracker.stop()
    this.tracker.removeListener('update', this.balanceUpdater)
    this.tracker.removeListener('error', this.showError)
  }

  if (!global.moacProvider) return
  const { userAddress } = this.props
  this.tracker = new MicroChainMonitor({
    userAddress,
    provider: global.moacProvider,
    chains: this.props.chains,
    pollingInterval: 8000,
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

ChainList.prototype.componentWillUpdate = function (nextProps) {
  if (nextProps.network === 'loading') return
  const oldNet = this.props.network
  const newNet = nextProps.network

  if (oldNet && newNet && newNet !== oldNet) {
    this.setState({ isLoading: true })
    this.createMicroChainMonitor()
  }
}

ChainList.prototype.updateBalances = function (chains) {
  this.setState({ chains, isLoading: false })
}

ChainList.prototype.componentWillUnmount = function () {
  if (!this.tracker) return
  this.tracker.stop()
}

