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

export const scaleDepositAsNear = (deposit: string) => {
  if (deposit) {
    deposit = scaleToFactor(deposit);
    return`${deposit} NEAR`;
  }
  return '';
}

// just using a simple rule now but a more robust solution would be to check the first
//  transaction in both lists ids and/or timestamps
export const isDifferentTransactionLists =
  (oldList: NearTransaction[], newList: NearTransaction[]) => {
  return (newList.length > oldList.length);
}
