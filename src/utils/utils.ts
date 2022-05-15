import { NearTransaction, ActionTypeEnum } from '../types/types';
import BigNumber from "bignumber.js";

export const isSuccessfulTransaction = (transaction: NearTransaction) => 
  transaction?.success || false;

// even though actions is array it is ok to just check first
export const isTransferTransaction = (transaction: NearTransaction) => 
  (transaction.actions_count > 0 &&
    transaction.actions[0]?.type === ActionTypeEnum.Transfer) || false;

// transaction is success if success is true && 1st action type is Transfer
export const filterSuccessfulTransfers = (transaction: NearTransaction) => 
  isSuccessfulTransaction(transaction) && isTransferTransaction(transaction);

export const compareDatesAsc = (dateA: string, dateB: string) => {
  let dateATime = new Date(dateA).getTime();
  let dateBTime = new Date(dateB).getTime();
  return dateATime - dateBTime;
}

export const compareTransactionTimesAsc = 
  (transactionA: NearTransaction, transactionB: NearTransaction) => 
    compareDatesAsc(transactionA.time, transactionB.time);

export const scaleToFactor = (value: string, factor = 24): string  => {
  // see https://mikemcl.github.io/bignumber.js/
  const bigNum = new BigNumber(value);
  return bigNum.dividedBy(10 ** factor).toString();
};
