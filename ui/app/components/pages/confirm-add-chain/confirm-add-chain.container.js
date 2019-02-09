import { connect } from 'react-redux'
import ConfirmAddChain from './confirm-add-chain.component'

const { addChains, clearPendingChains } = require('../../../actions')

const mapStateToProps = ({ metamask }) => {
  const { pendingChains } = metamask
  return {
    pendingChains,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addChains: chains => dispatch(addChains(chains)),
    clearPendingChains: () => dispatch(clearPendingChains()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAddChain)
