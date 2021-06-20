import React from 'react'
import styled from 'styled-components'
import { ColumnCenter } from '../Column'
import Row, { RowBetween } from '../Row'
import { LinkInput } from './styled'

const InfoCard = styled.div<{ active?: boolean }>`
  background-color: ${({ theme, active }) => (active ? theme.bg3 : theme.bg2)};
  padding: 1rem;
  outline: none;
  border: 1px solid;
  border-radius: 12px;
  width: 100% !important;
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primary1};
  }
  border-color: ${({ theme, active }) => (active ? 'transparent' : theme.bg3)};
`

const OptionCard = styled(InfoCard as any)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`

const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  margin-top: 0;
  &:hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
    border: ${({ clickable, theme }) => (clickable ? `1px solid ${theme.primary1}` : ``)};
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`

const HeaderText = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : ({ theme }) => theme.text1)};
  font-size: 1rem;
  font-weight: 500;
`

const SubHeader = styled.div`
  color: ${({ theme }) => theme.text1};
  margin-top: 10px;
  font-size: 12px;
  text-align: left;
`

const IconWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
		align-items: flex-end;
	`};
`

export default function Option({
  id,
  field,
  color,
  header,
  subheader,
  placeholder,
  value,
  onChange,
  Icon,
}: {
  id: string
  field: string
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  placeholder: string
  value?: string
  onChange?: (field: string, value: string) => void
  Icon?: React.ReactNode
}) {
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(field, value)
  }

  const content = (
    <OptionCardClickable id={id} clickable={false} active={false}>
      <ColumnCenter>
        <RowBetween>
          <OptionCardLeft>
            <HeaderText color={color}>{header}</HeaderText>
            {subheader && <SubHeader>{subheader}</SubHeader>}
          </OptionCardLeft>
          <IconWrapper>{Icon}</IconWrapper>
        </RowBetween>
        <Row padding={'1rem 0 0'}>
          <LinkInput
            type="text"
            id={`add-link=${id}`}
            placeholder={placeholder}
            value={value}
            onChange={onChangeInput}
          />
        </Row>
      </ColumnCenter>
    </OptionCardClickable>
  )

  return content
}
