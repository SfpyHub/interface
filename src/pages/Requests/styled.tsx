import styled from 'styled-components'

const handleColorType = (status?: any, theme?: any) => {
  switch (status) {
    case 'started':
      return theme.blue1
    case 'pending':
      return theme.blue1
    case 'cancelled':
      return theme.yellow1
    case 'active':
      return theme.blue1
    case 'paid':
      return theme.green1
    case 'overpaid':
      return theme.yellow1
    default:
      return theme.text3
  }
}

export const RequestStatus = styled.span<{ status: string }>`
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ status, theme }) => handleColorType(status, theme)};
  border: 1px solid ${({ status, theme }) => handleColorType(status, theme)};
  width: fit-content;
  justify-self: flex-end;
  text-transform: uppercase;
`
