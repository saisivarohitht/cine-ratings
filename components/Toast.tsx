'use client';

import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleAddToast = (event: CustomEvent<Toast>) => {
      const newToast = event.detail;
      setToasts((prev) => [...prev, newToast]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener('addToast', handleAddToast as EventListener);
    return () => window.removeEventListener('addToast', handleAddToast as EventListener);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 text-sm font-medium pointer-events-auto ${
            toast.type === 'success'
              ? 'bg-green-500/20 border border-green-500/40 text-green-300'
              : toast.type === 'error'
              ? 'bg-red-500/20 border border-red-500/40 text-red-300'
              : 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function showToast(message: string, type: ToastType = 'info') {
  const event = new CustomEvent('addToast', {
    detail: {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
    },
  });
  window.dispatchEvent(event);
}
