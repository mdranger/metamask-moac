import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SendRowWrapper from '../send-row-wrapper/'
import AmountMaxButton from './amount-max-button/'
import CurrencyDisplay from '../../../send/currency-display'

export default class SendAmountRow extends Component {

  static propTypes = {
    amount: PropTypes.string,
    amountConversionRate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    convertedCurrency: PropTypes.string,
    gasTotal: PropTypes.string,
    inError: PropTypes.bool,
    primaryCurrency: PropTypes.string,
    selectedToken: PropTypes.object,
    setMaxModeTo: PropTypes.func,
    tokenBalance: PropTypes.string,
    updateSendAmount: PropTypes.func,
    updateSendAmountError: PropTypes.func,
  }

  validateAmount (amount) {
    const {
      amountConversionRate,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      selectedToken,
      tokenBalance,
      updateSendAmountError,
    } = this.props

    updateSendAmountError({
      amount,
      amountConversionRate,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      selectedToken,
      tokenBalance,
    })
  }

  updateAmount (amount) {
    const { updateSendAmount, setMaxModeTo } = this.props

    setMaxModeTo(false)
    updateSendAmount(amount)
  }

  render () {
    const {
      amount,
      amountConversionRate,
      convertedCurrency,
      gasTotal,
      inError,
      primaryCurrency,
      selectedToken,
    } = this.props

    return (
      <SendRowWrapper
        label={`${this.context.t('amount')}:`}
        showError={inError}
        errorType={'amount'}
      >
        {!inError && gasTotal && <AmountMaxButton />}
        <CurrencyDisplay
          conversionRate={amountConversionRate}
          convertedCurrency={convertedCurrency}
          onBlur={newAmount => this.updateAmount(newAmount)}
          onChange={newAmount => this.validateAmount(newAmount)}
          inError={inError}
          primaryCurrency='MC'//{primaryCurrency || 'ETH'}
          selectedToken={selectedToken}
          value={amount || '0x0'}
        />
      </SendRowWrapper>
    )
  }

}

SendAmountRow.contextTypes = {
  t: PropTypes.func,
}

