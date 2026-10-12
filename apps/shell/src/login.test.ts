import { expect, it } from 'vitest';
import { configurarFrontend } from '@bysellens/frontend-core/configuracion';
import { login } from '@bysellens/frontend-core/auth/authService';
it('consume la autenticación del paquete con las credenciales existentes', async () => {
  configurarFrontend({ modo: 'mock', apiBase: '', portal: 'shell' });
  expect((await login({ email: 'admin@bysellens.com', password: 'demo123' })).accessToken).toBe('mock-demo');
});
