const {
  ROPSTEN,
  RINKEBY,
  KOVAN,
  MAINNET,
  MOACMAIN,
  MOACTEST,
  ROPSTEN_CODE,
  RINKEYBY_CODE,
  KOVAN_CODE,
  MOACMAIN_CODE,
  MOACTEST_CODE,
  ROPSTEN_DISPLAY_NAME,
  RINKEBY_DISPLAY_NAME,
  KOVAN_DISPLAY_NAME,
  MAINNET_DISPLAY_NAME,
  MOACMAIN_DISPLAY_NAME,
  MOACTEST_DISPLAY_NAME,
} = require('./enums')

const networkToNameMap = {
  [ROPSTEN]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY]: RINKEBY_DISPLAY_NAME,
  [KOVAN]: KOVAN_DISPLAY_NAME,
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [ROPSTEN_CODE]: ROPSTEN_DISPLAY_NAME,
  [RINKEYBY_CODE]: RINKEBY_DISPLAY_NAME,
  [KOVAN_CODE]: KOVAN_DISPLAY_NAME,
  [MOACMAIN_CODE]: MOACMAIN_DISPLAY_NAME,
  [MOACTEST_CODE]: MOACTEST_DISPLAY_NAME,
}

const getNetworkDisplayName = key => networkToNameMap[key]

module.exports = {
  getNetworkDisplayName,
}
