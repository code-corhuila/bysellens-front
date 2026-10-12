import { rutaInicial } from '../configuracion.js';
import React, { useState } from 'react';

import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  leafOutline,
} from 'ionicons/icons';

import { IonIcon } from '@ionic/react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext.js';

import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    try {
      setCargando(true);

      await login({
        email: email.trim(),
        password,
      });

      navigate(rutaInicial, {
        replace: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('No fue posible iniciar sesión.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">

      {/* =================================================
          DECORACIONES
          ================================================= */}

      <div className="login-bg login-bg-left" />

      <div className="login-bg login-bg-right" />

      {/* =================================================
          TARJETA
          ================================================= */}

      <div className="login-card">

        {/* =================================================
            MARCA
            ================================================= */}

        <div className="login-brand">

          <div className="login-logo">
            BS
          </div>

          <h1>
            BYSELLENS
          </h1>

          <p>
            Panel administrativo
          </p>

          <div className="login-brand-line" />

        </div>

        {/* =================================================
            FORMULARIO
            ================================================= */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* CORREO */}

          <div className="login-field">

            <label htmlFor="email">
              Correo electrónico
            </label>

            <div className="login-input">

              <IonIcon
                icon={mailOutline}
                className="login-field-icon"
              />

              <input
                id="email"
                type="email"
                value={email}
                placeholder="admin@bysellens.com"
                autoComplete="email"
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

            </div>

          </div>

          {/* CONTRASEÑA */}

          <div className="login-field">

            <label htmlFor="password">
              Contraseña
            </label>

            <div className="login-input">

              <IonIcon
                icon={lockClosedOutline}
                className="login-field-icon"
              />

              <input
                id="password"
                type={
                  mostrarPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              <button
                type="button"
                className="login-eye"
                aria-label={
                  mostrarPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
                onClick={() =>
                  setMostrarPassword(
                    (actual) => !actual
                  )
                }
              >
                <IonIcon
                  icon={
                    mostrarPassword
                      ? eyeOffOutline
                      : eyeOutline
                  }
                />
              </button>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* BOTÓN */}

          <button
            type="submit"
            className="login-button"
            disabled={cargando}
          >
            {cargando ? (
              <span className="login-loading">
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar sesión'
            )}
          </button>

        </form>

        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="login-footer">

          <div className="login-footer-decoration">

            <span />

            <IonIcon icon={leafOutline} />

            <span />

          </div>

          <p>
            Acceso exclusivo para administradores
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;