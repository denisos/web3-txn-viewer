import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { useTransactions } from '../../contexts/transaction-context';
import TransactionDetails from '../../components/transactionDetails/TransactionDetails';
import BasicMessage from './BasicMessage';
import { NearTransaction, LoadingState } from '../../types/types';
import { filterSuccessfulTransfers, compareTransactionTimesAsc } from '../../utils/utils';
import { Button } from '../button/Button';
import useIterator from '../../hooks/useIterator';

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
  const { transactions, loadingState } = useTransactions();

  // memoize and only regen when transactions ref changes
  const successfulSortedTransfers: NearTransaction[] = useMemo(() => {
    return transactions
      .filter(filterSuccessfulTransfers)
      .sort((transactionA, transactionB) => 
        compareTransactionTimesAsc(transactionA, transactionB))
  }, [transactions]);

  const successfulTransfersIterator = 
    useIterator<NearTransaction>(successfulSortedTransfers);


  const handlePreviousOnClick = () => {
    successfulTransfersIterator.prev();
  };

  const handleNextOnClick = () => {
    successfulTransfersIterator.next();
  };

  if (loadingState === LoadingState.Loading) {
    return showMessage("Loading transactions...");
  }

  if (!transactions || loadingState === LoadingState.Error) {
    return showMessage("Sorry, an Error happened. Try reloading.");
  }

  if (successfulTransfersIterator.isEmpty()) {
    return showMessage("Sorry, no successful Transfer transactions returned from the graph.");
  }

  return (
    <TransactionListStyle>
      {successfulTransfersIterator.current && <TransactionDetails transaction={successfulTransfersIterator.current} />}

      <TransactionListButtonsBox>
        <Button onClick={handlePreviousOnClick} disabled={successfulTransfersIterator.isFirst()}>Previous</Button>

        <Button onClick={handleNextOnClick} disabled={successfulTransfersIterator.isLast()}>Next</Button>
      </TransactionListButtonsBox>
    </TransactionListStyle>
  );
}