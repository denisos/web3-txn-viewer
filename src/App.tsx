import styled from 'styled-components';
import TransactionViewer from './pages/TransactionViewer';
import { TransactionProvider } from './contexts/transaction-context';

const AppStyle = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.gray};
`;


function App(): JSX.Element {
  return (
    <TransactionProvider>
      <AppStyle>
        <TransactionViewer />
      </AppStyle>
    </TransactionProvider>
  );
}

export default App;
