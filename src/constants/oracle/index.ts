import { ChainId } from '../index'
import PRICE_ORACLE_ABI from './abi.json'

const PRICE_ORACLE_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x841616a5CBA946CF415Efe8a326A621A794D0f97',
  [ChainId.ROPSTEN]: '0xBEf4E076A995c784be6094a432b9CA99b7431A3f',
  [ChainId.KOVAN]: '0xbBdE93962Ca9fe39537eeA7380550ca6845F8db7',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.GANACHE]: '',
}

export { PRICE_ORACLE_ABI, PRICE_ORACLE_NETWORKS }
