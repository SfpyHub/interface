import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

const Details = styled.div<{ top: string; bottom: string }>`
  width: 100%;
  margin-bottom: ${({ bottom }) => bottom && `${bottom}`};
  margin-top: ${({ top }) => top && `${top}`};
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  flex-shrink: 1;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const StyledText = styled(Text)<{ fontSize?: string; align?: string }>`
  color: ${({ theme }) => theme.text1};
  width: 0;
  position: relative;
  font-weight: 800;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  font-size: ${({ fontSize }) => fontSize ?? '29px'};
  text-align: ${({ align }) => align && align};
  overflow-wrap: break-word;
  padding: 0px;
`

export default function ReceiverDetails({
  name,
  verified,
}: {
  name: string
  verified?: boolean
  website?: string
  twitter?: string
  instagram?: string
}) {
  return (
    <Details top={'5px'} bottom={'10px'}>
      <Wrapper>
        <Row>
          <StyledText fontSize={'19px'}>{name}</StyledText>
        </Row>
      </Wrapper>
    </Details>
  )
}
