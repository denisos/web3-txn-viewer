import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TransactionContext, TransactionContextType } from '../../contexts/transaction-context';
import TransactionList from './TransactionList';
import { NearTransaction, LoadingState } from '../../types/types';
import { data } from '../../mocks/transactions';
import { scaleDepositAsNear } from '../../utils/utils';

// helpers
function renderTransactionsList(ctx: TransactionContextType) {
  return render(
    <TransactionContext.Provider value={ctx}>
      <TransactionList />
    </TransactionContext.Provider>
  );
}

// function buildContext(transactions: NearTransaction[], loading = false, error = false) {
function buildContext(transactions: NearTransaction[], loadingState: LoadingState) {
  return {
    transactions, 
    loadingState
  }
}

describe('TransactionsList', () => {
  test('should render loading message view when loading', () => {
    const ctx = buildContext([], LoadingState.Loading); 

    renderTransactionsList(ctx)

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('should render error message view when error', () => {
    const ctx = buildContext([], LoadingState.Error);

    renderTransactionsList(ctx)

    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  test('should render no transactions message view when no transactions', () => {
    const ctx = buildContext([], LoadingState.Success);

    renderTransactionsList(ctx)

    expect(screen.getByText(/no successful Transfer transactions/i)).toBeInTheDocument();
  });

  test('should render when one transaction only, nav buttons disabled', () => {
    const ctx = buildContext([data[0] as NearTransaction], LoadingState.Success);

    renderTransactionsList(ctx)

    expect(screen.getByText(/Sender/i)).toBeInTheDocument();
    expect(screen.getByText(/Receiver/i)).toBeInTheDocument();
    expect(screen.getByText(/Deposit/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole('button', { name: "Next" })).toBeDisabled();
  });

  test('should render when multiple transactions', async () => {

    const ctx = buildContext([...data as NearTransaction[]], LoadingState.Success);

    renderTransactionsList(ctx)

    expect(screen.getByText(/Sender/i)).toBeInTheDocument();
    expect(screen.getByText(/Receiver/i)).toBeInTheDocument();
    expect(screen.getByText(/Deposit/i)).toBeInTheDocument();

    // important: transactions are filtered and ordered by oldest first which is the 3rd
    //  (i.e. last) entry in the mock data
    // and there are only 2 successful Trasnfers in the mock data
    expect(screen.getByText(data[3].sender)).toBeInTheDocument();
    expect(screen.getByText(data[3].receiver)).toBeInTheDocument();
    expect(screen.getByText(scaleDepositAsNear(data[3].actions[0].data.deposit)))
      .toBeInTheDocument();


    // previous disabled and next enabled
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();

    // click next and now previous is enabled and next disab;ed
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();

    // click previous, back at start so previous is once again disabled and next enabled
    await userEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });
});
