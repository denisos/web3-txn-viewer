import { createContext, useContext, useState } from "react";
import { NearTransaction } from '../types/types';

import { data } from '../mocks/transactions';

export type TransactionContextType = {
  transactions: NearTransaction[],
  loading: boolean,
  error: boolean
};

type TransactionProviderProps = {
  children: React.ReactNode
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("TransactionsContext undefined");
  }
  return context;
}

// function TransactionProvider({ children }: TransactionProviderProps) {
// function TransactionProvider(props: React.PropsWithChildren<{}>) {
function TransactionProvider(props: any) {
  const [ transactions, setTransactions ] = useState<NearTransaction[]>(data as NearTransaction[]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);

  const value = { 
    transactions,
    loading,
    error
  };
  
  return (
    <TransactionContext.Provider value={value} {...props} />
  );
}

export { TransactionProvider, useTransactions };
