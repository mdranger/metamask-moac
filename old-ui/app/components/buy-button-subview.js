const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../../ui/app/actions')
const CoinbaseForm = require('./coinbase-form')
const ShapeshiftForm = require('./shapeshift-form')
const Loading = require('./loading')
const AccountPanel = require('./account-panel')
const RadioList = require('./custom-radio-list')
const { getNetworkDisplayName } = require('../../../app/scripts/controllers/network/util')

module.exports = connect(mapStateToProps)(BuyButtonSubview)

function mapStateToProps (state) {
  return {
    identity: state.appState.identity,
    account: state.metamask.accounts[state.appState.buyView.buyAddress],
    warning: state.appState.warning,
    buyView: state.appState.buyView,
    network: state.metamask.network,
    provider: state.metamask.provider,
    context: state.appState.currentView.context,
    isSubLoading: state.appState.isSubLoading,
  }
}

inherits(BuyButtonSubview, Component)
function BuyButtonSubview () {
  Component.call(this)
}

BuyButtonSubview.prototype.render = function () {
  return (
    h('div', {
      style: {
        width: '100%',
      },
    }, [
      this.headerSubview(),
      this.primarySubview(),
    ])
  )
}

BuyButtonSubview.prototype.headerSubview = function () {
  const props = this.props
  const isLoading = props.isSubLoading
  return (

    h('.flex-column', {
      style: {
        alignItems: 'center',
      },
    }, [

      // header bar (back button, label)
      h('.flex-row', {
        style: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }, [
        h('i.fa.fa-arrow-left.fa-lg.cursor-pointer.color-blue', {
          onClick: this.backButtonContext.bind(this),
          style: {
            position: 'absolute',
            left: '10px',
          },
        }),
        h('h2.text-transform-uppercase.flex-center', {
          style: {
            width: '100vw',
            background: 'rgb(235, 235, 235)',
            color: 'rgb(174, 174, 174)',
            paddingTop: '4px',
            paddingBottom: '4px',
          },
        }, 'Buy MOAC'),
      ]),

      // loading indication
      h('div', {
        style: {
          position: 'absolute',
          top: '57vh',
          left: '49vw',
        },
      }, [
        h(Loading, { isLoading }),
      ]),

      // account panel
      h('div', {
        style: {
          width: '80%',
        },
      }, [
        h(AccountPanel, {
          showFullAddress: true,
          identity: props.identity,
          account: props.account,
        }),
      ]),

      h('.flex-row', {
        style: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }, [
        h('h3.text-transform-uppercase.flex-center', {
          style: {
            paddingLeft: '15px',
            width: '100vw',
            background: 'rgb(95, 158, 160)',
            color: 'rgb(0, 0, 139)',
            paddingTop: '4px',
            paddingBottom: '4px',
          },
        }, 'Select Service'),
      ]),

    ])

  )
}

/*
 * Remove buy for eth networks
*/
BuyButtonSubview.prototype.primarySubview = function () {
  const props = this.props
  const network = props.network

  switch (network) {
    case 'loading':
      return

    // case '1':
    // Added MOAC main(99), MOAC test(101)
    case '99':
      // return this.mainnetSubview() //removed with simple button link
      return (
        h('div.flex-column', {
          style: {
            alignItems: 'center',
            margin: '20px 50px',
          },
        }, [
          // MOAC only: 
            h('button.text-transform-uppercase', {
              onClick: () => this.navigateTo('https://www.coinbene.com/#/market?pairId=MOACUSDT'),
              style: {
                marginTop: '15px',
              },
            }, 'Coinbene'),
            h('button.text-transform-uppercase', {
              onClick: () => this.navigateTo('https://weidex.vip/'),
              style: {
                marginTop: '15px',
              },
            }, 'Weidex')
      ])
      )
    case '101':
      const networkName = getNetworkDisplayName(network)
      const label = `${networkName} Faucet`
      return (
        h('div.flex-column', {
          style: {
            alignItems: 'center',
            margin: '20px 50px',
          },
        }, [
          h('button.text-transform-uppercase', {
            onClick: () => this.navigateTo('https://faucet.moacchina.com'),
            style: {
              marginTop: '15px',
            },
          }, label),
          // MOAC only: 
          network === '101' ? (
            h('button.text-transform-uppercase', {
              onClick: () => this.navigateTo('https://github.com/MOACChain/chain3/issues/1'),
              style: {
                marginTop: '15px',
              },
            }, 'Testnet token')
          ) : null,
      ])
    )
    default:
      return (
        h('h2.error', 'Unknown network ID')
      )

  }
}

//didn't work
BuyButtonSubview.prototype.mainnetSubview = function () {
  const props = this.props

  return (

    h('.flex-column', {
      style: {
        alignItems: 'center',
      },
    }, [

      h('.flex-row.selected-exchange', {
        style: {
          position: 'relative',
          right: '35px',
          marginTop: '20px',
          marginBottom: '20px',
        },
      }, [
        h(RadioList, {
          defaultFocus: props.buyView.subview,
          labels: [
            'Coinbene',
            'Weidex',
          ],
          subtext: {
            'Coinbene': 'Crypto/FIAT',
            'Weidex': 'Crypto',
          },
          onClick: this.radioHandler.bind(this),
        }),
      ]),

      h('h3.text-transform-uppercase', {
        style: {
          paddingLeft: '15px',
          fontFamily: 'Montserrat Light',
          width: '100vw',
          background: 'rgb(235, 235, 235)',
          color: 'rgb(174, 174, 174)',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
      }, props.buyView.subview),

      this.formVersionSubview(),
    ])

  )
}

BuyButtonSubview.prototype.formVersionSubview = function () {
  const network = this.props.network
  log.debug("BuyButtonSubview.prototype.formVersionSubview")
  if (network === '99') {
    if (this.props.buyView.formView.coinbase) {
      return h(CoinbaseForm, this.props)
    } else if (this.props.buyView.formView.coinbene) {
      return h(CoinbeneForm, this.props)
    }else if (this.props.buyView.formView.shapeshift) {
      return h(ShapeshiftForm, this.props)
    }
  }
}

BuyButtonSubview.prototype.navigateTo = function (url) {
  global.platform.openWindow({ url })
}

BuyButtonSubview.prototype.backButtonContext = function () {
  if (this.props.context === 'confTx') {
    this.props.dispatch(actions.showConfTxPage(false))
  } else {
    this.props.dispatch(actions.goHome())
  }
}

BuyButtonSubview.prototype.radioHandler = function (event) {
  switch (event.target.title) {
    case 'Coinbase':
      return this.props.dispatch(actions.coinBaseSubview())
    // case 'ShapeShift':
    //   return this.props.dispatch(actions.shapeShiftSubview(this.props.provider.type))
    case 'CoinBene'://满币网
      return this.props.dispatch(actions.coinBeneSubview())
  }
}
