import { connect } from 'react-redux'
import ChainList from './chain-list.component'

const mapStateToProps = ({ metamask }) => {
  const { chains } = metamask
  return {
    chains,
  }
}

export default connect(mapStateToProps)(ChainList)
