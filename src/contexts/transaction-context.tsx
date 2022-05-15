import { createContext, useContext, useEffect, useState } from "react";
import { NearTransaction } from '../types/types';
import { getTransactions } from '../api/api';

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

// to-do: set this and fix ts error in test
// function TransactionProvider({ children }: TransactionProviderProps) {
// function TransactionProvider(props: React.PropsWithChildren<{}>) {
function TransactionProvider(props: any) {
  const [ transactions, setTransactions ] = useState<NearTransaction[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);

  async function fetch() {
    // console.log("context running fetch")
    setError(false);
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
      setLoading(false);
    } catch(error) {
      setError(true);
    }
  }

  // fetch data to start, then kickoff interval polling
  useEffect(() => {
    // console.log("context running useEffect")
    fetch(); 

    // const timerId = setInterval(fetch, 1000 * 5);

    // return () => clearInterval(timerId);
  }, [])

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
