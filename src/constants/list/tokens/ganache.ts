const ganache = [
  {
    name: 'Wrapped Ether',
    address: process.env.REACT_APP_WETH9_ADDRESS,
    symbol: 'WETH',
    decimals: 18,
    chainId: 1337,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    name: 'Safepay Test',
    address: process.env.REACT_APP_ERC20_ADDRESS,
    symbol: 'SFPY',
    decimals: 18,
    chainId: 1337,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6/logo.png',
  },
]

export default ganache
