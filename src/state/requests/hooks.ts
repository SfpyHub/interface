import {
  setApiState,
  setRequestsApiState,
  setRequests,
  setPayments,
  setPayment,
  setPaymentApiState,
  setPaymentsApiState,
  setRequestsPage,
} from './actions'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { Wrapped, WrappedProps, Payment, PaymentProps } from '../../order'
import { CurrencyAmount, TokenAmount, Currency, JSBI, Pool, UNKNOWN } from '@sfpy/web3-sdk'
import { usePayment, useFetchOrders, useFetchPayments, useFetchPayment, ApiState, Metadata } from '../../api'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useDerivedAuthState } from '../auth/hooks'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'
import { useCurrency } from '../../hooks/useTokens'
import { useTokenBalances } from '../wallet/hooks'
import { wrappedToken, wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { usePool } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'

export function useDerivedRequestInfo(): {
  order?: Wrapped
} {
  const order = usePaymentResponse('')

  return {
    order,
  }
}

export function useRequestsActionHandlers(): {
  onClickNext: () => void
  onClickPrev: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const page = useRequestsPageNumber()

  const onClickNext = useCallback(() => {
    dispatch(setRequestsPage({ page: page + 1 }))
  }, [dispatch, page])

  const onClickPrev = useCallback(() => {
    dispatch(setRequestsPage({ page: page - 1 }))
  }, [dispatch, page])

  return {
    onClickNext,
    onClickPrev,
  }
}

export function useDerivedRequestsInfo(): {
  nextEnabled: boolean
  prevEnabled: boolean
} {
  const { limit, count } = useRequestsMetadata()
  const page = useRequestsPageNumber()
  const totalPages = Math.ceil(count / limit)

  const paginationEnabled = totalPages > 1
  const nextEnabled = paginationEnabled && page + 1 < totalPages
  const prevEnabled = paginationEnabled && page > 0

  return {
    nextEnabled,
    prevEnabled,
  }
}

export function useAllRequestsData() {
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<Wrapped[]>([])
  const { chainId: chain } = useActiveWeb3React()
  const { apikey } = useDerivedAuthState()
  const reqMetadata = useRequestsMetadata()
  const page = useRequestsPageNumber()
  const params = {
    ...reqMetadata,
    offset: reqMetadata.limit * page,
    chain,
    kind: 'REQUEST',
  }
  const {
    data: { data: requests, metadata },
    state,
    error,
  } = useFetchOrders(params, apikey?.pvtKey)

  // show popup on error
  useApiErrorPopup(error)

  const props = useMemo(() => (requests ? (requests as WrappedProps[]) : []), [requests])

  useEffect(() => {
    dispatch(setRequestsApiState({ apiState: state }))
    if (!props.length) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const requests = props.map((p) => new Wrapped(p as WrappedProps))
    dispatch(setRequests({ data: props, metadata, error: '' }))
    setResult(requests)
  }, [dispatch, metadata, state, props, setResult])

  return result
}

export function usePaymentsResponse(paymentId: string): Payment[] {
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<Payment[]>([])
  const { chainId: chain } = useActiveWeb3React()
  const { apikey } = useDerivedAuthState()
  const paymentMetadata = usePaymentsMetadata()
  const params = {
    ...paymentMetadata,
    chain,
    request: paymentId,
    kind: 'PAYMENT',
  }
  const {
    data: { data: payments, metadata },
    state,
    error,
  } = useFetchPayments(params, apikey?.pvtKey)

  // show popup on error
  useApiErrorPopup(error)

  const props = useMemo(() => (payments ? (payments as PaymentProps[]) : []), [payments])

  useEffect(() => {
    dispatch(setPaymentsApiState({ apiState: state }))
    if (!props.length) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const payments = props.map((p) => new Payment(p as PaymentProps))
    dispatch(setPayments({ data: props, metadata, error: '' }))
    setResult(payments)
  }, [dispatch, metadata, state, props, setResult])

  return result
}

export function useSinglePaymentResponse(paymentId: string): Payment {
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<Payment | null>(null)
  const { apikey } = useDerivedAuthState()
  const params = {
    token: paymentId,
  }
  const {
    data: { data: payment },
    state,
    error,
  } = useFetchPayment(params, apikey?.pvtKey)

  // show popup on error
  useApiErrorPopup(error)

  const props = payment ? (payment as PaymentProps) : null

  useEffect(() => {
    dispatch(setPaymentApiState({ apiState: state }))
    if (!props || props === null) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const payment = new Payment(props as PaymentProps)
    dispatch(setPayment({ data: props, error: '' }))
    setResult(payment)
  }, [dispatch, state, props, setResult])

  return result
}

export function useSinglePaymentDerivedInfo(
  paymentId: string
): {
  payment: Payment | null
  pool: Pool | null
  inputCurrency: Currency | undefined
  amountOut: CurrencyAmount | undefined
  userLiquidity: TokenAmount | undefined
  liquidityToBurn: TokenAmount | undefined
  inputError: string
} {
  const { account, chainId } = useActiveWeb3React()
  const payment = useSinglePaymentResponse(paymentId)

  const inputCurrency = useCurrency(payment?.isEth ? 'ETH' : payment?.tokenAddress) || UNKNOWN(chainId)
  const amountOut = payment !== null ? new CurrencyAmount(inputCurrency, payment.paidAmount) : undefined
  const wrappedAmountOut = amountOut ? wrappedCurrencyAmount(amountOut, chainId) : undefined
  const [, pool] = usePool(inputCurrency)

  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pool?.liquidityToken])
  const userLiquidity: undefined | TokenAmount = relevantTokenBalances?.[pool?.liquidityToken?.address ?? '']
  const token = wrappedToken(inputCurrency, chainId)

  // liquidity values
  const totalSupply = useTotalSupply(pool?.liquidityToken)
  const liquidityValue =
    pool &&
    totalSupply &&
    userLiquidity &&
    token &&
    //
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(token, pool.getLiquidityValue(token, totalSupply, userLiquidity).raw)
      : undefined

  const liquidityToBurn =
    pool && totalSupply && wrappedAmountOut
      ? //
        pool.getLiquidityToBurn(totalSupply, wrappedAmountOut)
      : undefined

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!payment) {
    inputError = 'Invalid Payment Id'
  }

  if (!amountOut) {
    inputError = inputError ?? 'Invalid ' + inputCurrency?.symbol + ' amount'
  }

  if (liquidityValue && amountOut && liquidityValue.lessThan(amountOut)) {
    inputError = 'Insufficient ' + amountOut.currency.symbol + ' balance'
  }

  return {
    payment,
    pool,
    inputCurrency,
    amountOut,
    userLiquidity,
    liquidityToBurn,
    inputError,
  }
}

export function usePaymentResponse(paymentId: string): Wrapped | null {
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<Wrapped | null>()
  const { data: payment, state, error } = usePayment(paymentId)

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
  const state = useSelector<AppState, AppState['request']['apiState']>((state) => state.request.apiState)
  return useMemo(() => {
    if (!state) {
      return [ApiState.LOADING]
    }
    return [state]
  }, [state])
}

export function useRequestsState(): ApiState {
  const state = useSelector<AppState, AppState['request']['requests']['state']>((state) => state.request.requests.state)
  return useMemo(() => {
    if (!state) {
      return ApiState.LOADING
    }
    return state
  }, [state])
}

export function usePaymentsState(): ApiState {
  const state = useSelector<AppState, AppState['request']['payments']['state']>((state) => state.request.payments.state)
  return useMemo(() => {
    if (!state) {
      return ApiState.LOADING
    }
    return state
  }, [state])
}

export function useSinglePaymentState(): ApiState {
  const state = useSelector<AppState, AppState['request']['payment']['state']>((state) => state.request.payment.state)
  return useMemo(() => {
    if (!state) {
      return ApiState.LOADING
    }
    return state
  }, [state])
}

export function useRequestsMetadata(): Metadata {
  const state = useSelector<AppState, AppState['request']['requests']['metadata']>(
    (state) => state.request.requests.metadata
  )
  return useMemo(() => {
    if (!state) {
      return { limit: 6, offset: 0, count: 0 }
    }
    return state
  }, [state])
}

export function usePaymentsMetadata(): Metadata {
  const state = useSelector<AppState, AppState['request']['payments']['metadata']>(
    (state) => state.request.payments.metadata
  )
  return useMemo(() => {
    if (!state) {
      return { count: 0 }
    }
    return state
  }, [state])
}

export function useRequestsPageNumber(): number {
  const state = useSelector<AppState, AppState['request']['pagination']['page']>(
    (state) => state.request.pagination.page
  )
  return useMemo(() => {
    if (!state) {
      return 0
    }
    return state
  }, [state])
}
