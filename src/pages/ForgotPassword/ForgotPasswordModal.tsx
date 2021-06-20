import React from 'react'
import { X, ExternalLink as LinkIcon } from 'react-feather'
import styled from 'styled-components'
import { Order } from '../../order'
import { ExternalLink, TYPE } from '../../theme'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { DataCard, CardSection } from '../../components/request/styled'
import { Break } from '../../components/Settings'

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
  stroke: ${({ theme }) => theme.text1};

  :hover {
    cursor: pointer;
  }
`

const StyledBreak = styled(Break)`
  background-color: rgba(255, 255, 255, 0.2);
`

export function ForgotPasswordModal({
  setShowForgotPasswordModal
}: {
  setShowForgotPasswordModal: any
}) {
  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardSection>
          <AutoRow justify="center">
            <TYPE.white color="text1">Success</TYPE.white>
            <StyledClose stroke="text1" onClick={() => setShowForgotPasswordModal(false)} />
          </AutoRow>
        </CardSection>
        <StyledBreak />
        <>
          <CardSection>
            <AutoColumn gap="md" justify="center">
              <TYPE.white textAlign="center" fontSize={24} fontWeight={600} color="text1">
                You should receive an email with further instructions on how to 
                reset your password. Please close this modal
              </TYPE.white>
            </AutoColumn>
          </CardSection>
        </>
      </ModalUpper>
    </ContentWrapper>
  )
}
