import { createContext, useContext, useState } from "react";
import { NearTransaction } from '../types/types';

import { data } from '../mocks/transactions';

type TransactionContextType = {
  transactions: NearTransaction[],
  loading: boolean,
  error: boolean
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("TransactionsContext undefined");
  }
  return context;
}

function TransactionProvider(props: any) {
  const [ transactions, setTransactions ] = useState(data);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);

  const value = { transactions, loading, error };
  
  return <TransactionContext.Provider value={value} {...props} />
}

export { TransactionProvider, useTransactions };
