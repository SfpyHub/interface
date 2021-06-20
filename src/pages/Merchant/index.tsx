import React, { useState } from 'react'
import styled from 'styled-components'
import { AutoRow } from '../../components/Row'
import { Tabs } from '../../components/Tabs'
import Profile from './Profile'
import Developer from './Developer'

const StyledAutoRow = styled(AutoRow)`
  max-width: 420px;
`

export default function Merchant() {
  const [activeTab, setActiveTab] = useState<string>('profile')
  return (
    <>
      <StyledAutoRow justify="center">
        <Tabs
          tabs={[
            {
              title: 'Profile',
              key: 'profile',
            },
            {
              title: 'Developer',
              key: 'developer',
            },
          ]}
          active={activeTab}
          onClick={(key) => setActiveTab(key)}
        />
      </StyledAutoRow>
      {activeTab === 'profile' ? <Profile /> : <Developer />}
    </>
  )
}
