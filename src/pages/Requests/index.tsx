import React, { useCallback } from 'react'
import { ExternalLink as LinkIcon, ArrowLeft, ArrowRight } from 'react-feather'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE, ExternalLink } from '../../theme'
import { RowBetween, AutoRow } from '../../components/Row'
import { Link } from 'react-router-dom'
import { ButtonPrimary, ButtonLight } from '../../components/Button'
import { RequestStatus } from './styled'
import Copy from '../../components/AccountDetails/Copy'
import Loader from '../../components/Loader'
import { Wrapped } from '../../order'
import { darken } from 'polished'
import { getPaymentLink } from '../../utils'
import { ApiState } from '../../api'
import {
  useAllRequestsData,
  useRequestsState,
  useDerivedRequestsInfo,
  useRequestsActionHandlers,
  useRequestsMetadata,
} from '../../state/requests/hooks'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
`

const ResponseButtonLight = styled(ButtonLight)`
  width: fit-content;
  color: ${({ theme }) => theme.white};
`

const Request = styled.div`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 0.5rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg5};
  &:focus {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
`

const RequestNumber = styled.span`
  opacity: 0.6;
`

const RequestTitle = styled.span`
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const WrapSmall = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
  `};
`

const EmptyRequests = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const GroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  display: grid;
  grid-template-columns: 30px 2fr 1fr;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const LinkRow = styled(AutoRow)`
  margin-top: 1rem;
`

const LinkGroup = styled(RequestTitle)`
  display: flex;
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

export default function Requests({ history }) {
  const handleRequestSelect = useCallback(
    (request: string) => {
      history.push(`/request/${request}`)
    },
    [history]
  )

  const state = useRequestsState()
  const { offset } = useRequestsMetadata()
  const requests = useAllRequestsData()
  const { prevEnabled, nextEnabled } = useDerivedRequestsInfo()

  const { onClickPrev, onClickNext } = useRequestsActionHandlers()

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="2px">
        <WrapSmall>
          <TYPE.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>Requests</TYPE.mediumHeader>
          <ResponsiveButtonPrimary as={Link} padding="6px 8px" to="/create">
            Create a request
          </ResponsiveButtonPrimary>
        </WrapSmall>
        {state === ApiState.LOADING ? (
          <AutoColumn justify="center">
            <Loader size="24px" />
          </AutoColumn>
        ) : requests?.length === 0 ? (
          <EmptyRequests>
            <TYPE.body style={{ marginBottom: '8px' }}>No requests found.</TYPE.body>
            <TYPE.subHeader>
              <i>Requests created will be displayed here.</i>
            </TYPE.subHeader>
          </EmptyRequests>
        ) : (
          requests?.map((w: Wrapped, i) => {
            const o = w.order
            return (
              <Request key={i} onClick={() => handleRequestSelect(o.id)}>
                <GroupingRow>
                  <RequestNumber>{offset + i}</RequestNumber>
                  <RequestTitle>
                    {o?.grandTotal} - {o?.id}
                  </RequestTitle>
                  <RequestStatus status={o?.status.toLowerCase()}>{o?.status}</RequestStatus>
                </GroupingRow>
                <LinkRow justify="center">
                  <LinkGroup>
                    <Copy toCopy={getPaymentLink('local', o?.id)}>
                      <span style={{ marginLeft: '4px' }}>Copy Link</span>
                    </Copy>
                    <RequestLink href={getPaymentLink('local', o?.id)}>
                      <LinkIcon size={16} />
                      <span style={{ marginLeft: '4px' }}>Click to View</span>
                    </RequestLink>
                  </LinkGroup>
                </LinkRow>
              </Request>
            )
          })
        )}
      </TopSection>
      <TopSection>
        <RowBetween>
          <ResponseButtonLight onClick={onClickPrev} disabled={!prevEnabled} padding="6px 8px">
            <ArrowLeft size={16} />
            Previous
          </ResponseButtonLight>
          <ResponseButtonLight onClick={onClickNext} disabled={!nextEnabled} padding="6px 8px">
            Next
            <ArrowRight size={16} />
          </ResponseButtonLight>
        </RowBetween>
      </TopSection>
    </PageWrapper>
  )
}
