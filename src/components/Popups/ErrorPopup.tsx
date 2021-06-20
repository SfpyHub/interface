import React, { useContext } from 'react'
import { AlertCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function ErrorPopup({ category, summary }: { category?: string; summary?: string }) {
  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        <AlertCircle color={theme.red1} size={24} />
      </div>
      <AutoColumn gap="8px">
        {category && <TYPE.subHeader fontWeight={500}>{category}</TYPE.subHeader>}
        {summary && <TYPE.subHeader>{summary}</TYPE.subHeader>}
      </AutoColumn>
    </RowNoFlex>
  )
}
