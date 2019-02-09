import R from 'ramda'

export function checkExistingAddresses (address, chainList = []) {
  if (!address) {
    return false
  }

  const matchesAddress = existingChain => {
    return existingChain.address.toLowerCase() === address.toLowerCase()
  }

  return R.any(matchesAddress)(chainList)
}
