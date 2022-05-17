import { createContext, useContext, useEffect, useState } from "react";
import { NearTransaction } from '../types/types';
import { getTransactions } from '../api/api';
import { isDifferentTransactionLists } from '../utils/utils';

export type TransactionContextType = {
  transactions: NearTransaction[],
  loading: boolean,
  error: boolean
};

type TransactionProviderProps = {
  children: React.ReactNode
};

const POLLING_INTERVAL = 1000 * 20; // polls the api every 20 seconds
const POLLING_ERROR_THRESHOLD = 4;  // stop polling after 4 consecutive polling failures

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
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ pollingErrorCount, setPollingErrorCount] = useState(0);
  const [ timerId, setTimerId ] = useState<NodeJS.Timer>();

  async function initialFetch() {
    setError(false);
    setLoading(true);
    try {
      const data: NearTransaction[] = await getTransactions();
      setTransactions(data);
      setLoading(false);
    } catch(error) {
      setError(true);
    }
  }

  // different logic when polling than initial fetch
  const pollingFetch = async () => {
    // exit if already in error or loading state
    if (error || loading) {
      return;
    }

    try {
      const newTransactions = await getTransactions();
      setPollingErrorCount(0); // success so, reset count

      // check if any new transactions have been received, if not then no
      //  need to update the current list of transactions
      if (isDifferentTransactionLists(transactions, newTransactions)) {
        setTransactions(newTransactions);
      } 
    } catch(error) {
      // it's polling every 20 seconds, so assume some few failures are ok but if 
      //  exceed error threshold then set error state for ui to handle
      setPollingErrorCount(prevCount => {
        if (prevCount > POLLING_ERROR_THRESHOLD) {
          setTimerId(prevTimerId => {
            clearInterval(prevTimerId)
            return prevTimerId;
          })

          setError(true);
        }
        return prevCount + 1;
      });
    }
  };

  // fetch data to start, then kickoff interval polling
  useEffect(() => {
    initialFetch(); 

    const aTimerId = setInterval(pollingFetch, POLLING_INTERVAL);
    setTimerId(aTimerId);

    return () => clearInterval(aTimerId);
  }, []);

  const value = { 
    transactions,
    loading,
    error
  };
  
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export { TransactionProvider, useTransactions };
