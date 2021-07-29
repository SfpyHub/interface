import React, { useEffect } from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { TYPE } from '../../theme'
import { RowBetween, AutoRow } from '../../components/Row'
import { 
  UserItem, 
  KeyItem, 
  WebhookItem,
  CreateItem,
  RequestsItem,
  PoolsItem
} from '../../components/AccountMenu/MenuItem'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const MenuGrid = styled(AutoRow)`
  max-width: 372px;
  width: 100%;
  justify-content: center;
`

const TitleRow = styled(RowBetween)`
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		flex-wrap: wrap;
		gap: 12px;
		width: 100%;
	`};
`

export default function Menu() {
  return (
    <>
      <PageWrapper gap="lg" justify="center">
        <TopSection gap="md">
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="lg" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Menu
                </TYPE.mediumHeader>
              </TitleRow>
            </AutoColumn>
          </AutoColumn>
        </TopSection>
        <MenuGrid>
          <CreateItem />
          <RequestsItem />
          <PoolsItem />
          <UserItem />
          <KeyItem />
          <WebhookItem />
        </MenuGrid>
      </PageWrapper>
    </>
  )
}