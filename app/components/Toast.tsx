'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-300',
    error: 'bg-gradient-to-r from-red-500 to-rose-500 border-red-300',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-300'
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`${styles} text-white px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 backdrop-blur-sm`}>
        <span className="text-xl font-bold">{icon}</span>
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center transition-all ml-2"
        >
          ×
        </button>
      </div>
    </div>
  );
}
