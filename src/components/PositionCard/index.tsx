import { Pool, JSBI, Percent, Rate } from '@sfpy/web3-sdk'
import React, { useState } from 'react'
import { transparentize } from 'polished'
import { Text } from 'rebass'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'

import { ButtonPrimary, ButtonEmpty } from '../Button'

import { currencyId } from '../../utils/currencyId'
import { useColor } from '../../hooks/useColor'

import { useTokenBalance } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { unwrappedToken, unwrappedTokenAmount } from '../../utils/wrappedCurrency'
import { GreyCard, LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed, AutoRow } from '../Row'
import { Dots } from '../pay/styleds'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const Wrapper = styled.div<{ margin: boolean; size: number }>`
  margin-right: ${({ size, margin }) => margin && (size / 3 + 8).toString() + 'px'};
`

const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  background: ${({ theme, bgColor }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `};
  position: relative;
  overflow: hidden;
`

interface PositionCardProps {
  rate?: Rate
  pool?: Pool
  border?: string
}

export default function FullPositionCard({ pool, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency = unwrappedToken(pool.token)

  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pool.liquidityToken)
  const totalPoolTokens = useTotalSupply(pool.liquidityToken)

  const poolTokenPercentage =
    !!userDefaultPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userDefaultPoolBalance.raw)
      ? new Percent(userDefaultPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const tokenDeposited =
    !!pool &&
    !!totalPoolTokens &&
    !!userDefaultPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userDefaultPoolBalance.raw)
      ? pool.getLiquidityValue(pool.token, totalPoolTokens, userDefaultPoolBalance)
      : undefined

  const backgroundColor = useColor()
  //const backgroundColor = '#2172E5'

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor}>
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <CurrencyLogo currency={currency} size={'20px'} />
            <Text fontWeight={500} fontSize={20}>
              {!currency ? <Dots>Loading</Dots> : `${currency.symbol}`}
            </Text>
          </AutoRow>
          <RowFixed gap="8px">
            <ButtonEmpty
              padding="6px 8px"
              borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  Manage
                  <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                </>
              ) : (
                <>
                  Manage
                  <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                </>
              )}
            </ButtonEmpty>
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your total pool tokens:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userDefaultPoolBalance ? userDefaultPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  Pooled {currency.symbol}:
                </Text>
              </RowFixed>
              {tokenDeposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {tokenDeposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your pool share:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'}
              </Text>
            </FixedHeightRow>
            <RowBetween marginTop="10px">
              <ButtonPrimary padding="8px" as={Link} to={`/create`} width="48%">
                Add
              </ButtonPrimary>
              <ButtonPrimary padding="8px" as={Link} width="48%" to={`/remove/${currencyId(currency)}`}>
                Remove
              </ButtonPrimary>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}

export function RefundPositionCard({ pool, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency = unwrappedToken(pool.token)

  const userPoolBalance = useTokenBalance(account ?? undefined, pool.liquidityToken)
  const totalPoolTokens = useTotalSupply(pool.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [tokenDeposited] =
    !!pool &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [pool.getLiquidityValue(pool.token, totalPoolTokens, userPoolBalance)]
      : [undefined]
  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your available liquidity
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Wrapper margin={true} size={20}>
                  <CurrencyLogo currency={currency} size={'20px'} />
                </Wrapper>
                <Text fontWeight={500} fontSize={20}>
                  SFPY - {currency.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Your pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency.symbol}:
                </Text>
                {tokenDeposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {tokenDeposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            You do not have enough liquidity to refund this payment back to your customer. If you have enough tokens in
            your wallet you could copy the recipient address and transfer this amount directly to their wallet instead.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}

export function MinimalPositionCard({ rate, pool, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency = unwrappedToken(pool.token)

  const userPoolBalance = useTokenBalance(account ?? undefined, pool.liquidityToken)
  const totalPoolTokens = useTotalSupply(pool.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [tokenDeposited] =
    !!pool &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [pool.getLiquidityValue(pool.token, totalPoolTokens, userPoolBalance)]
      : [undefined]

  const unwrappedTokenDeposited = unwrappedTokenAmount(tokenDeposited)
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <Wrapper margin={true} size={20}>
                  <CurrencyLogo currency={currency} size={'20px'} />
                </Wrapper>
                <Text fontWeight={500} fontSize={20}>
                  {currency.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Your pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency.symbol}:
                </Text>
                {tokenDeposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {tokenDeposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Value in USDC
                </Text>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {rate && tokenDeposited
                      ? `$${rate?.executionPrice?.invert().quote(unwrappedTokenDeposited).toSignificant(3)}`
                      : '-'}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '}
            By maintaining liquidity you&apos;ll earn 0.1% of all flash loans executed on this pool proportional to your share of the pool.
            Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}
