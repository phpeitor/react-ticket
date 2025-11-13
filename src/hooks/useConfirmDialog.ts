import { useState, useCallback } from 'react';
export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const ask = useCallback((m: string, cb: () => void) => { setMessage(m); setOnConfirm(() => cb); setOpen(true); }, []);
  const confirm = useCallback(() => { onConfirm?.(); setOpen(false); }, [onConfirm]);
  const cancel = useCallback(() => setOpen(false), []);
  return { open, message, ask, confirm, cancel };
}
