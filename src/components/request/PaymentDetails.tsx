import JSBI from 'jsbi'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { CurrencyAmount, Rate, BigintIsh, Percent, Fraction, TEN, UNKNOWN } from '@sfpy/web3-sdk'
import { Order } from '../../order'

import { AutoColumn } from '../Column'
import { RowBetween, AutoRow } from '../../components/Row'
import { TYPE, ExternalLink } from '../../theme'
import { CardSection, DataCard } from '../request/styled'
import { ExternalLink as LinkIcon } from 'react-feather'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useCurrency } from '../../hooks/useTokens'
import Identicon from '../../components/Identicon'
import { getEtherscanLink } from '../../utils'
import { wrappedUSDCAmount, wrappedCurrency, wrappedUSDC } from '../../utils/wrappedCurrency'
import { ButtonSecondary } from '../Button'

const StyledDataCard = styled(DataCard)`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background: none;
  background-color: ${({ theme }) => theme.bg1};
  height: fit-content;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const InfoCard = styled.div`
  padding: 0.825rem 0;
  border-radius: 20px;
  position: relative;
  margin-bottom: 20px;
`

const CustomerAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: flex-start;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const TransactionLink = styled(ExternalLink)`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;

  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

const WrapSmall = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    align-items: flex-start;
    flex-direction: column;
  `};
`

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bg3};
  position: relative;
`

const Progress = styled.div<{ status: string; percentageString?: string }>`
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme, status }) =>
    status === 'paid' ? theme.green1 : status === 'refunded' ? theme.yellow1 : theme.primary1};
  width: ${({ percentageString }) => percentageString};
`

export interface PaymentDetailsProps {
  paymentId?: string
  fromAddress?: string
  txnHash?: string
  currencyAddress?: string
  status?: string
  amount?: BigintIsh
  rate?: BigintIsh
  order?: Order
  onClickRefund?: (paymentId: string) => void
}

export default function PaymentDetails({
  paymentId,
  fromAddress,
  txnHash,
  currencyAddress,
  status,
  amount,
  rate,
  order,
  onClickRefund,
}: PaymentDetailsProps) {
  const { chainId } = useActiveWeb3React()
  const currency = useCurrency(currencyAddress) || UNKNOWN(chainId)

  const [paidAmount, percent, exchange] = useMemo(() => {
    const orderAmount = wrappedUSDCAmount(chainId, order?.gradTotalRaw ?? '0')
    const paidAmount = new CurrencyAmount(currency, amount)
    const paidCurrency = wrappedCurrency(currency, chainId)
    const usdc = wrappedUSDC(chainId)
    const baseCurrencyAmount = JSBI.exponentiate(TEN, JSBI.BigInt(paidCurrency.decimals))
    const exchange = new Rate(new CurrencyAmount(usdc, rate), new CurrencyAmount(paidCurrency, baseCurrencyAmount))

    const fraction = new Fraction(exchange.executionPrice.invert().quote(paidAmount).raw, orderAmount.raw)

    const percent = new Percent(fraction.numerator, fraction.denominator)

    return [paidAmount, percent, exchange]
  }, [chainId, order, currency, amount, rate])

  function getStatusIcon() {
    return (
      <IconWrapper size={16}>
        <Identicon />
      </IconWrapper>
    )
  }

  return (
    <StyledDataCard>
      <CardSection>
        {fromAddress && (
          <CustomerAccount>
            <InfoCard>
              <AccountGroupingRow>
                <AccountControl>
                  {getStatusIcon()}
                  <p> {fromAddress} </p>
                </AccountControl>
              </AccountGroupingRow>
            </InfoCard>
          </CustomerAccount>
        )}
        <AutoColumn gap="sm" style={{ marginBottom: '20px' }}>
          <RowBetween>
            <TYPE.black fontWeight={600}>Paid</TYPE.black>
            {txnHash && (
              <TransactionLink href={chainId && getEtherscanLink(chainId, txnHash, 'transaction')}>
                <LinkIcon size={16} />
                <span style={{ marginLeft: '4px' }}>View on Etherscan</span>
              </TransactionLink>
            )}
          </RowBetween>
          {currency && (
            <CurrencyInputPanel
              id="payment-currency-input"
              label=""
              value={paidAmount && paidAmount.toSignificant(6)}
              currency={currency}
              disableCurrencySelect={true}
              hideBalance={true}
            />
          )}
        </AutoColumn>
        <AutoColumn gap="md">
          <WrapSmall>
            <TYPE.black fontWeight={600}>
              For a share of {percent.toSignificant(2)}% - ($
              {exchange?.executionPrice?.invert().quote(paidAmount).toSignificant(3)})
            </TYPE.black>
          </WrapSmall>
        </AutoColumn>
        <ProgressWrapper>
          <Progress status={status.toLowerCase()} percentageString={`${percent.toSignificant(2)}%`} />
        </ProgressWrapper>
        <AutoRow justify="flex-end">
          <ButtonSecondary width={'40%'} disabled={status === 'REFUNDED'} onClick={() => onClickRefund(paymentId)}>
            {status === 'REFUNDED' ? 'Refunded' : 'Refund'}
          </ButtonSecondary>
        </AutoRow>
      </CardSection>
    </StyledDataCard>
  )
}
