import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('El correo electrónico no es válido.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      const lastRoute = localStorage.getItem("lastRoute") || "/dashboard";
      localStorage.removeItem("lastRoute");
      navigate(lastRoute);
    } catch (err) {
      const fallback = err?.message || err?.error || 'Error inesperado al iniciar sesión';
      setErrorMessage(fallback);
      console.error('Login error:', err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>🔐 Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />

        <div className={styles.inputGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <span
            className={styles.toggleIcon}
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit" disabled={loading} className={styles.buttonPrimary}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>
      </form>

      {errorMessage && (
        <p className={styles.errorMessage}>❌ {errorMessage}</p>
      )}
    </div>
  );
}