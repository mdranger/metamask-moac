/*
 * The component to track all MicroChains
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChainTracker from '../components/moac-chain-tracker.js'

// MicroChain only has one address
// 
const withChainTracker = WrappedComponent => {
  return class ChainTrackerWrappedComponent extends Component {
    // Require 
    // userAddress: account address of the MicroChain
    // microChain: Microchain object as defined in moackmask.js
    // 
    static propTypes = {
      userAddress: PropTypes.string.isRequired,
      microChain: PropTypes.object.isRequired,
    }

    constructor (props) {
      super(props)

      this.state = {
        string: '',
        symbol: '',
        error: null,
      }

      this.tracker = null
      this.updateBalance = this.updateBalance.bind(this)
      this.setError = this.setError.bind(this)
    }

    componentDidMount () {
      this.createFreshChainTracker()
    }

    // Update the chain-tracker when any properties changed
    componentDidUpdate (prevProps) {
      const { userAddress: newAddress, microChain: { address: newTokenAddress, url: newUrl } } = this.props
      const { userAddress: oldAddress, microChain: { address: oldTokenAddress, url: oldUrl } } = prevProps

      if ((oldAddress === newAddress) && (oldTokenAddress === newTokenAddress)
        && (oldUrl == newUrl)) {
        return
      }

      if ((!oldAddress || !newAddress) && (!oldTokenAddress || !newTokenAddress)) {
        return
      }

      this.createFreshChainTracker()
    }

    componentWillUnmount () {
      this.removeListeners()
    }

    //Generate the new Chain tracker
    //using input url and info
    createFreshChainTracker () {
      this.removeListeners()

      // This may not need if we have url
      // but it's good to check the MotherChain monitor
      if (!global.moacProvider) {
        return
      }

      // for a single MicroChain
      const { userAddress, microChain } = this.props

      this.tracker = new ChainTracker({
        userAddress,
        chains:[microChain],
        pollingInterval: 8000,
      })

      this.tracker.on('update', this.updateBalance)
      this.tracker.on('error', this.setError)

      this.tracker.updateBalances()
        .then(() => this.updateBalance(this.tracker.serialize()))
        .catch(error => this.setState({ error: error.message }))
    }

    setError (error) {
      this.setState({ error })
    }

    // Update the microChain balances
    // using the micro-chain-tracker
    // string is the balance returned from micro-chain-tracker serialize method
    updateBalance (microChains = []) {
      const [{ string, symbol }] = microChains
      this.setState({ string, symbol, error: null })
    }

    removeListeners () {
      if (this.tracker) {
        this.tracker.stop()
        this.tracker.removeListener('update', this.updateBalance)
        this.tracker.removeListener('error', this.setError)
      }
    }

    render () {
      const { string, symbol, error } = this.state

      return (
        <WrappedComponent
          { ...this.props }
          string={string}
          symbol={symbol}
          error={error}
        />
      )
    }
  }
}

module.exports = withChainTracker
