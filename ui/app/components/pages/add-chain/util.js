import R from 'ramda'

export function checkExistingAddresses (address, chainList = []) {

  if (!address) {
    return false
  }

  const matchesAddress = existingChain => {
    return existingChain.address.toLowerCase() === address.toLowerCase()
  }

  // Extract the chainList info's address only
  const chainAddresses = []
  // for ( var i = 0; i < chains.length;i ++){
  //   chainAddresses[i] = chainList[i].address;
  // }
  for (const cn in chainList){
    console.log("item:", cn, "\n")
    chainAddresses.push(chains[cn].address)
  }

  // return R.any(matchesAddress)(chainList)
  return R.any(matchesAddress)(chainAddresses)
}
