import { useCallback, useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Merchant, Order, OrderProps, PriceMoney, PurchaseTotals } from '../../order'
import { AppDispatch, AppState } from '../index'
import { usePayment, useCreateOrder, ApiState, filter } from '../../api'
import { Field, FieldMap, addLineItem, removeLineItem, typeInput, resetState } from './actions'
import { SerializablePriceMoney } from './reducer'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { isAddress } from '../../utils'
import useENS from '../../hooks/useENS'
import { useDerivedAuthState } from '../auth/hooks'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'

export function useCreateState(): AppState['create'] {
  return useSelector<AppState, AppState['create']>((state) => state.create)
}

export function useCreateActionHandlers(): {
  onAddLineItem: (field: Field) => void
  onRemoveLineItem: (field: Field) => void
  onUserInput: (field: Field, typedValue: string) => void
  onResetState: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onAddLineItem = useCallback(
    (field: Field) => {
      dispatch(addLineItem({ field }))
    },
    [dispatch]
  )

  const onRemoveLineItem = useCallback(
    (field: Field) => {
      dispatch(removeLineItem({ field }))
    },
    [dispatch]
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onResetState = useCallback(() => {
    dispatch(resetState())
  }, [dispatch])

  return {
    onAddLineItem,
    onRemoveLineItem,
    onUserInput,
    onResetState,
  }
}

export function useOrder(): Order {
  const { merchant } = useDerivedAuthState()
  const { account, chainId } = useActiveWeb3React()
  const { lineItems } = useCreateState()

  const recipientLookup = useENS(account ?? undefined)

  return useMemo(() => {
    const purchaseTotalsJSON = Object.keys(lineItems).reduce((prev, key: Field) => {
      const amount: SerializablePriceMoney = lineItems[key]
      const parsedAmount = parseAmount(amount)
      prev[FieldMap[key]] = parsedAmount.toJSON()
      return prev
    }, {})

    const order = new Order({
      merchant: merchant?.id,
      address: recipientLookup.address,
      chain_id: chainId,
      purchase_total: purchaseTotalsJSON,
    })

    return order
  }, [merchant, account, chainId, lineItems])
}

export function useCreateOrderCallback(): {
  state: ApiState
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  execute: () => void
  request?: Order
} {
  const { apikey } = useDerivedAuthState()
  const { onResetState } = useCreateActionHandlers()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [request, setRequest] = useState<Order | undefined>(undefined)
  const { data, state, error, execute: createOrder } = useCreateOrder()
  // show popup on error
  useApiErrorPopup(error)

  const order = useOrder()
  const handleSubmit = useCallback(() => {
    if (!createOrder) {
      return
    }

    const body = filter(order.toJSON())
    createOrder({
      headers: {
        'X-SFPY-API-KEY': apikey?.pvtKey,
      },
      data: {
        order_service: {
          order: body,
        },
      },
    }).catch(() => {})
  }, [order, createOrder, apikey])

  useEffect(() => {
    if (!data) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const order = new Order(data as OrderProps)
    setRequest(order)
    setIsOpen(true)
    onResetState()
  }, [state, data, setRequest, onResetState])

  return {
    state: state,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    execute: handleSubmit,
    request: request,
  }
}

export function useOrderResponse(requestId: string): Order {
  const [result, setResult] = useState<Order | null>()
  const { data: payment, state } = usePayment(requestId)
  const props = payment ? (payment as OrderProps) : null

  useEffect(() => {
    if (!props) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const order = new Order(props as OrderProps)

    setResult(order)
  }, [state, props, setResult])

  return result
}

export function useDerivedCreateInfo(): {
  merchant?: Merchant
  state?: ApiState
  fields: { [field in Field]?: PriceMoney }
  grandTotal?: PriceMoney
  inputError?: string
} {
  const { account } = useActiveWeb3React()
  const { lineItems } = useCreateState()
  const { merchant } = useDerivedAuthState()
  const state = [ApiState.SUCCESS]

  const fields: { [field in Field]?: PriceMoney | undefined } = {}
  Object.keys(lineItems).forEach((key: string) => {
    const amount: SerializablePriceMoney = lineItems[key]
    const parsedAmount = parseAmount(amount)
    fields[key] = parsedAmount
  })

  const grandTotal = useGrandTotal(fields)

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!fields[Field.SUBTOTAL] || fields[Field.SUBTOTAL].isZero()) {
    inputError = 'Enter an amount'
  }

  if (grandTotal) {
    if (grandTotal.isNegative()) {
      inputError = 'Total cannot be negative'
    }
    if (grandTotal.isZero()) {
      inputError = 'Total cannot be zero'
    }
  }

  return {
    merchant,
    state: state[0],
    fields,
    grandTotal,
    inputError,
  }
}

export function useGrandTotal(summary: { [field in Field]?: PriceMoney | undefined }): PriceMoney {
  const subTotal = summary[Field.SUBTOTAL] && summary[Field.SUBTOTAL].toJSON()
  const taxTotal = summary[Field.TAX] && summary[Field.TAX].toJSON()
  const discount = summary[Field.DISCOUNT] && summary[Field.DISCOUNT].toJSON()
  const pt = new PurchaseTotals({
    sub_total: subTotal,
    tax_total: taxTotal,
    discount: discount,
  })

  return pt.calculateGrandTotal()
}

export function parseAmount(value: SerializablePriceMoney): PriceMoney {
  if (!value) {
    return PriceMoney.ZERO
  }
  const typedValueParsed = value.amount.toFixed(2)
  return new PriceMoney({
    currency: value.currency,
    amount: Number(typedValueParsed),
    negative: value.negative,
  })
}
