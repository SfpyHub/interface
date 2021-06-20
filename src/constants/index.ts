import { AbstractConnector } from '@web3-react/abstract-connector'
import { Token } from '@sfpy/web3-sdk'
import { injected } from '../connectors'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  GANACHE = 1337,
}

export const ROUTER_ADDRESS: string = process.env.REACT_APP_ROUTER_ADDRESS

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
}

export const NetworkContextName = 'SAFEPAY'

export const GanacheWETH9 = new Token(
  ChainId.GANACHE, 
  process.env.REACT_APP_WETH9_ADDRESS, 
  18, 
  'WETH', 
  'Wrapped Ether'
)
