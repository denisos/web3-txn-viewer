import { createContext, useContext, useEffect, useState, useRef } from "react";
import { NearTransaction, LoadingState } from '../types/types';
import { getTransactions } from '../api/api';
import { isDifferentTransactionLists } from '../utils/utils';

export type TransactionContextType = {
  transactions: NearTransaction[],
  loadingState: LoadingState
};

type TransactionProviderProps = {
  children: React.ReactNode
};

const POLLING_INTERVAL = 1000 * 20; // polls the api every 20 seconds
const POLLING_ERROR_THRESHOLD = 3;  // stop polling after 3 consecutive polling failures

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("TransactionsContext undefined");
  }
  return context;
}

// custom provide which fetches and polls and makes data available
function TransactionProvider({ children }: TransactionProviderProps) {
  const [ transactions, setTransactions ] = useState<NearTransaction[]>([]);
  const [ loadingState, setLoadingState ] = useState<LoadingState>(LoadingState.Loading);

  const pollingErrorCountRef = useRef(0);
  // use ref since needed elsewhere of initial call to cancel
  const timerIdRef = useRef<NodeJS.Timer>();

  const setPollingErrorCount = (newValue: number) => pollingErrorCountRef.current = newValue;

  async function initialFetch() {
    setLoadingState(LoadingState.Loading);
    try {
      const data: NearTransaction[] = await getTransactions();
      setTransactions(data);
      setLoadingState(LoadingState.Success);
    } catch(error) {
      setLoadingState(LoadingState.Error);
    }
  }

  // different logic when polling than initial fetch
  const pollingFetch = async () => {
    // exit not success state
    if (loadingState !== LoadingState.Success) {
      return;
    }

    try {
      const newTransactions = await getTransactions();
      setPollingErrorCount(0);    // success so, reset error count

      // check if any new transactions have been received, if not then no
      //  need to update the current list of transactions
      if (isDifferentTransactionLists(transactions, newTransactions)) {
        setTransactions(newTransactions);
      } 
    } catch(error) {
      // it's polling every 20 seconds, so assume some few failures are ok but if 
      //  exceed error threshold then set error state for ui to handle
      if (pollingErrorCountRef.current >= POLLING_ERROR_THRESHOLD) {
        setLoadingState(LoadingState.Error)
        clearInterval(timerIdRef.current);
        setPollingErrorCount(0);
      } else {
        setPollingErrorCount(pollingErrorCountRef.current + 1);
      }
    }
  };

  // fetch data to start, then kickoff interval polling
  useEffect(() => {
    initialFetch(); 

    const id = setInterval(pollingFetch, POLLING_INTERVAL);
    timerIdRef.current = id;

    return () => clearInterval(timerIdRef.current);
  }, []);

  const value = { 
    transactions,
    loadingState
  };
  
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export { TransactionProvider, useTransactions };
