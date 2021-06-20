import React from 'react'
import styled from 'styled-components'
import { PriceMoney } from '../../order'
import { Field } from '../../state/create/actions'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'

import { RowBetween, RowFixed } from '../Row'

const StyledLabel = styled(TYPE.black)<{ weight?: number }>`
  font-weight: ${({ weight }) => `${weight} !important` || 400};
  font-size: 14px;
  color: ${({ theme }) => theme.text2};
`

const StyledValue = styled(TYPE.black)<{ weight?: number }>`
  font-weight: ${({ weight }) => `${weight} !important` || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
`

export interface OrderSummaryProps {
  summary: { [field in Field]?: PriceMoney | undefined }
  grandTotal?: PriceMoney
}

function OrderSummary({ summary, grandTotal }: OrderSummaryProps) {
  function getSummaryItem(label: string, amount?: PriceMoney, weight?: number): React.ReactNode | null {
    return amount ? (
      <RowBetween>
        <RowFixed>
          <StyledLabel weight={weight}>{label}</StyledLabel>
        </RowFixed>
        <RowFixed>
          <StyledValue weight={weight}>{amount?.format()}</StyledValue>
        </RowFixed>
      </RowBetween>
    ) : null
  }

  return (
    <>
      <AutoColumn style={{ padding: '0 20px' }}>
        {getSummaryItem('Subtotal', summary[Field.SUBTOTAL])}
        {getSummaryItem('Discount', summary[Field.DISCOUNT])}
        {getSummaryItem('Estimated Tax', summary[Field.TAX])}
        {getSummaryItem('Grand Total', grandTotal, 800)}
      </AutoColumn>
    </>
  )
}

export interface AdvancedCreateDetailsProps {
  order?: OrderSummaryProps
}

export function AdvancedCreateDetails({ order }: AdvancedCreateDetailsProps) {
  return (
    <AutoColumn gap="md">
      {order && <OrderSummary summary={order?.summary} grandTotal={order?.grandTotal} />}
    </AutoColumn>
  )
}
