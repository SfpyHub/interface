import { useState, useLayoutEffect } from 'react'

// async function getColorFromToken(token: Token): Promise<string | null> {
// 	if (token.chainId === ChainId.RINKEBY && token.address === '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735') {
// 		return Promise.resolve('#FAAB14')
// 	}

// 	const path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`

// 	return Vibrant.from(path)
// 		.getPalette()
// 		.then(palette => {
// 			if (palette?.Vibrant) {
// 				let detectedHex = palette.Vibrant.hex
// 				let AAscore = hex(detectedHex, '#FFF')
// 				while (AAscore < 3) {
// 					detectedHex = shade(0.005, detectedHex)
//           AAscore = hex(detectedHex, '#FFF')
// 				}
// 				return detectedHex
// 			}
// 			return null
// 		})
// 		.catch(() => null)
// }

export function useColor() {
  const [color, setColor] = useState('#2172E5')

  useLayoutEffect(() => {
    setTimeout(() => {
      setColor('#2172E5')
    }, 1000)

    // if (token) {
    // 	getColorFromToken(token).then(tokenColor => {
    // 		if (!stale && tokenColor !== null) {
    // 			setColor(tokenColor)
    // 		}
    // 	})
    // }

    return () => {
      setColor('#2172E5')
    }
  }, [])

  return color
}
