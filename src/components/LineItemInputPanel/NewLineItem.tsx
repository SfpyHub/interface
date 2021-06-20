import React from 'react'
import styled from 'styled-components'
import { Plus } from 'react-feather'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const Container = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
  :focus,
  :hover {
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.primary1};
    svg > * {
      stroke: ${({ theme }) => theme.primary1};
    }
  }
`

const StyledPlus = styled(Plus)`
  color: ${({ theme }) => theme.primary1};
`

const CreateWrapper = styled.div<{ clickable: boolean }>`
  padding: 2px;
`

export function NewLineItem({ onClick }: { onClick: () => void }) {
  return (
    <Container onClick={onClick}>
      <AutoColumn justify="space-between">
        <AutoRow justify={'center'} style={{ padding: '0.75rem 1rem' }}>
          <CreateWrapper clickable>
            <StyledPlus size="20" />
          </CreateWrapper>
        </AutoRow>
      </AutoColumn>
    </Container>
  )
}
