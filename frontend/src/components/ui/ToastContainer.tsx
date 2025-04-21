import React, { useState, useEffect } from 'react';
import Toast from './Toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  useEffect(() => {
    // Listen for toast events
    const handleToast = (event: CustomEvent<ToastMessage>) => {
      const { id, type, message, duration } = event.detail;
      setToasts((prevToasts) => [...prevToasts, { id, type, message, duration }]);
    };
    
    window.addEventListener('toast' as any, handleToast as EventListener);
    
    return () => {
      window.removeEventListener('toast' as any, handleToast as EventListener);
    };
  }, []);
  
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };
  
  return (
    <div
      className={`fixed z-50 p-4 space-y-4 w-full max-w-sm ${positionClasses[position]}`}
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

// Helper function to show toasts
export const showToast = (
  type: ToastType,
  message: string,
  duration?: number
) => {
  const id = Math.random().toString(36).substring(2, 9);
  const event = new CustomEvent('toast', {
    detail: { id, type, message, duration },
  });
  window.dispatchEvent(event);
};
