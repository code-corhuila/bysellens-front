import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  login as loginRequest,
  type LoginRequest,
  type LoginResponse,
} from './authService.js';

interface AuthContextType {
  accessToken: string | null;
  usuario: LoginResponse | null;
  autenticado: boolean;
  login: (
    credentials: LoginRequest
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'bysellens_access_token';
const USER_KEY = 'bysellens_usuario';

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [usuario, setUsuario] =
    useState<LoginResponse | null>(null);

  /*
   * Recuperar la sesión después de recargar
   */
  useEffect(() => {
    const tokenGuardado =
      sessionStorage.getItem(TOKEN_KEY);

    const usuarioGuardado =
      sessionStorage.getItem(USER_KEY);

    if (tokenGuardado) {
      setAccessToken(tokenGuardado);
    }

    if (usuarioGuardado) {
      try {
        const usuarioParseado =
          JSON.parse(usuarioGuardado) as LoginResponse;

        setUsuario(usuarioParseado);
      } catch {
        sessionStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  /*
   * Login
   */
  const login = async (
    credentials: LoginRequest
  ) => {

    const response =
      await loginRequest(credentials);

    /*
     * Estado de React
     */
    setAccessToken(
      response.accessToken
    );

    setUsuario(response);

    /*
     * Sesión del navegador
     *
     * Sobrevive a F5.
     */
    sessionStorage.setItem(
      TOKEN_KEY,
      response.accessToken
    );

    sessionStorage.setItem(
      USER_KEY,
      JSON.stringify(response)
    );
  };

  /*
   * Logout
   */
  const logout = () => {

    /*
     * Limpiar React
     */
    setAccessToken(null);
    setUsuario(null);

    /*
     * Limpiar sesión guardada
     */
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const value: AuthContextType = {
    accessToken,
    usuario,
    autenticado:
      accessToken !== null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe utilizarse dentro de un AuthProvider'
    );
  }

  return context;
}