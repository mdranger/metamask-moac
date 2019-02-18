import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ChainListPlaceholder extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  // Display the 
  render () {
    return (
      <div className="chain-list-placeholder">
        <img src="images/search.svg" />
        <div className="chain-list-placeholder__text">
          { this.context.t('addAcquiredChains') }
        </div>
        <a
          className="chain-list-placeholder__link"
          href="https://moacdocs-chn.readthedocs.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          { this.context.t('learnMore') }
        </a>
      </div>
    )
  }
}
