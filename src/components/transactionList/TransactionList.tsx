import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { useTransactions } from '../../contexts/transaction-context';
import TransactionDetails from '../../components/transactionDetails/TransactionDetails';
import BasicMessage from './BasicMessage';
import { NearTransaction } from '../../types/types';
import { filterSuccessfulTransfers, compareTransactionTimesAsc } from '../../utils/utils';
import { Button } from '../button/Button';

const showMessage = (text: string) => (
  <TransactionListStyle>
    <BasicMessage>{text}</BasicMessage>
  </TransactionListStyle>
);

const TransactionListStyle = styled.div`
  background-color: ${props => props.theme.dark};
  border-radius: ${props => props.theme.radius};
  min-width: 700px;
  min-height: 120px;
`;

const TransactionListButtonsBox = styled.div`
  margin: 20px 10px;
  display: flex;
  justify-content: space-around;
`;

export default function TransactionList(): JSX.Element {
  const { transactions, loading, error } = useTransactions();
  const [ transactionIndex, setTransactionIndex ] = useState<number>(0);

  // memoize and only regen when transactions ref changes
  const successfulSortedTransfers: NearTransaction[] = useMemo(() => {
    return transactions
      .filter(filterSuccessfulTransfers)
      .sort((transactionA, transactionB) => 
        compareTransactionTimesAsc(transactionA, transactionB))
  }, [transactions]);

  const isPreviousDisabled = transactionIndex <= 0;
  const isNextDisabled = (transactionIndex + 1) >= successfulSortedTransfers.length;

  const handlePreviousOnClick = () => {
    if (transactionIndex > 0) {
      setTransactionIndex(previous => previous - 1);
    }
  };

  const handleNextOnClick = () => {
    if (transactionIndex < successfulSortedTransfers.length) {
      setTransactionIndex(previous => previous + 1);
    }
  };

  if (loading) {
    return showMessage("Loading transactions...");
  }

  if (!transactions || error) {
    return showMessage("Sorry, an Error happened. Try reloading.");
  }

  if (successfulSortedTransfers?.length <= 0) {
    return showMessage("Sorry, no successful Transfer transactions returned from the graph.");
  }

  return (
    <TransactionListStyle>
      <TransactionDetails transaction={successfulSortedTransfers[transactionIndex]} />

      <TransactionListButtonsBox>
        <Button onClick={handlePreviousOnClick} disabled={isPreviousDisabled}>Previous</Button>

        <Button onClick={handleNextOnClick} disabled={isNextDisabled}>Next</Button>
      </TransactionListButtonsBox>
    </TransactionListStyle>
  );
}