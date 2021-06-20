import JSBI from 'jsbi'
import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, TokenAmount, Token, Rate, ETHER } from '@sfpy/web3-sdk'
import { useCallback, useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ParsedQs } from 'qs'
import { AppDispatch, AppState } from '../index'
import { Field, setPaymentId, selectCurrency, setApiState } from './actions'

import { Wrapped, WrappedProps } from '../../order'
import { usePayment, useCancelOrder, ApiState } from '../../api'

import { NETWORK_LABELS } from '../../components/Header'

import { useCurrency } from '../../hooks/useTokens'
import { useAllRates } from '../../hooks/useRates'
import { wrappedUSDCAmount } from '../../utils/wrappedCurrency'
import { useCurrencyBalance } from '../wallet/hooks'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useParsedQueryString } from '../../hooks/useParsedQueryString'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'

export function usePayState(): AppState['pay'] {
  return useSelector<AppState, AppState['pay']>((state) => state.pay)
}

export function usePayActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : '',
        })
      )
    },
    [dispatch]
  )

  return {
    onCurrencySelection,
  }
}

export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }

  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }

  return undefined
}

export function useDerivedPayInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalance: { [field in Field]?: CurrencyAmount }
  amountIn: CurrencyAmount | undefined
  recipient?: string
  requestId?: string
  inputError?: string
  rate?: Rate
} {
  const { account, chainId } = useActiveWeb3React()

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
  } = usePayState()

  const inputCurrency = useCurrency(inputCurrencyId)

  const relevantTokenBalance = useCurrencyBalance(account ?? undefined, inputCurrency ?? undefined)

  const wrapped = usePaymentResponse()

  const currencyBalance = {
    [Field.INPUT]: relevantTokenBalance,
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
  }

  const recipient = wrapped?.order?.recipient
  const requestId = wrapped?.order?.id
  const parsedAmount = wrappedUSDCAmount(chainId, wrapped?.order?.gradTotalRaw ?? '0')
  const rate = useAllRates(inputCurrency)
  const amountIn = parsedAmount ? rate?.executionPrice?.quote(parsedAmount) : undefined
  const balanceIn = currencyBalance[Field.INPUT]

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!requestId) {
    inputError = 'Invalid Request Id'
  }

  if (!recipient) {
    inputError = inputError ?? 'Invalid Recipient'
  }

  if (wrapped?.order?.chainId !== chainId) {
    inputError = inputError ?? `Please switch to the ${NETWORK_LABELS[wrapped?.order?.chainId]} network`
  }

  if (!currencies[Field.INPUT]) {
    inputError = inputError ?? 'Select a token'
  }

  if (!amountIn) {
    inputError = inputError ?? 'Invalid ' + inputCurrency?.symbol + ' exchange rate'
  }

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = 'Insufficient ' + amountIn.currency.symbol + ' balance'
  }

  if (wrapped?.order?.status === 'PAID') {
    inputError = 'Request has been paid'
  }

  return {
    currencies,
    currencyBalance,
    amountIn,
    recipient,
    requestId,
    inputError,
    rate,
  }
}

function parsePaymentIdFromURLParameter(urlParam: any): string | null {
  return typeof urlParam === 'string' ? (urlParam.length > 0 ? urlParam : null) : null
}

export function queryParametersToPaymentId(parsedQs: ParsedQs): string | null {
  let paymentId = parsePaymentIdFromURLParameter(parsedQs.payment)
  return paymentId
}

export function usePaymentIdFromURLSearch(): { paymentId: string | null } {
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<{ paymentId: string | null } | undefined>()

  useEffect(() => {
    const parsed = queryParametersToPaymentId(parsedQs)
    dispatch(setPaymentId({ paymentId: parsed }))

    setResult({ paymentId: parsed })
  }, [dispatch, parsedQs])

  return result
}

export function useCancelOrderCallback(): {
  execute: () => Promise<any>
} {
  const urlParams = usePaymentIdFromURLSearch()
  const { execute } = useCancelOrder(urlParams?.paymentId)

  const handleCancel = () => {
    return new Promise((resolve, reject) => {
      if (!execute) {
        reject('Invalid callback')
        return
      }

      resolve('')
      return

      execute({})
      .then(() => resolve(''))
      .catch(() => reject('Unable to cancel transaction, please try again. If the error persists, contact support.'))
    })
  }

  return {
    execute: handleCancel
  }
}

export function usePaymentResponse(): Wrapped | null {
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<Wrapped | null>(null)
  const urlParams = usePaymentIdFromURLSearch()
  
  const { data: payment, state, error } = usePayment(urlParams?.paymentId)

  // show popup on error
  useApiErrorPopup(error)

  const props = payment ? (payment as WrappedProps) : null

  useEffect(() => {
    dispatch(setApiState({ apiState: state }))
    if (!props) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const order = new Wrapped(props as WrappedProps)

    setResult(order)
  }, [dispatch, state, props, setResult])

  return result
}

export function usePaymentState(): [ApiState] {
  const state = useSelector<AppState, AppState['pay']['apiState']>((state) => state.pay.apiState)
  return useMemo(() => {
    if (!state) {
      return [ApiState.LOADING]
    }
    return [state]
  }, [state])
}
