import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { NetworkContextName } from './constants'
import store from './state'
import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import UserUpdater from './state/user/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import ListsUpdater from './state/lists/updater'
import reportWebVitals from './reportWebVitals'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <FixedGlobalStyle />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <Updaters />
          <ThemeProvider>
            <ThemedGlobalStyle />
            <HashRouter>
              <App />
            </HashRouter>
          </ThemeProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
