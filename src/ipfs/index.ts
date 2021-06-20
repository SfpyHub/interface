import ipfsClient from 'ipfs-http-client'

export const ipfs = ipfsClient({
  protocol: 'https',
  host: 'ipfs.infura.io',
  port: 5001,
  //url: 'https://ipfs.infura.io'
})
