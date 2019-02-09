import { connect } from 'react-redux'
import { compose } from 'recompose'
import withChainTracker from '../../../../helpers/with-chain-tracker'
import ChainBalance from './chain-balance.component'
import selectors from '../../../../selectors'

const mapStateToProps = state => {
  return {
    userAddress: selectors.getSelectedAddress(state),
  }
}

export default compose(
  connect(mapStateToProps),
  withChainTracker
)(ChainBalance)
