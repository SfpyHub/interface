import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Text } from 'rebass'
import { AutoColumn } from '../../components/Column'
import { RowBetween, RowFixed } from '../../components/Row'
import Card from '../../components/Card'
import { TYPE, HideSmall } from '../../theme'
import { ButtonPrimary, ButtonSecondary, ButtonLight } from '../../components/Button'
import { CreateEndpointModal } from '../../components/webhooks/CreateEndpointModal'
import { ManageEventsModal } from '../../components/webhooks/ManageEventsModal'
import { SharedSecretModal } from '../../components/webhooks/SharedSecretModal'
import { DeleteSubscriptionModal } from '../../components/webhooks/DeleteSubscriptionModal'
import { ActionsDropdown } from '../../components/webhooks/ActionsDropdown'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import Loader from '../../components/Loader'
import { Subscription } from '../../order'
import { ApiState } from '../../api'
import { Field } from '../../state/subscriptions/actions'
import { 
  useToggleEndpointsModal, 
  useToggleEventsModal, 
  useToggleDeleteSubscriptionModal, 
  useToggleSharedSecretModal 
} from '../../state/application/hooks'
import { 
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
  useSubscriptionsState,
  useCreateSubscriptionCallback,
  useDerivedPaginationInfo,
  usePaginateSubscriptionsActionHandlers,
  useCreateSubscriptionActionHandlers,
  useSelectSubscriptionActionHandlers,
  useDeleteSubscriptionCallback,
  useUpdateSubscriptionCallback,
  useSubscribeCallback
} from '../../state/subscriptions/hooks'
import { useAllEventsResponse, useEventsApiState } from '../../state/events/hooks'

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

export function Webhooks() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const [subscription, setSubscription] = useState<Subscription | null>(null)
  // toggle endpoints modal
  const toggleEndpointsModal = useToggleEndpointsModal()
  const toggleEventsModal = useToggleEventsModal()
  const toggleSecretModal = useToggleSharedSecretModal()
  const toggleDeleteModal = useToggleDeleteSubscriptionModal()

  const eventState = useEventsApiState()
  const allEvents = useAllEventsResponse()

  const state = useSubscriptionApiState()
  const { offset } = useSubscriptionsMetadata()
  const subscriptions = useSubscriptionsResponse()
  const { prevEnabled, nextEnabled } = useDerivedPaginationInfo()
  const { onClickPrev, onClickNext } = usePaginateSubscriptionsActionHandlers()

  const { state: createState, execute: handleCreateSubscription } = useCreateSubscriptionCallback()
  const { onUserInput } = useCreateSubscriptionActionHandlers()
  const { fields, inputError: createSubscriptionInputError } = useDerivedCreateInfo()

  const { onSetSubsription } = useSelectSubscriptionActionHandlers()
  const { state: deleteState, execute: handleDeleteSubscription } = useDeleteSubscriptionCallback()

  const { selected } = useSubscriptionsState()
  const isUpdate = selected.subscription.length > 0
  const { state: updateState, execute: handleUpdateSubscription } = useUpdateSubscriptionCallback()

  const { state: subscribeState, execute: handleSubscribe } = useSubscribeCallback()

  function onClickDeleteSubscription(subscription: Subscription) {
    onSetSubsription(subscription)
    toggleDeleteModal()
  }

  function onClickUpdateSubscription(subscription: Subscription) {
    onUserInput(Field.ENDPOINT, subscription.endpoint)
    onSetSubsription(subscription)
    toggleEndpointsModal()
  }

  function onClickSubscriptionDetails(subscription: Subscription) {
    onSetSubsription(subscription)
    setSubscription(subscription)
    toggleEventsModal()
  }

  const isLoading = state === ApiState.LOADING || eventState === ApiState.LOADING
  return (
    <>
      <CreateEndpointModal
        update={isUpdate}
        value={fields.ENDPOINT}
        onChangeEndpoint={onUserInput}
        loading={isUpdate ? updateState === ApiState.LOADING : createState === ApiState.LOADING}
        onClickSave={isUpdate ? handleUpdateSubscription : handleCreateSubscription}
        inputError={createSubscriptionInputError}
      />
      <DeleteSubscriptionModal 
        loading={deleteState === ApiState.LOADING}
        onClickDelete={handleDeleteSubscription}
      />
      <ManageEventsModal 
        subscription={subscription}
        events={allEvents}
        loading={subscribeState === ApiState.LOADING}
        onSubmit={handleSubscribe}
      />
      <SharedSecretModal />
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
                Connect to a wallet to view your webhooks.
              </TYPE.body>
            </Card>
          ) : isLoading ? (
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
                    onClickDetails={() => onClickSubscriptionDetails(s)}
                    onClickUpdate={() => onClickUpdateSubscription(s)}
                    onClickDelete={() => onClickDeleteSubscription(s)}
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
    </>
  )
}