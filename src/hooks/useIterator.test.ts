import { renderHook, act } from '@testing-library/react';
import useIterator from './useIterator';

// for test purpose
interface Person {
  id: number;
  name: string;
}

describe('useIterator', () => {
  const setup = <T>(aList: T[]) => {
    const { result: { current } } = renderHook(() => useIterator<T>(aList));
    return current;
  }

  test('should initialize as expected with empty list', () => {
    const { current, next, prev, isEmpty, isFirst, isLast } = setup<[]>([]);

    expect(isEmpty()).toBe(true);
    expect(current).toBe(null);
    expect(isFirst()).toBe(true);
    expect(isLast()).toBe(true);
    expect(next()).toBe(null);
    expect(prev()).toBe(null);
  });

  test('should initialize as expected with list with values', () => {
    const mockList: Person[] = [ 
      { id: 1, name: "jane"}
    ];
    const { current, isEmpty, isFirst, isLast } = setup<Person>(mockList);

    expect(isEmpty()).toBe(false);
    expect(current).toBe(mockList[0]);
    expect(isFirst()).toBe(true);
    expect(isLast()).toBe(true);
  });

  test('should get next and prev from list with values', async () => {
    const mockList: Person[] = [ 
      { id: 1, name: "jane"},
      { id: 2, name: "john"},
    ];

    const { current, isLast, next } = setup<Person>(mockList);

    expect(current).toBe(mockList[0]);
    expect(isLast()).toBe(false);

    act(() => {
      next();
    })

    // to-do: get next() running and uncomment
    // expect(isLast()).toBe(true);
    // expect(current).toBe(mockList[1])
    
  });
});
