/*
 * Define how to handle the chain info
*/
const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')
const Identicon = require('../identicon')

function mapStateToProps (state) {
  return {
    network: state.metamask.network,
    token: state.appState.modal.modalState.props.token,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(actions.hideModal()),
    hideChain: address => {
      dispatch(actions.removeChain(address))
        .then(() => {
          dispatch(actions.hideModal())
        })
    },
  }
}

inherits(HideChainConfirmationModal, Component)
function HideChainConfirmationModal () {
  Component.call(this)

  this.state = {}
}

HideChainConfirmationModal.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(HideChainConfirmationModal)


HideChainConfirmationModal.prototype.render = function () {
  const { token, network, hideChain, hideModal } = this.props
  const { symbol, address } = token

  return h('div.hide-chain-confirmation', {}, [
    h('div.hide-chain-confirmation__container', {
    }, [
      h('div.hide-chain-confirmation__title', {}, [
        this.context.t('hideChainPrompt'),
      ]),

      h(Identicon, {
        className: 'hide-chain-confirmation__identicon',
        diameter: 45,
        address,
        network,
      }),

      h('div.hide-chain-confirmation__symbol', {}, symbol),

      h('div.hide-chain-confirmation__copy', {}, [
        this.context.t('readdChain'),
      ]),

      h('div.hide-chain-confirmation__buttons', {}, [
        h('button.btn-cancel.hide-chain-confirmation__button.allcaps', {
          onClick: () => hideModal(),
        }, [
          this.context.t('cancel'),
        ]),
        h('button.btn-clear.hide-chain-confirmation__button.allcaps', {
          onClick: () => hideChain(address),
        }, [
          this.context.t('hide'),
        ]),
      ]),
    ]),
  ])
}
