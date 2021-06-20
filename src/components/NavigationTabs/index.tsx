import React from 'react'
import styled from 'styled-components'
import { Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween, AutoRow } from '../Row'
import QuestionHelper from '../QuestionHelper'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const AcitveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function RemoveTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pools">
          <StyledArrowLeft />
        </HistoryLink>
        <AcitveText>Withdraw Liquidity</AcitveText>
        <QuestionHelper
          text={
            'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}

export function RefundTabs({ requestId }: { requestId: string }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to={`/request/${requestId}`}>
          <StyledArrowLeft />
        </HistoryLink>
        <AcitveText>Refund Payment</AcitveText>
        <QuestionHelper
          text={
            'Refunding this payment will use your pool tokens by converting them back into underlying tokens. The tokens will then be sent to your customer.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}

export function SignupTabs() {
  return (
    <Tabs>
      <AutoRow justify="center" align="center" style={{ padding: '1rem' }}>
        <AcitveText>Create Account</AcitveText>
      </AutoRow>
    </Tabs>
  )
}

export function LoginTabs() {
  return (
    <Tabs>
      <AutoRow justify="center" align="center" style={{ padding: '1rem' }}>
        <AcitveText>Sign in to your account</AcitveText>
      </AutoRow>
    </Tabs>
  )
}

export function ForgotPasswordTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to={`/login`}>
          <StyledArrowLeft />
        </HistoryLink>
        <AcitveText>Forgot your password?</AcitveText>
        <QuestionHelper
          text={
            'If your email address exists in our system, you will receive an email with instructions on how to reset your password.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}

export function ConfirmPasswordTabs() {
  return (
    <Tabs>
      <AutoRow justify="center" align="center" style={{ padding: '1rem' }}>
        <AcitveText>Choose your new password</AcitveText>
      </AutoRow>
    </Tabs>
  )
}

export function SecurityTabs() {
  return (
    <Tabs>
      <AutoRow justify="space-between" align="center" style={{ padding: '1rem' }}>
        <AcitveText>Choose a security option</AcitveText>
      </AutoRow>
    </Tabs>
  )
}
