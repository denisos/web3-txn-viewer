
// fwap is a simple utility library I created which wraps fetch and 
//  supports typing and error handling (throws on 4/5xx) and converts 
//  response to json
//
import fwap from 'fwap';
import { NearTransaction } from '../types/types';

const baseUrl = `http://figment-mock-data.figment.network`;
const SECRET_API_KEY = 'SECRET_API_KEY';

export function getTransactions(): Promise<NearTransaction[] | Error>  {
  return fwap.get<NearTransaction[]>(`${baseUrl}/near/transactions?api_key=${SECRET_API_KEY}`);
}
