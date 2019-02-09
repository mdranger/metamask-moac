const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../../ui/app/actions')

module.exports = connect(mapStateToProps)(CoinbeneForm)

function mapStateToProps (state) {
  return {
    warning: state.appState.warning,
  }
}

inherits(CoinbeneForm, Component)

function CoinbeneForm () {
  Component.call(this)
}

CoinbeneForm.prototype.render = function () {
  var props = this.props

  return h('.flex-column', {
    style: {
      marginTop: '35px',
      padding: '25px',
      width: '100%',
    },
  }, [
    h('.flex-row', {
      style: {
        justifyContent: 'space-around',
        margin: '33px',
        marginTop: '0px',
      },
    }, [
      h('button.btn-green', {
        onClick: this.toCoinbene.bind(this),
      }, 'Continue to Coinbene exchange'),

      h('button.btn-red', {
        onClick: () => props.dispatch(actions.goHome()),
      }, 'Cancel'),
    ]),
  ])
}

CoinbeneForm.prototype.toCoinbene = function () {
  const props = this.props
  const address = props.buyView.buyAddress
  props.dispatch(actions.buyEth({ network: '99', address, amount: 0 }))
}

CoinbeneForm.prototype.renderLoading = function () {
  return h('img', {
    style: {
      width: '27px',
      marginRight: '-27px',
    },
    src: 'images/loading.svg',
  })
}
