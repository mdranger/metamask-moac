import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DEFAULT_ROUTE, ADD_CHAIN_ROUTE } from '../../../routes'
import Button from '../../button'
import Identicon from '../../../components/identicon'
import ChainBalance from './chain-balance'

export default class ConfirmAddChain extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
    clearPendingChains: PropTypes.func,
    addChains: PropTypes.func,
    pendingChains: PropTypes.object,
  }

  componentDidMount () {
    const { pendingChains = {}, history } = this.props

    if (Object.keys(pendingChains).length === 0) {
      history.push(DEFAULT_ROUTE)
    }
  }

  // MicroChain may not have name with it
  // Only display the symbol if no name
  getChainName (name, symbol) {
    return typeof name === 'undefined'
      ? symbol
      : `${name} (${symbol})`
  }

  render () {
    const { history, addChains, clearPendingChains, pendingChains } = this.props

    return (
      <div className="page-container">
        <div className="page-container__header">
          <div className="page-container__title">
            { this.context.t('addChains') }
          </div>
          <div className="page-container__subtitle">
            { this.context.t('likeToAddChains') }
          </div>
        </div>
        <div className="page-container__content">
          <div className="confirm-add-chain">
            <div className="confirm-add-chain__header">
              <div className="confirm-add-chain__chain">
                { this.context.t('chain') }
              </div>
              <div className="confirm-add-chain__balance">
                { this.context.t('balance') }
              </div>
            </div>
            <div className="confirm-add-chain__chain-list">
              {
                Object.entries(pendingChains)
                  .map(([ address, chain ]) => {
                    const { name, symbol } = chain

                    return (
                      <div
                        className="confirm-add-chain__chain-list-item"
                        key={address}
                      >
                        <div className="confirm-add-chain__chain confirm-add-chain__data">
                          <Identicon
                            className="confirm-add-chain__chain-icon"
                            diameter={48}
                            address={address}
                          />
                          <div className="confirm-add-chain__name">
                            { this.getChainName(name, symbol) }
                          </div>
                        </div>
                        <div className="confirm-add-chain__balance">
                          <ChainBalance chain={chain} />
                        </div>
                      </div>
                    )
                })
              }
            </div>
          </div>
        </div>
        <div className="page-container__footer">
          <Button
            type="default"
            large
            className="page-container__footer-button"
            onClick={() => history.push(ADD_CHAIN_ROUTE)}
          >
            { this.context.t('back') }
          </Button>
          <Button
            type="primary"
            large
            className="page-container__footer-button"
            onClick={() => {
              addChains(pendingChains)
                .then(() => {
                  clearPendingChains()
                  history.push(DEFAULT_ROUTE)
                })
            }}
          >
            { this.context.t('addChains') }
          </Button>
        </div>
      </div>
    )
  }
}
