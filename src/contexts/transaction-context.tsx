import { createContext, useContext, useEffect, useState, useRef } from "react";
import { NearTransaction, LoadingState } from '../types/types';
import { getTransactions } from '../api/api';
import { isDifferentTransactionLists } from '../utils/utils';
import useInterval from '../hooks/useInterval';

export type TransactionContextType = {
  transactions: NearTransaction[],
  loadingState: LoadingState,
  restartPolling: () => void
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
  const [ isPolling, setIsPolling ] = useState(false);

  const pollingErrorCountRef = useRef(0);

  const setPollingErrorCount = (newValue: number) => pollingErrorCountRef.current = newValue;

  // helper fn to restart polling if stopped due to error
  const restartPolling = () => setIsPolling(true);

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
    // exit if in loading or error state
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
      // it's polling every n seconds, so assume some few failures are ok but if 
      //  exceed error threshold then stop polling and set error state for ui to handle
      if (pollingErrorCountRef.current >= POLLING_ERROR_THRESHOLD) {
        setLoadingState(LoadingState.Error)
        setIsPolling(false);                    // stop polling

        setPollingErrorCount(0);
      } else {
        setPollingErrorCount(pollingErrorCountRef.current + 1);
      }
    }
  };

  // fetch data to start
  useEffect(() => {
    initialFetch(); 
  }, []);

  // kickoff polling using useInterval() hook
  useInterval(pollingFetch, isPolling ? POLLING_INTERVAL : null)

  const value = { 
    transactions,
    loadingState,
    restartPolling
  };
  
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export { TransactionProvider, useTransactions };
