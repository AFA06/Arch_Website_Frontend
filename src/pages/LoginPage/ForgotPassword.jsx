import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendCode = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setCodeSent(true);
        setCooldown(30);
        setMessage(`Код подтверждения был отправлен на ${email}`);
      } else {
        setError(data.message || 'Не удалось отправить код. Повторите попытку.');
      }
    } catch (err) {
      setError('Ошибка сети. Пожалуйста, попробуйте еще раз.');
    }
  };

  const verifyCode = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsCodeValid(true);
        setMessage('Код подтверждён. Теперь вы можете задать новый пароль.');
      } else {
        setError(data.message || 'Неверный код. Попробуйте еще раз.');
      }
    } catch (err) {
      setError('Ошибка сети. Пожалуйста, попробуйте еще раз.');
    }
  };

  const resetPassword = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Пароль успешно восстановлен! Перенаправление на страницу входа...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Ошибка при восстановлении пароля. Повторите попытку.');
      }
    } catch (err) {
      setError('Ошибка сети. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl space-y-5">
        <h2 className="text-2xl font-bold text-center">Забыли пароль?</h2>

        {!codeSent ? (
          <>
            <input
              type="email"
              placeholder="Введите ваш Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-xl"
            />
            <button
              onClick={sendCode}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-xl disabled:opacity-50"
              disabled={cooldown > 0 || !email}
            >
              {cooldown > 0 ? `Отправить повторно через ${cooldown}с` : 'Отправить код подтверждения'}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400 text-center">
              Код был отправлен на <span className="text-yellow-300 font-medium">{email}</span>
            </p>

            {!isCodeValid ? (
              <>
                <input
                  type="text"
                  placeholder="Введите 6-значный код"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-xl"
                />
                <button
                  onClick={verifyCode}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-xl"
                >
                  Подтвердить код
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Введите новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-xl"
                />
                <button
                  onClick={resetPassword}
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-xl"
                >
                  Сбросить пароль
                </button>
              </>
            )}
          </>
        )}

        {message && <p className="text-green-400 text-sm text-center">{message}</p>}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
