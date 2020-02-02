import { useState, useEffect, useCallback, RefObject } from 'react';

export const useInfiniteScroll = ({
  ref,
  hasMore,
  onLoadMore,
}: {
  onLoadMore: Function;
  hasMore: boolean;
  ref: RefObject<HTMLElement>;
}) : [boolean, () => void] => {
  const [isFetching, setIsFetching] = useState(false);
  const handleScroll = useCallback(() => {
    if (ref.current!.scrollTop === 0 && isFetching === false && hasMore){
      setIsFetching(true);
    }
  }, [ref, isFetching, hasMore]);

  useEffect(() => {
    const elem = ref.current;

    if(!elem) {
      return;
    }

    elem.addEventListener('scroll',handleScroll);

    return () => {
      elem!.removeEventListener('scroll', handleScroll);
    };
  }, [ref, handleScroll]);

  useEffect(() => {
    if(isFetching){
      onLoadMore();
    }
  }, [isFetching, onLoadMore]);

  const stopFetching = useCallback(() => {
    setIsFetching(false);
  },[]);

  return [isFetching, stopFetching];
};


export default useInfiniteScroll;