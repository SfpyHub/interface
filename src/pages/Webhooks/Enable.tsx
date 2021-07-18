import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { RowBetween, RowFixed } from '../../components/Row'
import { Dots } from '../../components/pay/styleds'
import { TYPE } from '../../theme'
import { useEnableWebhooksResponse } from '../../state/secretkey/hooks'
import { ApiState } from '../../api'

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TitleRow = styled(RowBetween)`
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		flex-wrap: wrap;
		gap: 12px;
		width: 100%;
	`};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		width: 50%;
		flex-direction: row-reverse;
		justify-content: space-between;
	`};
`

export function Enable() {
  const { state, execute } = useEnableWebhooksResponse()
  const loading = state === ApiState.LOADING
  return (
    <>
      <TopSection>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                Webhook subscriptions
              </TYPE.mediumHeader>
            </TitleRow>
          </AutoColumn>
        </AutoColumn>
      </TopSection>
      <ButtonRow>
        <ButtonPrimary disabled={loading} padding="6px 8px" onClick={execute}>
          {loading ? (
            <Text fontSize={16} fontWeight={500}>
              Loading <Dots />
            </Text>
          ) : (
            <Text fontSize={16} fontWeight={500}>
              Enable Webhooks
            </Text>
          )}
        </ButtonPrimary>
      </ButtonRow>
    </>
  )
}