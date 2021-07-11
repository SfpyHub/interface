import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { abi as ISfpyRouterABI } from '../constants/abis/ISfpyRouter.json'
import { ROUTER_ADDRESS } from '../constants'
import { ChainId, JSBI, Percent } from '@sfpy/web3-sdk'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
  1337: 'ganache.',
}

export function getEtherscanLink(
  chainId: ChainId, 
  data: string, 
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function getPaymentLink(environment: string, paymentId: string): string {
  switch (environment) {
    case 'production':
    case 'sandbox':
      return ''

    default:
      return `${process.env.REACT_APP_INTERFACE_BASE_URL}/#/pay?payment=${paymentId}`
  }
}

// shorted the checksummed version of the input address to have 0x + 4 characters ar the start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// shorted the checksummed version of the input address to have 0x + 4 characters ar the start and end
export function shortenPvtKey(key: string, chars = 8): string {
  return `${key.substring(0, chars + 2)}...${key.substring(64 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk Percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function getRouterContract(chainId: number, library: Web3Provider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS, ISfpyRouterABI, library, account)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
