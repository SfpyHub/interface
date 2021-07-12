import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Text } from 'rebass'
import { AutoColumn } from '../../components/Column'
import { RowBetween, RowFixed } from '../../components/Row'
import Card from '../../components/Card'
import { ExternalLink, TYPE, HideSmall } from '../../theme'
import { ButtonPrimary, ButtonSecondary, ButtonLight } from '../../components/Button'
import { CreateEndpointModal } from '../../components/webhooks/CreateEndpointModal'
import { ManageEventsModal } from '../../components/webhooks/ManageEventsModal'
import { SharedSecretModal } from '../../components/webhooks/SharedSecretModal'
import { ActionsDropdown } from '../../components/webhooks/ActionsDropdown'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useToggleEndpointsModal, useToggleEventsModal, useToggleSharedSecretModal } from '../../state/application/hooks'
import Loader from '../../components/Loader'
import { Subscription } from '../../order'
import { ApiState } from '../../api'
import { 
  CardSection, 
  DataCard,
  Endpoint,
  GroupingRow,
  EndpointNumber,
  EndpointURL
} from '../../components/webhooks/styled'
import {
  useSubscriptionApiState,
  useSubscriptionsMetadata,
  useSubscriptionsResponse,
  useDerivedCreateInfo,
  useCreateSubscriptionCallback,
  useDerivedPaginationInfo,
  usePaginateSubscriptionsActionHandlers,
  useCreateSubscriptionActionHandlers
} from '../../state/subscriptions/hooks'


const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
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
  justify-self: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		width: 48%;
	`};
`

const ResponsiveButtonLight = styled(ButtonLight)`
  width: fit-content;
  color: ${({ theme }) => theme.white};
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const EmptySubscriptions = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Webhooks() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // toggle endpoints modal
  const toggleEndpointsModal = useToggleEndpointsModal()
  const toggleEventsModal = useToggleEventsModal()
  const toggleSecretModal = useToggleSharedSecretModal()

  const state = useSubscriptionApiState()
  const { offset } = useSubscriptionsMetadata()
  const subscriptions = useSubscriptionsResponse()
  const { prevEnabled, nextEnabled } = useDerivedPaginationInfo()
  const { onClickPrev, onClickNext } = usePaginateSubscriptionsActionHandlers()

  const { state: createState, execute: handleCreateSubscription } = useCreateSubscriptionCallback()
  const { onUserInput } = useCreateSubscriptionActionHandlers()
  const { fields, inputError: createSubscriptionInputError } = useDerivedCreateInfo()

  function onClickDeleteSubscription(subscription: string) {
    console.log(subscription)
  }

  return (
    <>
      <PageWrapper gap="lg" justify="center">
        <CreateEndpointModal
          value={fields.ENDPOINT}
          loading={createState === ApiState.LOADING}
          onChangeEndpoint={onUserInput}
          onClickSave={handleCreateSubscription}
          inputError={createSubscriptionInputError}
        />
        <ManageEventsModal />
        <SharedSecretModal />
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
                  href="https://uniswap.org/blog/uni"
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
        <TopSection>
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="lg" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                <HideSmall>
                  <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                    Webhook subscriptions
                  </TYPE.mediumHeader>
                </HideSmall>
                <ButtonRow>
                  <ResponsiveButtonPrimary padding="6px 8px" onClick={toggleEndpointsModal}>
                    Add an endpoint
                  </ResponsiveButtonPrimary>
                  <ResponseButtonSecondary id="top-up-button" padding="6px 8px" onClick={toggleSecretModal}>
                    <Text fontWeight={500} fontSize={16}>
                      Show shared secret
                    </Text>
                  </ResponseButtonSecondary>
                </ButtonRow>
              </TitleRow>
            </AutoColumn>
            {!account ? (
              <Card padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : state === ApiState.LOADING ? (
              <AutoColumn justify="center">
                <Loader size="24px" />
              </AutoColumn>
            ) : subscriptions?.length === 0 ? (
              <EmptySubscriptions>
                <TYPE.body style={{ marginBottom: '8px' }}>No subscriptions found.</TYPE.body>
                <TYPE.subHeader>
                  <i>Subscriptions created will be displayed here.</i>
                </TYPE.subHeader>
              </EmptySubscriptions>
            ) : subscriptions?.map((s: Subscription, i) => { 
              return (  
                <Endpoint key={i} onClick={() => {}}>
                  <GroupingRow>
                    <EndpointNumber>{offset + i}</EndpointNumber>
                    <EndpointURL>
                      { s.endpoint }
                    </EndpointURL>
                    <ActionsDropdown 
                      onClickDetails={toggleEventsModal}
                      onClickDelete={() => onClickDeleteSubscription(s.token)}
                    />
                  </GroupingRow>
                </Endpoint>
              )}
            )}
          </AutoColumn>
        </TopSection>
        <TopSection>
          <RowBetween>
            <ResponsiveButtonLight onClick={onClickPrev} disabled={!prevEnabled} padding="6px 8px">
              <ArrowLeft size={16} />
              Previous
            </ResponsiveButtonLight>
            <ResponsiveButtonLight onClick={onClickNext} disabled={!nextEnabled} padding="6px 8px">
              Next
              <ArrowRight size={16} />
            </ResponsiveButtonLight>
          </RowBetween>
        </TopSection>
      </PageWrapper>
    </>
  )
}