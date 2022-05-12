import styled from 'styled-components';

const H1Header = styled.h1`
  color: ${props => props.theme.yellow};
  text-align: center;
`;


export default function Header({ children }: any) {

  return (
    <header>
      <H1Header>{children}</H1Header>
    </header>
  );
}