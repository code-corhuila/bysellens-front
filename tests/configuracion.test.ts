import { expect, it } from 'vitest';
import api from '@bysellens/frontend-core/api';
import { configurarFrontend } from '@bysellens/frontend-core/configuracion';
it('aplica la URL REAL del consumidor aunque el cliente HTTP se haya importado antes', async () => {
  configurarFrontend({ modo: 'real', apiBase: 'http://api.example.com', portal: 'sales' });
  const respuesta = await api.get('/api/ventas', { adapter: async config => ({ data: config.baseURL, status: 200, statusText: 'OK', headers: {}, config }) });
  expect(respuesta.data).toBe('http://api.example.com');
});
