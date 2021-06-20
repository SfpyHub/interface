import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { LineLoader } from '../Loader'

export default function PriceBreakdown({
  subtotal,
  shipping,
  estimatedTax,
  discount,
  total,
  loading,
}: {
  subtotal?: string
  shipping?: string
  estimatedTax?: string
  discount?: string
  total?: string
  loading?: boolean
}) {
  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap="4px">
      <RowBetween align="center">
        {loading ? (
          <LineLoader height={3} width="50px" />
        ) : (
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            Subtotal
          </Text>
        )}
        {loading ? (
          <LineLoader height={3} width="50px" />
        ) : (
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            {subtotal}
          </Text>
        )}
      </RowBetween>
      {shipping && !loading && (
        <RowBetween align="center">
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            Shipping
          </Text>
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            {shipping}
          </Text>
        </RowBetween>
      )}
      {estimatedTax && !loading && (
        <RowBetween align="center">
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            Estimated Tax
          </Text>
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            {estimatedTax}
          </Text>
        </RowBetween>
      )}
      {discount && !loading && (
        <RowBetween align="center">
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            Discounts
          </Text>
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            {discount}
          </Text>
        </RowBetween>
      )}
      <RowBetween align="center">
        {loading ? (
          <LineLoader height={3} width="50px" />
        ) : (
          <Text fontWeight={800} fontSize={14} color={theme.text1}>
            Total
          </Text>
        )}
        {loading ? (
          <LineLoader height={3} width="50px" />
        ) : (
          <Text fontWeight={800} fontSize={14} color={theme.text1}>
            {total}
          </Text>
        )}
      </RowBetween>
    </AutoColumn>
  )
}
