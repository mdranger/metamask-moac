import { connect } from 'react-redux'
import AddChain from './add-chain.component'

const { setPendingChains, clearPendingChains } = require('../../../actions')

const mapStateToProps = ({ metamask }) => {
  const { identities, microchains, pendingChains } = metamask
  return {
    identities,
    microchains,
    pendingChains,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPendingChains: microchains => dispatch(setPendingChains(microchains)),
    clearPendingChains: () => dispatch(clearPendingChains()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddChain)
