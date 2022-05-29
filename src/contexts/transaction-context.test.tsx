import { render, screen, act, waitFor } from '@testing-library/react';

import { TransactionProvider, useTransactions } from './transaction-context';

import { NearTransaction, LoadingState } from '../types/types';
import { data } from '../mocks/transactions';

import * as API from '../api/api';


describe('transaction-context', () => {
  const MockChildComponent = () => {
    const { transactions, loadingState } = useTransactions();

    return (
      <>
        <h1>Child Loaded</h1>
        {loadingState === LoadingState.Error && <h1>Child Error</h1>}
      </>
    );
  };

  test('should call api and render child on success', async () => {
    // spy on the getTransactions fn and return mock data so we can check it was called
    //  as expected
    const apiSpy = jest.spyOn(API, 'getTransactions')
      .mockImplementation(() => {
        return Promise.resolve(data as NearTransaction[]);
      });

    render(
      <TransactionProvider>
        <MockChildComponent />
      </TransactionProvider>
    )

    await waitFor(() => {
      // success
      expect(screen.getByText(/Child Loaded/i)).toBeInTheDocument();

      // no error
      const errorEl = screen.queryByText(/Child Error/i);
      expect(errorEl).toBe(null);

      expect(apiSpy).toHaveBeenCalledTimes(1);
    });
    
    // if we did not have the waitFor above then could also use the following
    //  where dataPromise is the promise returned by the spy
    // more: https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    // await act(async () => {
    //   await dataPromise
    // });
  });
});
