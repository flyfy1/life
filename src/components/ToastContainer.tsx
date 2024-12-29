import React from 'react';
import { useNoteContext } from '../context/NoteContext';

const ToastContainer: React.FC = () => {
  const { state, dispatch } = useNoteContext();

  const addToast = (message: string) => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { id, message } });

    setTimeout(() => {
      removeToast(id);
    }, 10000); // 10秒后自动关闭
  };

  const removeToast = (id: number) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };
  console.log("all toasts: ", state.toasts)

  return (
    <div className="toast-container">
      {state.toasts.map((toast) => (
        <div className={`toast ${toast.color || 'default'}`}>
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)}>x</button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
