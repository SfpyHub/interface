import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Link } from 'react-router-dom'
import { Pool } from '@sfpy/web3-sdk'
import FullPositionCard from '../../components/PositionCard'
import { TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { Dots } from '../../components/pay/styleds'
import { AutoColumn } from '../../components/Column'
import { toLiquidityToken, useTrackedTokens } from '../../state/user/hooks'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePools } from '../../data/Reserves'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
		flex-wrap: wrap;
		gap: 12px;
		width: 100%;
		flex-direction: column-reverse;
	`};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		width: 100%;
		flex-direction: row-reverse;
		justify-content: space-between;
	`};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		width: 48%;
	`};
`

const ResponseButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		width: 48%;
	`};
`

const EmptyContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Pools() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const trackedTokenPools = useTrackedTokens()
  const tokenPoolsWithLiquidityTokens = useMemo(
    () => trackedTokenPools.map((token) => ({ liquidityToken: toLiquidityToken(token), token })),
    [trackedTokenPools]
  )
  const liquidityTokens = useMemo(() => tokenPoolsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken), [
    tokenPoolsWithLiquidityTokens,
  ])
  const [poolBalances, fetchingPoolBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPoolsWithLiquidityTokens.filter(({ liquidityToken }) =>
        poolBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPoolsWithLiquidityTokens, poolBalances]
  )

  const pools = usePools(liquidityTokensWithBalances.map(({ token }) => token))
  const poolIsLoading =
    fetchingPoolBalances || pools?.length < liquidityTokensWithBalances.length || pools?.some((pool) => !pool)

  const allPoolsWithLiquidity = pools.map(([, pool]) => pool).filter((pool): pool is Pool => Boolean(pool))

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Your liquidity
                </TYPE.mediumHeader>
              </HideSmall>
              <ButtonRow>
                <ResponsiveButtonPrimary as={Link} padding="6px 8px" to="/create">
                  Create a request
                </ResponsiveButtonPrimary>
                <ResponseButtonSecondary id="top-up-button" as={Link} padding="6px 8px" to="/requests">
                  <Text fontWeight={500} fontSize={16}>
                    View requests
                  </Text>
                </ResponseButtonSecondary>
              </ButtonRow>
            </TitleRow>

            {!account ? (
              <Card padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : poolIsLoading ? (
              <EmptyContainer>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyContainer>
            ) : allPoolsWithLiquidity?.length > 0 ? (
              <>
                {allPoolsWithLiquidity.map((pool) => (
                  <FullPositionCard key={pool.liquidityToken.address} pool={pool} />
                ))}
              </>
            ) : (
              <EmptyContainer>
                <TYPE.body color={theme.text3} textAlign="center">
                  No liquidity found.
                </TYPE.body>
              </EmptyContainer>
            )}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
