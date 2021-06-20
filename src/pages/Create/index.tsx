import React, { useContext, useCallback } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useToggleLineItemModal } from '../../state/application/hooks'
import LineItemModal from '../../components/LineItemModal'
import LineItemInputPanel from '../../components/LineItemInputPanel'
import ReceiverInputPanel from '../../components/ReceiverInputPanel'
import { NewLineItem } from '../../components/LineItemInputPanel/NewLineItem'
import { AutoRow } from '../../components/Row'
import AdvancedDetailsDropdown from '../../components/AdvancedDetailsDropdown'
import { AdvancedCreateDetails } from '../../components/AdvancedDetailsDropdown/AdvancedCreateDetails'
import { RequestDetailsModal } from '../../components/create/RequestDetailsModal'
import Modal from '../../components/Modal'

import { ArrowWrapper, BottomGrouping, Wrapper, Dots } from '../../components/pay/styleds'
import { Field } from '../../state/create/actions'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks/useWeb3'

import { useCreateActionHandlers, useCreateOrderCallback, useDerivedCreateInfo } from '../../state/create/hooks'

import { ApiState } from '../../api'

import AppBody from '../AppBody'

export default function Create() {
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle line item modal
  const toggleLineItemModal = useToggleLineItemModal()
  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { onAddLineItem, onRemoveLineItem, onUserInput } = useCreateActionHandlers()

  const handleLineItemAdd = useCallback(
    (lineItem) => {
      toggleLineItemModal()
      onAddLineItem(lineItem)
    },
    [onAddLineItem, toggleLineItemModal]
  )

  const handleLineItemRemove = useCallback(
    (lineItem) => {
      onRemoveLineItem(lineItem)
    },
    [onRemoveLineItem]
  )

  const handleTypeInput = useCallback(
    (lineItem, value: string) => {
      onUserInput(lineItem, value)
    },
    [onUserInput]
  )

  const { merchant, state: merchantLoading, fields, grandTotal, inputError: createInputError } = useDerivedCreateInfo()
  const isValid = !createInputError

  const { state, isOpen, setIsOpen, execute, request } = useCreateOrderCallback()

  function getFields() {
    return Object.keys(fields).map((key) => {
      return (
        <LineItemInputPanel
          id={`create-line-item-${key}`}
          key={key}
          value={key}
          amount={fields[key].format()}
          onDeleteInput={handleLineItemRemove}
          onUserInput={handleTypeInput}
          hideDeleteButton={key === Field.SUBTOTAL}
          disableInputSelect={false}
          disableUserInput={false}
        />
      )
    })
  }

  return (
    <>
      <AppBody>
        <Wrapper>
          <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
            <RequestDetailsModal order={request} setShowRequestDetailsModal={setIsOpen} />
          </Modal>
          <LineItemModal onSelectLineItem={handleLineItemAdd} />
          <AutoColumn gap={'md'}>
            <ReceiverInputPanel
              id="pay-to-recipient"
              label="To"
              name={merchant?.name}
              bgImg={merchant?.backgroundImg}
              profileImg={merchant?.profileImg}
              website={merchant?.websiteURL}
              instagram={merchant?.instagramURL}
              twitter={merchant?.twitterURL}
              loading={merchantLoading === ApiState.LOADING}
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={'center'} style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable>
                  <ArrowDown size="16" onClick={() => {}} color={theme.text2} />
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>
            {getFields()}
            <NewLineItem onClick={toggleLineItemModal} />
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : state === ApiState.LOADING ? (
              <ButtonLight disabled>
                Loading
                <Dots />
              </ButtonLight>
            ) : (
              <ButtonError onClick={execute} id="create-button" disabled={!isValid} error={false}>
                <Text fontSize={16} fontWeight={500}>
                  {createInputError ? createInputError : 'Create Request'}
                </Text>
              </ButtonError>
            )}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
      <AdvancedDetailsDropdown show={fields[Field.SUBTOTAL] && !fields[Field.SUBTOTAL].isZero()}>
        <AdvancedCreateDetails order={{ summary: fields, grandTotal }} />
      </AdvancedDetailsDropdown>
    </>
  )
}
