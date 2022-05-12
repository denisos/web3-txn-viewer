import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TransactionProvider } from '../../contexts/transaction-context';
import TransactionList from './TransactionList';
import { NearTransaction } from '../../types/types';
import { data } from '../../mocks/transactions';

// helpers
function renderTransactionsList(ctx: any) {
  return render(
    <TransactionProvider value={ctx}>
      <TransactionList />
    </TransactionProvider>
  );
}

function buildContext(transactions: NearTransaction[], loading = false, error = false) {
  return {
    transactions, 
    loading,
    error
  }
}

describe('TransactionsList', () => {
  test('should render loading message view when loading', () => {
    const ctx = buildContext([], true); 

    renderTransactionsList(ctx)

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('should render error message view when error', () => {
    const ctx = buildContext([], false, true);

    renderTransactionsList(ctx)

    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  test('should render no transactions message view when no transactions', () => {
    const ctx = buildContext([]);

    renderTransactionsList(ctx)

    expect(screen.getByText(/no transactions returned/i)).toBeInTheDocument();
  });

  test('should render when one transaction only, nav buttons disabled', () => {
    const ctx = buildContext([data[0] as NearTransaction]);

    renderTransactionsList(ctx)

    expect(screen.getByText(/Sender/i)).toBeInTheDocument();
    expect(screen.getByText(/Receiver/i)).toBeInTheDocument();
    expect(screen.getByText(/Deposit/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole('button', { name: "Next" })).toBeDisabled();
  });

  test('should render when multiple transactions', async () => {

    const ctx = buildContext([...data as NearTransaction[]]);

    renderTransactionsList(ctx)

    expect(screen.getByText(/Sender/i)).toBeInTheDocument();
    expect(screen.getByText(/Receiver/i)).toBeInTheDocument();
    expect(screen.getByText(/Deposit/i)).toBeInTheDocument();
    expect(screen.getByText(data[0].sender)).toBeInTheDocument();
    expect(screen.getByText(data[0].receiver)).toBeInTheDocument();
    // to-do:
    // expect(screen.getByText(data[0].??deposit??)).toBeInTheDocument();

    // previous disabled and next enabled
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();

    // click next and now previous is enabled
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();

    // click previous, back at start so previous is once again disabled
    await userEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });
});
