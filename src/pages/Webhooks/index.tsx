import React, { useEffect } from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Loader from '../../components/Loader'
import { ExternalLink, TYPE } from '../../theme'
import { Enable } from './Enable'
import { Webhooks } from './Webhooks'
import { 
  CardSection,
  DataCard
} from '../../components/webhooks/styled'
import { useExistsWebhooksResponse, useSharedSecretState } from '../../state/secretkey/hooks'
import { ApiState } from '../../api'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #635BFF 0%, #000000 100%);
  overflow: hidden;
`

export default function WebhookManager() {
  const { enabled } = useSharedSecretState()
  const { state, execute } = useExistsWebhooksResponse()
  
  useEffect(() => {
    execute()
  }, [])

  return (
    <>
      <PageWrapper gap="lg" justify="center">
        <TopSection gap="md">
          <VoteCard>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>
                    SFPY Webhooks
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white fontSize={14}>
                    With webhooks you can listen to various events emmitted 
                    and take action programatically
                  </TYPE.white>
                </RowBetween>
                <ExternalLink
                  style={{ color: 'white', textDecoration: 'underline' }}
                  href="https://www.sfpy.co/docs/05-api/02-webhooks"
                  target="_blank"
                >
                  <TYPE.white fontSize={14}>
                    Learn how to integrate webhooks
                  </TYPE.white>
                </ExternalLink>
              </AutoColumn>
            </CardSection>
          </VoteCard>
        </TopSection>
        { enabled ? 
          <Webhooks /> 
        : state === ApiState.LOADING ? (
          <AutoColumn justify="center">
            <Loader size="24px" />
          </AutoColumn>
        ) :
          <Enable />
        }
      </PageWrapper>
    </>
  )
}