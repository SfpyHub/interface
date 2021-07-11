import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Eye, EyeOff } from 'react-feather'
import { ButtonSecondary } from '../Button'
import { SharedSecret } from '../../order'
import { shortenPvtKey } from '../../utils'
import Column from '../Column'
import Copy from '../AccountDetails/Copy'

const Wrapper = styled(Column)`
  width: 100%;
`

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
  border-radius: 20px;
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

const KeyAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const AddressLink = styled.div`
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

export function SharedSecretComponent({ 
  secret, 
  isLoading, 
  onClickRotate 
}: { 
  secret: SharedSecret,
  isLoading: boolean,
  onClickRotate: () => void
}) {
  
  const [revealed, setRevealed] = useState<boolean>(false)
  
  function formatConnectorName() {
    return <KeyName>Your Shared Secret</KeyName>
  }

  const maskedText = useMemo(() => {
    return '• • • • • • • • • • •'
  }, [])

  const secretkey = secret.secret

  return (
    <Wrapper>
      <KeySection>
        <YourKey>
          <InfoCard>
            <KeyGroupingRow>
              {formatConnectorName()}
              <div>
                <KeyAction
                  style={{ fontSize: '0.825rem', fontWeight: 400 }}
                  onClick={onClickRotate}
                  disabled={isLoading}
                >
                  Rotate
                </KeyAction>
              </div>
            </KeyGroupingRow>
            <KeyGroupingRow id="web3-account-identifier-row">
              <KeyControl>
                <>
                  <div>
                    <p>{revealed ? shortenPvtKey(secretkey) : maskedText}</p>
                  </div>
                </>
              </KeyControl>
            </KeyGroupingRow>
            <KeyGroupingRow>
              <>
                <KeyControl>
                  <div>
                    <Copy toCopy={secretkey}>
                      <span style={{ marginLeft: '4px' }}>Copy Shared Secret</span>
                    </Copy>
                  </div>
                  <AddressLink onClick={() => setRevealed(!revealed)}>
                    {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                    {revealed ? (
                      <span style={{ marginLeft: '4px' }}>Hide Secret</span>
                    ) : (
                      <span style={{ marginLeft: '4px' }}>Reveal Secret</span>
                    )}
                  </AddressLink>
                </KeyControl>
              </>
            </KeyGroupingRow>
          </InfoCard>
        </YourKey>
      </KeySection>
    </Wrapper>
  )
}