'use client';

import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: React.ReactNode;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

const toastStore: {
  toasts: Toast[];
  subscribers: Set<(toasts: Toast[]) => void>;
  subscribe: (callback: (toasts: Toast[]) => void) => () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
} = {
  toasts: [],
  subscribers: new Set(),
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  },
  addToast(toast) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    this.toasts = [...this.toasts, newToast]; // Use spread to trigger React updates
    this.subscribers.forEach((callback) => callback(this.toasts));
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, toast.duration || 3000);
    }
  },
  removeToast(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.subscribers.forEach((callback) => callback(this.toasts));
  },
};

export function showToast(
  message: React.ReactNode,
  type: 'success' | 'error' | 'info' = 'success',
  duration: number = 3000
) {
  toastStore.addToast({ message, type, duration });
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch(type) {
      case 'success': return <span className="material-symbols-outlined text-[1.2rem] text-gold">check_circle</span>;
      case 'error': return <span className="material-symbols-outlined text-[1.2rem] text-red-500">error</span>;
      case 'info': return <span className="material-symbols-outlined text-[1.2rem] text-blue-400">info</span>;
      default: return null;
    }
  };

  const getBorderColor = (type: 'success' | 'error' | 'info') => {
    switch(type) {
      case 'success': return 'border-gold/30';
      case 'error': return 'border-red-500/30';
      case 'info': return 'border-blue-400/30';
      default: return 'border-gold/30';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto flex flex-col gap-3 z-[9999] pointer-events-none items-end">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`pointer-events-auto flex items-center gap-3 bg-white/90 dark:bg-[#13110c]/90 backdrop-blur-md border ${getBorderColor(toast.type)} py-2.5 px-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] min-w-[280px] max-w-[400px] animate-slideInToast transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-50 dark:bg-black/20">
            {getIcon(toast.type)}
          </div>
          
          <div className="flex-1 font-jost text-[0.8rem] md:text-[0.85rem] font-medium tracking-wide text-zinc-800 dark:text-[#f0ead6]">
            {toast.message}
          </div>

          <button 
            onClick={() => toastStore.removeToast(toast.id)}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group"
          >
            <span className="material-symbols-outlined text-[1rem] text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-gold transition-colors">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
