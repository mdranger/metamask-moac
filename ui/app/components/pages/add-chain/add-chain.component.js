import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import ethUtil from 'ethereumjs-util'
import { checkExistingAddresses } from './util'
import { chainInfoGetter } from '../../../chain-util'
import { DEFAULT_ROUTE, CONFIRM_ADD_CHAIN_ROUTE } from '../../../routes'
import Button from '../../button'
import TextField from '../../text-field'
import ChainList from './chain-list'
import ChainSearch from './chain-search'

const emptyAddr = '0x0000000000000000000000000000000000000000'
const SEARCH_TAB = 'SEARCH'
const CUSTOM_CHAIN_TAB = 'CUSTOM_CHAIN'

class AddChain extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
    setPendingChains: PropTypes.func,
    pendingChains: PropTypes.object,
    clearPendingChains: PropTypes.func,
    chains: PropTypes.array,
    identities: PropTypes.object,
  }

  constructor (props) {
    super(props)

    this.state = {
      customAddress: '',
      customSymbol: '',
      customDecimals: 0,
      searchResults: [],
      selectedChains: {},
      chainSelectorError: null,
      customAddressError: null,
      customSymbolError: null,
      customDecimalsError: null,
      autoFilled: false,
      displayedTab: SEARCH_TAB,
    }
  }

  componentDidMount () {
    this.chainInfoGetter = chainInfoGetter()
    const { pendingChains = {} } = this.props
    const pendingChainKeys = Object.keys(pendingChains)

    if (pendingChainKeys.length > 0) {
      let selectedChains = {}
      let customChain = {}

      pendingChainKeys.forEach(chainAddress => {
        const chain = pendingChains[chainAddress]
        const { isCustom } = chain

        if (isCustom) {
          customChain = { ...chain }
        } else {
          selectedChains = { ...selectedChains, [chainAddress]: { ...chain } }
        }
      })

      const {
        address: customAddress = '',
        symbol: customSymbol = '',
        decimals: customDecimals = 0,
      } = customChain

      const displayedTab = Object.keys(selectedChains).length > 0 ? SEARCH_TAB : CUSTOM_CHAIN_TAB
      this.setState({ selectedChains, customAddress, customSymbol, customDecimals, displayedTab })
    }
  }

  handleToggleChain (chain) {
    const { address } = chain
    const { selectedChains = {} } = this.state
    const selectedChainsCopy = { ...selectedChains }

    if (address in selectedChainsCopy) {
      delete selectedChainsCopy[address]
    } else {
      selectedChainsCopy[address] = chain
    }

    this.setState({
      selectedChains: selectedChainsCopy,
      chainSelectorError: null,
    })
  }

  hasError () {
    const {
      chainSelectorError,
      customAddressError,
      customSymbolError,
      customDecimalsError,
    } = this.state

    return chainSelectorError || customAddressError || customSymbolError || customDecimalsError
  }

  hasSelected () {
    const { customAddress = '', selectedChains = {} } = this.state
    return customAddress || Object.keys(selectedChains).length > 0
  }

  handleNext () {
    if (this.hasError()) {
      return
    }

    if (!this.hasSelected()) {
      this.setState({ chainSelectorError: this.context.t('mustSelectOne') })
      return
    }

    const { setPendingChains, history } = this.props
    const {
      customAddress: address,
      customSymbol: symbol,
      customDecimals: decimals,
      selectedChains,
    } = this.state

    const customChain = {
      address,
      symbol,
      decimals,
    }

    setPendingChains({ customChain, selectedChains })
    history.push(CONFIRM_ADD_CHAIN_ROUTE)
  }

  async attemptToAutoFillChainParams (address) {
    const { symbol = '', decimals = 0 } = await this.chainInfoGetter(address)

    const autoFilled = Boolean(symbol && decimals)
    this.setState({ autoFilled })
    this.handleCustomSymbolChange(symbol || '')
    this.handleCustomDecimalsChange(decimals)
  }

  handleCustomAddressChange (value) {
    const customAddress = value.trim()
    this.setState({
      customAddress,
      customAddressError: null,
      chainSelectorError: null,
      autoFilled: false,
    })

    const isValidAddress = ethUtil.isValidAddress(customAddress)
    const standardAddress = ethUtil.addHexPrefix(customAddress).toLowerCase()

    switch (true) {
      case !isValidAddress:
        this.setState({
          customAddressError: this.context.t('invalidAddress'),
          customSymbol: '',
          customDecimals: 0,
          customSymbolError: null,
          customDecimalsError: null,
        })

        break
      case Boolean(this.props.identities[standardAddress]):
        this.setState({
          customAddressError: this.context.t('personalAddressDetected'),
        })

        break
      case checkExistingAddresses(customAddress, this.props.chains):
        this.setState({
          customAddressError: this.context.t('chainAlreadyAdded'),
        })

        break
      default:
        if (customAddress !== emptyAddr) {
          this.attemptToAutoFillChainParams(customAddress)
        }
    }
  }

  handleCustomSymbolChange (value) {
    const customSymbol = value.trim()
    const symbolLength = customSymbol.length
    let customSymbolError = null

    if (symbolLength <= 0 || symbolLength >= 10) {
      customSymbolError = this.context.t('symbolBetweenZeroTen')
    }

    this.setState({ customSymbol, customSymbolError })
  }

  handleCustomDecimalsChange (value) {
    const customDecimals = value.trim()
    const validDecimals = customDecimals !== null &&
      customDecimals !== '' &&
      customDecimals >= 0 &&
      customDecimals < 36
    let customDecimalsError = null

    if (!validDecimals) {
      customDecimalsError = this.context.t('decimalsMustZerotoTen')
    }

    this.setState({ customDecimals, customDecimalsError })
  }

  renderCustomChainForm () {
    const {
      customAddress,
      customSymbol,
      customDecimals,
      customAddressError,
      customSymbolError,
      customDecimalsError,
      autoFilled,
    } = this.state

    return (
      <div className="add-chain__custom-chain-form">
        <TextField
          id="custom-address"
          label={this.context.t('chainAddress')}
          type="text"
          value={customAddress}
          onChange={e => this.handleCustomAddressChange(e.target.value)}
          error={customAddressError}
          fullWidth
          margin="normal"
        />
        <TextField
          id="custom-symbol"
          label={this.context.t('chainSymbol')}
          type="text"
          value={customSymbol}
          onChange={e => this.handleCustomSymbolChange(e.target.value)}
          error={customSymbolError}
          fullWidth
          margin="normal"
          disabled={autoFilled}
        />
        <TextField
          id="custom-decimals"
          label={this.context.t('decimal')}
          type="number"
          value={customDecimals}
          onChange={e => this.handleCustomDecimalsChange(e.target.value)}
          error={customDecimalsError}
          fullWidth
          margin="normal"
          disabled={autoFilled}
        />
      </div>
    )
  }

  renderSearchChain () {
    const { chainSelectorError, selectedChains, searchResults } = this.state

    return (
      <div className="add-chain__search-chain">
        <ChainSearch
          onSearch={({ results = [] }) => this.setState({ searchResults: results })}
          error={chainSelectorError}
        />
        <div className="add-chain__chain-list">
          <ChainList
            results={searchResults}
            selectedChains={selectedChains}
            onToggleChain={chain => this.handleToggleChain(chain)}
          />
        </div>
      </div>
    )
  }

  render () {
    const { displayedTab } = this.state
    const { history, clearPendingChains } = this.props

    return (
      <div className="page-container">
        <div className="page-container__header page-container__header--no-padding-bottom">
          <div className="page-container__title">
            { this.context.t('addChains') }
          </div>
          <div className="page-container__tabs">
            <div
              className={classnames('page-container__tab', {
                'page-container__tab--selected': displayedTab === SEARCH_TAB,
              })}
              onClick={() => this.setState({ displayedTab: SEARCH_TAB })}
            >
              { this.context.t('search') }
            </div>
            <div
              className={classnames('page-container__tab', {
                'page-container__tab--selected': displayedTab === CUSTOM_CHAIN_TAB,
              })}
              onClick={() => this.setState({ displayedTab: CUSTOM_CHAIN_TAB })}
            >
              { this.context.t('customChain') }
            </div>
          </div>
        </div>
        <div className="page-container__content">
          {
            displayedTab === CUSTOM_CHAIN_TAB
              ? this.renderCustomChainForm()
              : this.renderSearchChain()
          }
        </div>
        <div className="page-container__footer">
          <Button
            type="default"
            large
            className="page-container__footer-button"
            onClick={() => {
              clearPendingChains()
              history.push(DEFAULT_ROUTE)
            }}
          >
            { this.context.t('cancel') }
          </Button>
          <Button
            type="primary"
            large
            className="page-container__footer-button"
            onClick={() => this.handleNext()}
            disabled={this.hasError() || !this.hasSelected()}
          >
            { this.context.t('next') }
          </Button>
        </div>
      </div>
    )
  }
}

export default AddChain
