import React from 'react';
import { useNoteContext } from '../context/NoteContext';
import { ApiService } from '../services/api';
import { useTranslation } from 'react-i18next';

const Login: React.FC<{successCallback: ()=>void }> = ({successCallback}) => {
  const { state, dispatch } = useNoteContext();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await ApiService.login({ username: state.username, password: state.password });
      if (response.error) {
        throw(response.error);
      }
      localStorage.setItem('token', response.token);
      dispatch({ type: 'LOGIN' });
      dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: t('login.succeeded'), color: "green" } });

      successCallback();
    } catch (error) {
      console.error('登录失败:', error);
      dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: t('login.failed'), color: "red" } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-gray-800 text-2xl mb-5">{t('login')}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder={t('username')}
            value={state.username}
            onChange={(e) => dispatch({ type: 'SET_USERNAME', payload: e.target.value })}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder={t('password')}
            value={state.password}
            onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {t('action.login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
