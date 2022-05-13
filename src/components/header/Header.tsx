import styled from 'styled-components';

const H1Header = styled.h1`
  color: ${props => props.theme.yellow};
  text-align: center;
`;

interface HeaderProps {
  children:  React.ReactNode;
}

export default function Header({ children }: HeaderProps): JSX.Element {

  return (
    <header>
      <H1Header>{children}</H1Header>
    </header>
  );
}