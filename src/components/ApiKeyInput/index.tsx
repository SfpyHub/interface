import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Eye, EyeOff } from 'react-feather'
import { ApiKey } from '../../order'
import Copy from '../AccountDetails/Copy'
import { shortenPvtKey } from '../../utils'

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
`

const KeyGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const KeySection = styled.div`
  background-color: ${({ theme }) => theme.bg1};
`

const YourKey = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const KeyName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
`

const KeyLink = styled.div`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
    cursor: pointer;
  }
`

const KeyControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

interface ApiKeyInputProps {
  apikey?: ApiKey
  showCopy?: boolean
}

export default function ApiKeyInput({ apikey, showCopy }: ApiKeyInputProps) {
  const [revealed, setRevealed] = useState<boolean>(false)

  function formatConnectorName() {
    return <KeyName>Your private key</KeyName>
  }

  const maskedText = useMemo(() => {
    return '• • • • • • • • • • •'
  }, [])

  return (
    <KeySection>
      <YourKey>
        <InfoCard>
          <KeyGroupingRow>{formatConnectorName()}</KeyGroupingRow>
          <KeyGroupingRow id="web3-account-identifier-row">
            {apikey && (
              <KeyControl>
                <>
                  <div>
                    <p>{revealed ? shortenPvtKey(apikey.pvtKey) : maskedText}</p>
                  </div>
                </>
              </KeyControl>
            )}
          </KeyGroupingRow>
          <KeyGroupingRow>
            {apikey && (
              <>
                <KeyControl>
                  {showCopy && (
                    <div>
                      <Copy toCopy={apikey.pvtKey}>
                        <span style={{ marginLeft: '4px' }}>Copy Private Key</span>
                      </Copy>
                    </div>
                  )}
                  <KeyLink onClick={() => setRevealed(!revealed)}>
                    {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                    {revealed ? (
                      <span style={{ marginLeft: '4px' }}>Hide Key</span>
                    ) : (
                      <span style={{ marginLeft: '4px' }}>Reveal Key</span>
                    )}
                  </KeyLink>
                </KeyControl>
              </>
            )}
          </KeyGroupingRow>
        </InfoCard>
      </YourKey>
    </KeySection>
  )
}
