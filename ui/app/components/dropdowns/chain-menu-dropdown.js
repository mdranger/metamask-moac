const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')


ChainMenuDropdown.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(null, mapDispatchToProps)(ChainMenuDropdown)

function mapDispatchToProps (dispatch) {
  return {
    showHideChainConfirmationModal: (chain) => {
      dispatch(actions.showModal({ name: 'HIDE_CHAIN_CONFIRMATION', chain }))
    },
  }
}


inherits(ChainMenuDropdown, Component)
function ChainMenuDropdown () {
  Component.call(this)

  this.onClose = this.onClose.bind(this)
}

ChainMenuDropdown.prototype.onClose = function (e) {
  e.stopPropagation()
  this.props.onClose()
}

ChainMenuDropdown.prototype.render = function () {
  const { showHideChainConfirmationModal } = this.props

  return h('div.chain-menu-dropdown', {}, [
    h('div.chain-menu-dropdown__close-area', {
      onClick: this.onClose,
    }),
    h('div.chain-menu-dropdown__container', {}, [
      h('div.chain-menu-dropdown__options', {}, [

        h('div.chain-menu-dropdown__option', {
          onClick: (e) => {
            e.stopPropagation()
            showHideChainConfirmationModal(this.props.chain)
            this.props.onClose()
          },
        }, this.context.t('hideChain')),

      ]),
    ]),
  ])
}
