import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'

import Pay from './Pay'
import Create from './Create'
import Pools from './Pools'
import Merchant from './Merchant'
import Requests from './Requests'
import Signup from './SignUp'
import Login from './Login'
import { RedirectPathToLogin } from './Login/redirects'
import ForgotPassword from './ForgotPassword'
import ConfirmPassword from './ForgotPassword/ConfirmPassword'
import SecurityWizard from './SignUp/SecurityWizard'
import RequestPage from './Requests/RequestPage'
import RemoveLiquidity from './RemoveLiquidity'
import Refund from './Refund'
import Webhooks from './Webhooks'

import { ProvideAuth, ProtectedRoute } from './Auth'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  return (
    <Suspense fallback={null}>
      <ProvideAuth>
        <AppWrapper>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <Popups />
            <Polling />
            <Web3ReactManager>
              <Switch>
                <Route exact strict path="/signup" component={Signup} />
                <Route exact strict path="/login" component={Login} />
                <Route exact strict path="/forgot-password" component={ForgotPassword} />
                <Route exact strict path="/confirm-password" component={ConfirmPassword} />
                <Route exact strict path="/on-board" component={SecurityWizard} />
                <Route exact strict path="/pay" component={Pay} />
                <Route exact strict path="/pools" component={Pools} />
                <Route exact strict path="/remove/:currencyId" component={RemoveLiquidity} />
                <Route exact strict path="/" component={RedirectPathToLogin} />
                <ProtectedRoute exact strict path="/create" component={Create} />
                <ProtectedRoute exact strict path="/merchant" component={Merchant} />
                <ProtectedRoute exact strict path="/webhooks" component={Webhooks} />
                <ProtectedRoute exact strict path="/requests" component={Requests} />
                <ProtectedRoute exact strict path="/request/:id" component={RequestPage} />
                <ProtectedRoute exact strict path="/refund/:requestId/:paymentId" component={Refund} />
              </Switch>
            </Web3ReactManager>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      </ProvideAuth>
    </Suspense>
  )
}
