import styled from 'styled-components';

import Header from '../components/header/Header';
import TransactionList from '../components/transactionList/TransactionList';

const TransactionViewerStyle = styled.div`
  min-width: 700px;
  background-color: ${props => props.theme.dark};
  border-radius: ${props => props.theme.radius};
`;

export default function TransactionViewer() {

  return (
    <TransactionViewerStyle>
      <Header>Transaction viewer</Header>

      <TransactionList />

    </TransactionViewerStyle>
  );
}