import { useCallback, useState, useEffect } from 'react';

export interface UseIteratorResponse<T> {
  current: T | null;
  next: () => void;
  prev: () => void;
  isFirst: () => boolean;
  isLast: () => boolean;
  isEmpty: () => boolean;
}

export default function useIterator<T>(srcList: T[] = []): UseIteratorResponse<T> {
  const [ current, setCurrent ] = useState<T | null>(null)
  const [ index, setIndex ] = useState(0);

  const isEmpty = useCallback(() => srcList.length === 0, [srcList]);
  const isFirst = () => isEmpty() || index === 0;
  const isLast = () => isEmpty() || index === srcList.length - 1;

  useEffect(() => {
    // console.log("useEffect updating current ", isEmpty(), index, srcList.length)

    if (!isEmpty()) {
      setCurrent(srcList[index]);
    }
  }, [index, srcList, isEmpty]);

  const next = useCallback(() => {
    if (index >= srcList.length) {
      return null;
    }
    // console.log(`next index: ${index} list length ${srcList.length}`)
    setIndex(prev => prev + 1);
  }, [srcList, index]);

  const prev = useCallback(() => {
    if (index === 0) return null;
    setIndex(prev => prev - 1);
  }, [index]);


  return {
    current,
    next,
    prev,
    isFirst,
    isLast,
    isEmpty
  }
}
