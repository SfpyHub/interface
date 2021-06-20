import React from 'react'
import { X, ExternalLink as LinkIcon } from 'react-feather'
import styled from 'styled-components'
import { Order } from '../../order'
import { ExternalLink, TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { DataCard, CardSection } from '../request/styled'
import { Break } from '../Settings'
import Copy from '../AccountDetails/Copy'
import { getPaymentLink } from '../../utils'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  padding: 0.5rem;
  background: none;
  background-color: ${({ theme }) => theme.bg1};
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

const StyledBeak = styled(Break)`
  background-color: rgba(255, 255, 255, 0.2);
`

const RequestLink = styled(ExternalLink)`
  font-size: 0.825rem;
`

export function RequestDetailsModal({
  setShowRequestDetailsModal,
  order,
}: {
  setShowRequestDetailsModal: any
  order?: Order
}) {
  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardSection>
          <RowBetween>
            <TYPE.white color="text1">Your request</TYPE.white>
            <StyledClose stroke="text1" onClick={() => setShowRequestDetailsModal(false)} />
          </RowBetween>
        </CardSection>
        <StyledBeak />
        <>
          <CardSection>
            <AutoColumn gap="md" justify="center">
              <TYPE.white fontSize={48} fontWeight={600} color="text1">
                {order?.grandTotal}
              </TYPE.white>
            </AutoColumn>
          </CardSection>
        </>
        <RowBetween padding={'1rem 2rem'}>
          <Copy toCopy={getPaymentLink('local', order?.id)}>
            <span style={{ marginLeft: '4px' }}>Copy Link</span>
          </Copy>
          <RequestLink href={getPaymentLink('local', order?.id)}>
            <LinkIcon size={16} />
            <span style={{ marginLeft: '4px' }}>Click to View</span>
          </RequestLink>
        </RowBetween>
      </ModalUpper>
    </ContentWrapper>
  )
}
