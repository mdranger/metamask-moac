const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')
const { getNetworkDisplayName } = require('../../../../app/scripts/controllers/network/util')
// const ShapeshiftForm = require('../shapeshift-form')

let DIRECT_DEPOSIT_ROW_TITLE
let DIRECT_DEPOSIT_ROW_TEXT
let COINBASE_ROW_TITLE
let COINBASE_ROW_TEXT
let WEIDEX_ROW_TITLE
let WEIDEX_ROW_TEXT
// let SHAPESHIFT_ROW_TITLE
// let SHAPESHIFT_ROW_TEXT
let FAUCET_ROW_TITLE

function mapStateToProps (state) {
  return {
    network: state.metamask.network,
    address: state.metamask.selectedAddress,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    // toCoinbase: (address) => {
    //   dispatch(actions.buyEth({ network: '1', address, amount: 0 }))
    // },
    toCoinbene: (address) => {
      // dispatch(actions.buyEth({ network: '99', address, amount: 0 }))
      dispatch(actions.buyMoac({ network: '99'}))
    },
    toWeidex: (address) => {
      // dispatch(actions.buyEth({ network: '99', address, amount: 0 }))
      dispatch(actions.buyMoac({ network: '99'}))
    },
    hideModal: () => {
      dispatch(actions.hideModal())
    },
    hideWarning: () => {
      dispatch(actions.hideWarning())
    },
    showAccountDetailModal: () => {
      dispatch(actions.showModal({ name: 'ACCOUNT_DETAILS' }))
    },
    toFaucet: network => dispatch(actions.buyMoac({ network })),
  }
}

inherits(DepositEtherModal, Component)
function DepositEtherModal (props, context) {
  Component.call(this)

  // need to set after i18n locale has loaded
  DIRECT_DEPOSIT_ROW_TITLE = context.t('directDepositMc')
  DIRECT_DEPOSIT_ROW_TEXT = context.t('directDepositEtherExplainer')
  COINBASE_ROW_TITLE = context.t('buyCoinbene')
  COINBASE_ROW_TEXT = context.t('buyCoinbeneExplainer')
  WEIDEX_ROW_TITLE = context.t('buyWeidex')
  WEIDEX_ROW_TEXT = context.t('buyWeidexExplainer')
  // SHAPESHIFT_ROW_TITLE = context.t('depositShapeShift')
  // SHAPESHIFT_ROW_TEXT = context.t('depositShapeShiftExplainer')
  FAUCET_ROW_TITLE = context.t('testFaucet')

  this.state = {
    buyingWithShapeshift: false,
  }
}

DepositEtherModal.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DepositEtherModal)


DepositEtherModal.prototype.facuetRowText = function (networkName) {
  return this.context.t('getEtherFromFaucet', [networkName])
}

DepositEtherModal.prototype.renderRow = function ({
  logo,
  title,
  text,
  buttonLabel,
  onButtonClick,
  hide,
  className,
  hideButton,
  hideTitle,
  onBackClick,
  showBackButton,
}) {
  if (hide) {
    return null
  }

  return h('div', {
      className: className || 'deposit-ether-modal__buy-row',
    }, [

    onBackClick && showBackButton && h('div.deposit-ether-modal__buy-row__back', {
      onClick: onBackClick,
    }, [

      h('i.fa.fa-arrow-left.cursor-pointer'),

    ]),

    h('div.deposit-ether-modal__buy-row__logo-container', [logo]),

      h('div.deposit-ether-modal__buy-row__description', [

        !hideTitle && h('div.deposit-ether-modal__buy-row__description__title', [title]),

        h('div.deposit-ether-modal__buy-row__description__text', [text]),

      ]),

      !hideButton && h('div.deposit-ether-modal__buy-row__button', [
        h('button.btn-primary.btn--large.deposit-ether-modal__deposit-button', {
          onClick: onButtonClick,
        }, [buttonLabel]),
      ]),

  ])
}

DepositEtherModal.prototype.render = function () {
  const { network, toCoinbene, toWeidex, address, toFaucet } = this.props
  const { buyingWithShapeshift } = this.state

  const isTestNetwork = ['3', '4', '42','101'].find(n => n === network)
  const networkName = getNetworkDisplayName(network)

  return h('div.page-container.page-container--full-width.page-container--full-height', {}, [

    h('div.page-container__header', [

      h('div.page-container__title', [this.context.t('depositMc')]),

      h('div.page-container__subtitle', [
        this.context.t('needMcInWallet'),
      ]),

      h('div.page-container__header-close', {
        onClick: () => {
          this.setState({ buyingWithShapeshift: false })
          this.props.hideWarning()
          this.props.hideModal()
        },
      }),

    ]),

    h('.page-container__content', {}, [

      h('div.deposit-ether-modal__buy-rows', [

        this.renderRow({
          logo: h('img.deposit-ether-modal__logo', {
            src: './images/deposit-moac.svg',
          }),
          title: DIRECT_DEPOSIT_ROW_TITLE,
          text: DIRECT_DEPOSIT_ROW_TEXT,
          buttonLabel: this.context.t('viewAccount'),
          onButtonClick: () => this.goToAccountDetailsModal(),
          hide: buyingWithShapeshift,
        }),

        //Note, the buttonLabel should contains the
        // string with index in messages.json.
        this.renderRow({
          logo: h('i.fa.fa-tint.fa-2x'),
          title: FAUCET_ROW_TITLE,
          text: this.facuetRowText(networkName),
          buttonLabel: this.context.t('testFaucet'),
          onButtonClick: () => toFaucet(network),
          hide: !isTestNetwork || buyingWithShapeshift,
        }),

        // remove the coinbene image file as background
        this.renderRow({
          logo: h('div.deposit-ether-modal__logo',{
            src: './images/coinbenelog.png',
          }),
          title: COINBASE_ROW_TITLE,
          text: COINBASE_ROW_TEXT,
          buttonLabel: this.context.t('continueToCoinbase'),
          onButtonClick: () => toCoinbene(address),
          hide: isTestNetwork || buyingWithShapeshift,
        }),
        
        // add the weidex option
        this.renderRow({
          logo: h('div.deposit-ether-modal__logo',{
            src: './images/weidexlog.png',
          }),
          title: WEIDEX_ROW_TITLE,
          text: WEIDEX_ROW_TEXT,
          buttonLabel: this.context.t('continueToWeidex'),
          onButtonClick: () => toWeidex(address),
          hide: isTestNetwork,
        }),
        // this.renderRow({
        //   logo: h('div.deposit-ether-modal__logo', {
        //     style: {
        //       backgroundImage: 'url(\'./images/shapeshift logo.png\')',
        //     },
        //   }),
        //   title: SHAPESHIFT_ROW_TITLE,
        //   text: SHAPESHIFT_ROW_TEXT,
        //   buttonLabel: this.context.t('shapeshiftBuy'),
        //   onButtonClick: () => this.setState({ buyingWithShapeshift: true }),
        //   hide: isTestNetwork,
        //   hideButton: buyingWithShapeshift,
        //   hideTitle: buyingWithShapeshift,
        //   onBackClick: () => this.setState({ buyingWithShapeshift: false }),
        //   showBackButton: this.state.buyingWithShapeshift,
        //   className: buyingWithShapeshift && 'deposit-ether-modal__buy-row__shapeshift-buy',
        // }),

        // buyingWithShapeshift && h(ShapeshiftForm),

      ]),

    ]),
  ])
}

DepositEtherModal.prototype.goToAccountDetailsModal = function () {
  this.props.hideWarning()
  this.props.hideModal()
  this.props.showAccountDetailModal()
}
