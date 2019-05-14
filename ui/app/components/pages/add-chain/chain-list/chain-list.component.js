import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { checkExistingAddresses } from '../util'
import ChainListPlaceholder from './chain-list-placeholder'

export default class InfoBox extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    microchains: PropTypes.array,
    results: PropTypes.array,
    selectedChains: PropTypes.object,
    onToggleChain: PropTypes.func,
  }

  render () {
    const { results = [], selectedChains = {}, onToggleChain, microchains = [] } = this.props

    return results.length === 0
      ? <ChainListPlaceholder />
      : (
        <div className="chain-list">
          <div className="chain-list__title">
            { this.context.t('searchResults') }
          </div>
          <div className="chain-list__chains-container">
            {
              Array(6).fill(undefined)
                .map((_, i) => {
                  const { logo, symbol, name, address } = results[i] || {}
                  const chainAlreadyAdded = checkExistingAddresses(address, microchains)

                  return Boolean(logo || symbol || name) && (
                    <div
                      className={classnames('chain-list__chain', {
                        'chain-list__chain--selected': selectedChains[address],
                        'chain-list__chain--disabled': chainAlreadyAdded,
                      })}
                      onClick={() => !chainAlreadyAdded && onToggleChain(results[i])}
                      key={i}
                    >
                      <div
                        className="chain-list__chain-icon"
                        style={{ backgroundImage: logo && `url(images/contract/${logo})` }}>
                      </div>
                      <div className="chain-list__chain-data">
                        <span className="chain-list__chain-name">{ `${name} (${symbol})` }</span>
                      </div>
                    </div>
                  )
                })
            }
          </div>
        </div>
      )
  }
}
