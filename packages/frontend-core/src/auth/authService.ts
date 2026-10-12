import { apiBase, modoMock } from '../configuracion.js';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  email: string;
  rol: string;
}

export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {

  if (modoMock) {
    if (credentials.email !== 'admin@bysellens.com' || credentials.password !== 'demo123') throw new Error('Credenciales de demostraci�n inv�lidas');
    return { accessToken: 'mock-demo', tokenType: 'Bearer', expiresIn: 1800, email: credentials.email, rol: 'ADMIN' };
  }
  const response = await fetch(`${apiBase}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let mensaje = 'No fue posible iniciar sesión';

    try {
      const error = await response.json();

      if (error?.error) {
        mensaje = error.error;
      }
    } catch {
      // Si el backend no devuelve JSON, usamos el mensaje predeterminado.
    }

    throw new Error(mensaje);
  }

  return response.json();
}