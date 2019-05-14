const valuesFor = require('./util').valuesFor
const abi = require('human-standard-token-abi')

const {
  multiplyCurrencies,
} = require('./conversion-util')

//added getSelectedChain
const selectors = {
  getSelectedAddress,
  getSelectedIdentity,
  getSelectedAccount,
  getSelectedToken,
  getMicroChainAddressList,
  getSelectedChainAddress,
  getSelectedChainUrl,
  getSelectedTokenExchangeRate,
  getTokenExchangeRate,
  conversionRateSelector,
  transactionsSelector,
  accountsWithSendEtherInfoSelector,
  getCurrentAccountWithSendEtherInfo,
  getGasPrice,
  getGasLimit,
  getForceGasMin,
  getAddressBook,
  getSendFrom,
  getCurrentCurrency,
  getSendAmount,
  getSelectedTokenToFiatRate,
  getSelectedTokenContract,
  autoAddToBetaUI,
  getSendMaxModeState,
  getCurrentViewContext,
}

module.exports = selectors

// Return a single Address or the 1st account in the account list 
function getSelectedAddress (state) {
  const selectedAddress = state.metamask.selectedAddress || Object.keys(state.metamask.accounts)[0]

  return selectedAddress
}

function getSelectedIdentity (state) {
  const selectedAddress = getSelectedAddress(state)
  const identities = state.metamask.identities

  return identities[selectedAddress]
}

// Return the account object with input address
function getSelectedAccount (state) {
  const accounts = state.metamask.accounts
  const selectedAddress = getSelectedAddress(state)

  return accounts[selectedAddress]
}

function getSelectedToken (state) {
  const tokens = state.metamask.tokens || []
  const selectedTokenAddress = state.metamask.selectedTokenAddress
  const selectedToken = tokens.filter(({ address }) => address === selectedTokenAddress)[0]
  const sendToken = state.metamask.send.token

  return selectedToken || sendToken || null
}

// Return the microChain address
// if it is selected
function getSelectedChainAddress (state) {
  // const chains = state.metamask.microchains || []
  // const selectedChainAddress = state.metamask.selectedChainAddress
  const selectedChainAddress = state.metamask.selectedChainInfo.address
  // const selectedChain = chains.filter(({ address }) => address === selectedChainAddress)[0]
  const sendChainToken = state.metamask.send.token

  // return selectedChain.address || sendChainToken || null
  return selectedChainAddress || sendChainToken || null
}

// Return the selected Chain url
function getSelectedChainUrl (state) {
  // const chains = state.metamask.microchains || []
  const selectedChainUrl = state.metamask.selectedChainInfo.url
  // const selectedChain = chains.filter(({ address }) => address === selectedChainAddress)[0]

  return selectedChainUrl || null
}

// Added to be used in chain-list.js
// to display the address of the microChains only
// called by:
function getMicroChainAddressList (state) {
  const chains = state.metamask.microchains || []
  const chainAddressList = []

  //Extract the address of MicroChains and saved in
  // the returned list
  for (const cn in chains){
    chainAddressList[cn] = chains[cn].address
  }

  return chainAddressList || null
}

function getSelectedTokenExchangeRate (state) {
  const contractExchangeRates = state.metamask.contractExchangeRates
  const selectedToken = getSelectedToken(state) || {}
  const { address } = selectedToken
  return contractExchangeRates[address] || 0
}

function getTokenExchangeRate (state, address) {
  const contractExchangeRates = state.metamask.contractExchangeRates
  return contractExchangeRates[address] || 0
}

function conversionRateSelector (state) {
  return state.metamask.conversionRate
}

function getAddressBook (state) {
  return state.metamask.addressBook
}

function accountsWithSendEtherInfoSelector (state) {
  const {
    accounts,
    identities,
  } = state.metamask

  const accountsWithSendEtherInfo = Object.entries(accounts).map(([key, account]) => {
    return Object.assign({}, account, identities[key])
  })

  return accountsWithSendEtherInfo
}

function getCurrentAccountWithSendEtherInfo (state) {
  const currentAddress = getSelectedAddress(state)
  const accounts = accountsWithSendEtherInfoSelector(state)

  return accounts.find(({ address }) => address === currentAddress)
}

function transactionsSelector (state) {
  const { network, selectedTokenAddress } = state.metamask
  const unapprovedMsgs = valuesFor(state.metamask.unapprovedMsgs)
  const shapeShiftTxList = (network === '1') ? state.metamask.shapeShiftTxList : undefined
  const transactions = state.metamask.selectedAddressTxList || []
  const txsToRender = !shapeShiftTxList ? transactions.concat(unapprovedMsgs) : transactions.concat(unapprovedMsgs, shapeShiftTxList)

  // console.log({txsToRender, selectedTokenAddress})
  return selectedTokenAddress
    ? txsToRender
      .filter(({ txParams }) => txParams && txParams.to === selectedTokenAddress)
      .sort((a, b) => b.time - a.time)
    : txsToRender
      .sort((a, b) => b.time - a.time)
}

function getGasPrice (state) {
  return state.metamask.send.gasPrice
}

function getGasLimit (state) {
  return state.metamask.send.gasLimit
}

function getForceGasMin (state) {
  return state.metamask.send.forceGasMin
}

function getSendFrom (state) {
  return state.metamask.send.from
}

function getSendAmount (state) {
  return state.metamask.send.amount
}

function getSendMaxModeState (state) {
  return state.metamask.send.maxModeOn
}

function getCurrentCurrency (state) {
  return state.metamask.currentCurrency
}

function getSelectedTokenToFiatRate (state) {
  const selectedTokenExchangeRate = getSelectedTokenExchangeRate(state)
  const conversionRate = conversionRateSelector(state)

  const tokenToFiatRate = multiplyCurrencies(
    conversionRate,
    selectedTokenExchangeRate,
    { toNumericBase: 'dec' }
  )

  return tokenToFiatRate
}

function getSelectedTokenContract (state) {
  const selectedToken = getSelectedToken(state)
  return selectedToken
    ? global.eth.contract(abi).at(selectedToken.address)
    : null
}

function autoAddToBetaUI (state) {
  const autoAddTransactionThreshold = 12
  const autoAddAccountsThreshold = 2
  const autoAddTokensThreshold = 1

  const numberOfTransactions = state.metamask.selectedAddressTxList.length
  const numberOfAccounts = Object.keys(state.metamask.accounts).length
  const numberOfTokensAdded = state.metamask.tokens.length

  const userPassesThreshold = (numberOfTransactions > autoAddTransactionThreshold) &&
    (numberOfAccounts > autoAddAccountsThreshold) &&
    (numberOfTokensAdded > autoAddTokensThreshold)
  const userIsNotInBeta = !state.metamask.featureFlags.betaUI

  return userIsNotInBeta && userPassesThreshold
}

function getCurrentViewContext (state) {
  const { currentView = {} } = state.appState
  return currentView.context
}
