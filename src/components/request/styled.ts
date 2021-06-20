import styled from 'styled-components'

export const DataCard = styled.div<{ disabled?: boolean }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #2172e5 100%);
  border-radius: 12px;
  width: 100%;
  position: relative;
  overflow: hidden;
`

export const CardSection = styled.div<{ disabled?: boolean }>`
  width: 100%;
  padding: 1rem;
  opacity: ${({ disabled }) => disabled && '0.4'};
`
