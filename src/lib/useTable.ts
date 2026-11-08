import { useEffect, useState } from 'react';
import { readTable, subscribeTable, type TableName } from '@/lib/localDb';

export function useTable<T>(table: TableName): T[] {
  const [rows, setRows] = useState<T[]>(() => readTable<T>(table));

  useEffect(() => {
    setRows(readTable<T>(table));
    return subscribeTable(table, () => setRows(readTable<T>(table)));
  }, [table]);

  return rows;
}
