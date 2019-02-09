import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ChainListPlaceholder extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  render () {
    return (
      <div className="chain-list-placeholder">
        <img src="images/chainsearch.svg" />
        <div className="chain-list-placeholder__text">
          { this.context.t('addAcquiredChains') }
        </div>
        <a
          className="chain-list-placeholder__link"
          href="https://consensys.zendesk.com/hc/en-us/articles/360004135092"
          target="_blank"
          rel="noopener noreferrer"
        >
          { this.context.t('learnMore') }
        </a>
      </div>
    )
  }
}
