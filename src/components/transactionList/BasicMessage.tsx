import styled from 'styled-components';

const BasicMessageStyle = styled.div`
  display: flex;
  color: ${props => props.theme.yellow};
  justify-content: center;
`;

interface BasicMessageProps {
  children:  React.ReactNode;
}

export default function BasicMessage({ children }: BasicMessageProps): JSX.Element {
  return (
    <BasicMessageStyle>{children}</BasicMessageStyle>
  )
}