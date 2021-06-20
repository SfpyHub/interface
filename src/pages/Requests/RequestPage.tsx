import React, { useMemo } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'

import { TYPE, StyledInternalLink, ExternalLink } from '../../theme'
import Row, { RowBetween } from '../../components/Row'
import { ArrowLeft, ExternalLink as LinkIcon } from 'react-feather'
import { RequestStatus } from './styled'
import { LightCard } from '../../components/Card'
import PriceBreakdown from '../../components/PriceBreakdown'
import AddressInputPanel from '../../components/AddressPanel'
import { getPaymentLink, shortenAddress } from '../../utils'
import Copy from '../../components/AccountDetails/Copy'
import PaymentDetails from '../../components/request/PaymentDetails'
import { usePaymentResponse, usePaymentState, usePaymentsResponse, usePaymentsState } from '../../state/requests/hooks'
import { ApiState } from '../../api'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

const RequestInfo = styled(AutoColumn)`
  border: 1px solid ${({ theme }) => theme.bg5};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  max-width: 640px;
  width: 100%;
`

const StyledLargeHeader = styled(TYPE.largeHeader)`
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
`

const ArrowWrapper = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  color: ${({ theme }) => theme.text1};

  a {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
  :hover {
    text-decoration: none;
  }
`

const RequestLink = styled(ExternalLink)`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  }
`

const StyledRow = styled(Row)`
  justify-content: center;
  justify-self: center;
`

export default function RequestPage({
  history,
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) {
  const wrapped = usePaymentResponse(id)
  const [state] = usePaymentState()
  const paymentsState = usePaymentsState()
  const payments = usePaymentsResponse(id)

  const paymentDetails = useMemo(() => {
    return payments.map((payment) => {
      const currency = payment.isEth ? 'ETH' : payment.tokenAddress
      const from = shortenAddress(payment.fromAddress)
      const amount = payment.paidAmount
      const txnHash = payment.hash
      return {
        paymentId: payment.id,
        fromAddress: from,
        txnHash: txnHash,
        currencyAddress: currency,
        status: payment.status,
        amount: amount,
        rate: payment.exchange,
        order: wrapped?.order,
      }
    })
  }, [payments, wrapped])

  function onClickRefund(paymentId: string) {
    history.push(`/refund/${id}/${paymentId}`)
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <RequestInfo gap="lg" justify="start">
        <RowBetween style={{ width: '100%' }}>
          <ArrowWrapper to="/requests">
            <ArrowLeft size={20} /> All Requests
          </ArrowWrapper>
          {wrapped && wrapped.order && (
            <RequestStatus status={wrapped.order.status.toLowerCase()}>{wrapped.order.status}</RequestStatus>
          )}
        </RowBetween>
        <AutoColumn gap="10px" style={{ width: '100%' }}>
          {wrapped && (
            <StyledLargeHeader style={{ marginBottom: '.5rem' }}>
              {wrapped?.order?.grandTotal} - {wrapped?.order?.id}
            </StyledLargeHeader>
          )}
          <RowBetween>
            <TYPE.main>Request created {wrapped?.order?.createdAt}</TYPE.main>
          </RowBetween>
        </AutoColumn>
        <StyledRow style={{ padding: '6px' }}>
          <Copy toCopy={getPaymentLink('local', wrapped?.order?.id)}>
            <span style={{ marginLeft: '4px' }}>Copy Link</span>
          </Copy>
          <RequestLink href={getPaymentLink('local', wrapped?.order?.id)}>
            <LinkIcon size={16} />
            <span style={{ marginLeft: '4px' }}>Click to View</span>
          </RequestLink>
        </StyledRow>
        <AutoColumn gap="sm" style={{ width: '100%' }}>
          <TYPE.body>Recipient address</TYPE.body>
          {wrapped && (
            <StyledRow style={{ maxWidth: '400px' }}>
              <AddressInputPanel id="recipient" address={wrapped?.order?.recipient} />
            </StyledRow>
          )}
        </AutoColumn>
        <AutoColumn gap="sm" style={{ width: '100%' }}>
          <TYPE.body>Price breakdown</TYPE.body>
          {wrapped && (
            <StyledRow style={{ maxWidth: '400px' }}>
              <LightCard>
                <PriceBreakdown
                  subtotal={wrapped.order?.subTotal}
                  estimatedTax={wrapped.order?.taxTotal}
                  discount={wrapped.order?.discountTotal}
                  total={wrapped.order?.grandTotal}
                  loading={state === ApiState.LOADING}
                />
              </LightCard>
            </StyledRow>
          )}
        </AutoColumn>
        <AutoColumn gap="sm" style={{ width: '100%' }}>
          <TYPE.body>Payments applied</TYPE.body>

          {wrapped &&
            paymentsState === ApiState.SUCCESS &&
            paymentDetails.map((props, i) => {
              return <PaymentDetails key={i} onClickRefund={onClickRefund} {...props} />
            })}
        </AutoColumn>
      </RequestInfo>
    </PageWrapper>
  )
}
