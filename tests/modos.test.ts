import { configurarFrontend } from '@bysellens/frontend-core/configuracion';
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
it('MOCK inicia sesión sin HTTP y rechaza credenciales inválidas', async () => {
  configurarFrontend({ modo: 'mock', apiBase: 'http://localhost:8080', portal: 'shell' });
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  const { login } = await import('@bysellens/frontend-core/auth/authService');
  expect((await login({ email: 'admin@bysellens.com', password: 'demo123' })).rol).toBe('ADMIN');
  await expect(login({ email: 'otro@example.com', password: 'x' })).rejects.toThrow();
  expect(fetch).not.toHaveBeenCalled();
});
it('REAL conserva el contrato HTTP y permite configurar la URL', async () => {
  configurarFrontend({ modo: 'real', apiBase: 'http://api.example.com', portal: 'shell' });
  vi.stubEnv('VITE_API_BASE_URL', 'http://api.example.com');
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ accessToken: 'real' }) });
  vi.stubGlobal('fetch', fetch);
  const { login } = await import('@bysellens/frontend-core/auth/authService');
  await login({ email: 'admin@example.com', password: 'clave' });
  expect(fetch).toHaveBeenCalledWith('http://api.example.com/api/v1/auth/login', expect.objectContaining({ method: 'POST' }));
});
