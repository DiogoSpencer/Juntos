import { useRef, useEffect } from 'react';
/*
Custom hook to know if component was mounted
*/
export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};