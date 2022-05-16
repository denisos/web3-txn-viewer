import { 
  filterSuccessfulTransfers, 
  isSuccessfulTransaction, 
  isTransferTransaction,
  compareDatesAsc,
  compareTransactionTimesAsc,
  scaleToFactor,
  scaleDepositAsNear
} from './utils'
import { NearTransaction } from '../types/types';

const mockFunctionCallTransaction: NearTransaction = {
  id: 208851,
  created_at: "2021-01-11T10:20:13.70879-06:00",
  updated_at: "2021-01-11T10:20:13.70879-06:00",
  time: "2021-01-11T10:20:04.132926-06:00",
  height: 27326763,
  hash: "6RtU9UkAQaJBVMrgvtDiARxzbhx1vKrwoTv4aZRxxgt7",
  block_hash: "FrWmh1BtBc8yvAZPJrJ97nVth6eryukbLANyFQ3TuQai",
  sender: "86e6ebcc723106eee951c344825b91a80b46f42ff8b1f4bd366f2ac72fab99d1",
  receiver: "d73888a2619c7761735f23c798536145dfa87f9306b5f21275eb4b1a7ba971b9",
  gas_burnt: "424555062500",
  actions: [
    {
      data: {
        deposit: "716669915088987500000000000",
        gas: 1000000000000,
        method_name: "ping"
      },
      type: "FunctionCall"
    }
  ],
  actions_count: 1,
  success: true
};

test('should return false from isSuccessfulTransaction when transaction success is false', () => {
  mockFunctionCallTransaction.success = false;
  expect(isSuccessfulTransaction(mockFunctionCallTransaction)).toBe(false);
});

test('should return true from isSuccessfulTransaction when transaction success is true', () => {
  mockFunctionCallTransaction.success = true;
  expect(isSuccessfulTransaction(mockFunctionCallTransaction)).toBe(true);
});

test('should return false from isTransferTransaction when transaction is not a Transfer', () => {
  mockFunctionCallTransaction.success = true;
  expect(isTransferTransaction(mockFunctionCallTransaction)).toBe(false);
});

test('should return true from isTransferTransaction when transaction is a Transfer', () => {
  mockFunctionCallTransaction.actions[0].type = 'Transfer';
  expect(isTransferTransaction(mockFunctionCallTransaction)).toBe(true);
});

describe('filterSuccessfulTransfers', () => {

  test('should return false when transaction is null', () => {
    // cast to any to get around ts type errors
    expect(filterSuccessfulTransfers(undefined as any)).toBe(false);
  });

  test('should return false when transaction success is false', () => {
    const mockTransaction = {
      success: false
    };
    expect(filterSuccessfulTransfers(mockTransaction as any)).toBe(false);
  });

  test('should return false when transaction success is true but action type is not transaction', () => {
    const mockTransaction: NearTransaction = {
      id: 208851,
      created_at: "2021-01-11T10:20:13.70879-06:00",
      updated_at: "2021-01-11T10:20:13.70879-06:00",
      time: "2021-01-11T10:20:04.132926-06:00",
      height: 27326763,
      hash: "6RtU9UkAQaJBVMrgvtDiARxzbhx1vKrwoTv4aZRxxgt7",
      block_hash: "FrWmh1BtBc8yvAZPJrJ97nVth6eryukbLANyFQ3TuQai",
      sender: "86e6ebcc723106eee951c344825b91a80b46f42ff8b1f4bd366f2ac72fab99d1",
      receiver: "d73888a2619c7761735f23c798536145dfa87f9306b5f21275eb4b1a7ba971b9",
      gas_burnt: "424555062500",
      actions: [
        {
          data: {
            deposit: "716669915088987500000000000",
            gas: 1000000000000,
            method_name: "ping"
          },
          type: "FunctionCall"
        }
      ],
      actions_count: 1,
      success: true
    };

    expect(filterSuccessfulTransfers(mockTransaction)).toBe(false);
  });

  test('should return true when transaction success is true and action type is Transfer', () => {
    const mockTransaction: NearTransaction = {
      id: 208851,
      created_at: "2021-01-11T10:20:13.70879-06:00",
      updated_at: "2021-01-11T10:20:13.70879-06:00",
      time: "2021-01-11T10:20:04.132926-06:00",
      height: 27326763,
      hash: "6RtU9UkAQaJBVMrgvtDiARxzbhx1vKrwoTv4aZRxxgt7",
      block_hash: "FrWmh1BtBc8yvAZPJrJ97nVth6eryukbLANyFQ3TuQai",
      sender: "86e6ebcc723106eee951c344825b91a80b46f42ff8b1f4bd366f2ac72fab99d1",
      receiver: "d73888a2619c7761735f23c798536145dfa87f9306b5f21275eb4b1a7ba971b9",
      gas_burnt: "424555062500",
      actions: [
        {
          data: {
            deposit: "716669915088987500000000000"
          },
          type: "Transfer"
        }
      ],
      actions_count: 1,
      success: true
    };

    expect(filterSuccessfulTransfers(mockTransaction)).toBe(true);
  });

});

describe('compareTransactionTimes', () => {
  test('should return 1000 when A is older than B', () => {
    expect(compareDatesAsc('2021-01-11T08:44:57.903-06:00', 
      '2021-01-11T08:44:56.903-06:00')).toBe(1000);
  });



  test('should return A then B when A is older', () => {
    // create a list with newest first
    const mockOlderTransaction = {
      ...mockFunctionCallTransaction, 
      time: "2021-01-11T10:20:02.132926-06:00",
      id: 208850
    };
    const list = [mockFunctionCallTransaction, mockOlderTransaction];

    const sortedAscList = list.sort(compareTransactionTimesAsc);
    
    // after sort, oldest is now first in the resulting list
    expect(sortedAscList[0].id).toBe(mockOlderTransaction.id);
    expect(sortedAscList[1].id).toBe(mockFunctionCallTransaction.id);
  });
});


describe('scaleToFactor', () => {
  test('should return as expected when scale to 24 and passed string', () => {              
    expect(scaleToFactor('716669915088987500000000000')).toBe('716.6699150889875');
  });

  test('should return as expected when scale to 24 and passed number', () => {
    expect(scaleToFactor('716669915088987512345677899')).toBe('716.66991508898751234568');
  });

  test('should return as expected when scale to 24', () => {
    expect(scaleToFactor('1100000000000000000000000', 24)).toBe('1.1');
  });

  test('should return as expected when scale to 24 when passed 0', () => {
    expect(scaleToFactor('0', 24)).toBe('0');
  });
});

test('should scaleDepositAsNear return as scaled NEAR', () => {
  expect(scaleDepositAsNear('716669915088987500000000000')).toBe('716.6699150889875 NEAR');
});
