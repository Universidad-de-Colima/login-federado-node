import { useState } from 'react';
import type { CrudTableColumnOption } from '@/components/common/CrudTableControls';

export function useColumnVisibility(initial: CrudTableColumnOption[]) {
  const [cols, setCols] = useState(initial);
  const toggle = (key: string, visible: boolean) =>
    setCols((prev) => prev.map((c) => (c.key === key ? { ...c, visible } : c)));
  return { cols, toggle };
}
