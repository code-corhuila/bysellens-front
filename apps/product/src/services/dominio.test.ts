import { beforeEach, expect, it } from 'vitest';
import { configurarFrontend } from '@bysellens/frontend-core/configuracion';
import { obtenerProductos, actualizarStock } from './productoService';
beforeEach(() => { localStorage.clear(); configurarFrontend({ modo: 'mock', apiBase: '', portal: 'product' }); });
it('ajusta stock y rechaza cantidades negativas', async () => {
  await actualizarStock(1, 8);
  await expect(actualizarStock(1, -1)).rejects.toThrow();
  expect((await obtenerProductos())[0].stock).toBe(8);
});
