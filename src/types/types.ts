
export enum ActionTypeEnum {
  FunctionCall = 'FunctionCall',
  Transfer = 'Transfer',
  AddKey = 'AddKey'
}

export type ActionType = 'Transfer' | 'FunctionCall' | 'AddKey';

type Action = {
  type: ActionType,
}

export type Transfer = Action & {
  data: {
    deposit: string;
  };
  type: 'Transfer';
}

export type FunctionCall = Action & {
  data: {
    gas: number;
    deposit: string;
    method_name: string;
  };
  type: 'FunctionCall';
}

export type AddKey = Action & {
  data: {
    access_key: {
      nonce: number;
      permission: string;
    }
    public_key: string;  
  };
  type: 'AddKey'
}

type TransactionAction = Transfer | FunctionCall | AddKey;

export type NearTransaction = {
  id: number;
  created_at: string;
  updated_at: string;
  time: string;
  height: number;
  hash: string;
  block_hash: string;
  sender: string;
  receiver: string;
  gas_burnt: string;
  actions: TransactionAction[];
  actions_count: number;
  success: boolean;
}

export enum LoadingState {
  Loading = 'loading',
  Error = 'error',
  Success = 'success'
}
