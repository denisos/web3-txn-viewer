import { useState } from 'react';
import styled from 'styled-components';

import { useTransactions } from '../../contexts/transaction-context';
import TransactionDetails from '../../components/transactionDetails/TransactionDetails';
import BasicMessage from './BasicMessage';

function showMessage(text: string) {
  return (
    <TransactionListStyle>
      <BasicMessage>{text}</BasicMessage>
    </TransactionListStyle>
  );
}

const TransactionListStyle = styled.div`
  background-color: ${props => props.theme.dark};
  border-radius: ${props => props.theme.radius};
  min-width: 700px;
  min-height: 120px;
`;

export default function TransactionList(): JSX.Element {
  const { transactions, loading, error } = useTransactions();
  const [ transactionIndex, setTransactionIndex ] = useState<number>(0);

  const atStart = transactionIndex < 1;
  const atEnd = transactionIndex === transactions.length - 1;

  const handlePreviousOnClick = () => {
    if (transactionIndex > 0) {
      setTransactionIndex(previous => previous - 1);
    }
  };

  const handleNextOnClick = () => {
    if (transactionIndex <= transactions.length) {
      setTransactionIndex(previous => previous + 1);
    }
  };


  // console.log("transactions are ", transactions);
  // console.log("transactionIndex ", transactionIndex);

  if (loading) {
    return showMessage("Loading transactions...");
  }

  if (error) {
    return showMessage("Sorry, an Error happened. Try reloading.");
  }

  if (transactions?.length <= 0) {
    return showMessage("Sorry, no transactions returned from the graph.");
  }

  return (
    <TransactionListStyle>
      <TransactionDetails transaction={transactions[transactionIndex]} />

      <button onClick={handlePreviousOnClick} disabled={atStart}>Previous</button>

      <button onClick={handleNextOnClick} disabled={atEnd}>Next</button>
    </TransactionListStyle>
  );
}