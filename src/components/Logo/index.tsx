import React, { useState } from 'react'
import { HelpCircle } from 'react-feather'
import { ImageProps } from 'rebass'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
}

export default function Logo({ srcs, alt, ...rest }: LogoProps) {
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find((src) => !BAD_SRCS[src])

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) {
            BAD_SRCS[src] = true
            refresh((i) => i + 1)
          }
        }}
      />
    )
  }

  return <HelpCircle {...rest} />
}
