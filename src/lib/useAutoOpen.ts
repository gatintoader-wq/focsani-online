import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useAutoOpen(): [boolean, (value: boolean) => void] {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(() => params.get('nou') === '1');

  useEffect(() => {
    if (params.get('nou')) setParams({}, { replace: true });
  }, [params, setParams]);

  return [open, setOpen];
}
