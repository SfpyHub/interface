import styled from 'styled-components'
import Column from '../../components/Column'

export const Wrapper = styled.div`
  position: relative;
`

export const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

export const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

export const PaddedColumn = styled(Column)`
  padding: 0.5rem;
  position: relative;
`

export const Input = styled.input`
  background: transparent;
  border: 0px;
  border-radius: 0px;
  font-size: 16px;
  line-height: 36px;
  width: 100%;
  margin: 0px;
  outline: none;
  color: ${({ theme }) => theme.text1};
  -webkit-appearance: none;
  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
`

export const ErrorLabel = styled.label`
  color: ${({ theme }) => theme.red1};
  cursor: pointer;
  font-size: 14px;
  line-height: 36px;
  right: 12px;
  position: absolute;
  z-index: 12;
  opacity: 1;
  transform: translate3d(0px, 0px, 0px);
  transition: all 222ms cubic-bezier(0.44, -0.22, 0, 1.5);
  -moz-transition: all 222ms cubic-bezier(0.44, -0.22, 0, 1.5);
  -o-transition: all 222ms cubic-bezier(0.44, -0.22, 0, 1.5);
  -ms-transition: all 222ms cubic-bezier(0.44, -0.22, 0, 1.5);
  -webkit-transition: all 222ms cubic-bezier(0.44, -0.22, 0, 1.5);
`

export const Label = styled.label`
  color: ${({ theme }) => theme.text3};
  cursor: pointer;
  line-height: 36px;
  font-size: 14px;
`
