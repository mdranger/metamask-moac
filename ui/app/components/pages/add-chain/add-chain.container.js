import { connect } from 'react-redux'
import AddChain from './add-chain.component'

const { setPendingChains, clearPendingChains } = require('../../../actions')

const mapStateToProps = ({ metamask }) => {
  const { identities, chains, pendingChains } = metamask
  return {
    identities,
    chains,
    pendingChains,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPendingChains: chains => dispatch(setPendingChains(chains)),
    clearPendingChains: () => dispatch(clearPendingChains()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddChain)
