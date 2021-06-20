import { InjectedConnector } from '@web3-react/injected-connector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1337],
})
