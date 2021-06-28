import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Eye, EyeOff } from 'react-feather'
import { AppDispatch } from '../../state'
import { Wrapper } from '../../components/pay/styleds'
import { ButtonSecondary } from '../../components/Button'
import Copy from '../../components/AccountDetails/Copy'
import { shortenPvtKey } from '../../utils'
import AppBody from '../AppBody'
import { ApiState } from '../../api'
import { useUpdateApiKeyCallback, useApiKeyResponse } from '../../state/apikey/hooks'
import { setApiKey } from '../../state/auth/actions'

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

export default function Developer() {
  const dispatch = useDispatch<AppDispatch>()
  const [revealed, setRevealed] = useState<boolean>(false)
  const apikey = useApiKeyResponse()
  const { state: updateState, data: updateData, execute } = useUpdateApiKeyCallback()

  function formatConnectorName() {
    return <KeyName>Your API key</KeyName>
  }

  const maskedText = useMemo(() => {
    return '• • • • • • • • • • •'
  }, [])

  useEffect(() => {
    if (updateData) {
      dispatch(setApiKey({ apikey: updateData }))
    }
  }, [updateData, dispatch])

  return (
    <AppBody>
      <Wrapper>
        <KeySection>
          <YourKey>
            <InfoCard>
              <KeyGroupingRow>
                {formatConnectorName()}
                <div>
                  <KeyAction
                    style={{ fontSize: '0.825rem', fontWeight: 400 }}
                    onClick={execute}
                    disabled={updateState !== ApiState.SUCCESS}
                  >
                    Update
                  </KeyAction>
                </div>
              </KeyGroupingRow>
              <KeyGroupingRow id="web3-account-identifier-row">
                {apikey?.pvtKey && (
                  <KeyControl>
                    <>
                      <div>
                        <p>{revealed ? shortenPvtKey(apikey?.pvtKey) : maskedText}</p>
                      </div>
                    </>
                  </KeyControl>
                )}
              </KeyGroupingRow>
              <KeyGroupingRow>
                {apikey?.pvtKey && (
                  <>
                    <KeyControl>
                      <div>
                        <Copy toCopy={apikey.pvtKey}>
                          <span style={{ marginLeft: '4px' }}>Copy Private Key</span>
                        </Copy>
                      </div>
                      <AddressLink onClick={() => setRevealed(!revealed)}>
                        {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                        {revealed ? (
                          <span style={{ marginLeft: '4px' }}>Hide Key</span>
                        ) : (
                          <span style={{ marginLeft: '4px' }}>Reveal Key</span>
                        )}
                      </AddressLink>
                    </KeyControl>
                  </>
                )}
              </KeyGroupingRow>
            </InfoCard>
          </YourKey>
        </KeySection>
      </Wrapper>
    </AppBody>
  )
}
