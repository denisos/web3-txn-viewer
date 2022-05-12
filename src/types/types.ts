
export enum ActionType {
  FunctionCall = 'FunctionCall',
  Transfer = 'Transfer',
  AddKey = 'AddKey'
}

export type Action = {
  data: {
    gas?: number;
    deposit: string;
    method_name?: string;    
  }
  type: ActionType,
}

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
  actions: Action[];
  actions_count: number;
  success: boolean;
}