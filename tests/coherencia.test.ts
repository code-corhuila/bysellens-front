import { beforeEach, expect, it } from 'vitest';
import { configurarFrontend } from '@bysellens/frontend-core/configuracion';
import { crearCliente } from '../apps/customer/src/services/clienteService';
import { actualizarProducto } from '../apps/inventory/src/services/productoService';
import { actualizarStock, obtenerProductos } from '../apps/product/src/services/productoService';
import { crearVenta } from '../apps/sales/src/services/ventaService';
import { obtenerClientes } from '../apps/sales/src/services/catalogoService';

beforeEach(() => {
  localStorage.clear();
  configurarFrontend({ modo: 'mock', apiBase: 'http://localhost:8080', portal: 'monolito' });
});
it('comparte clientes, catálogo, ventas y stock entre adaptadores de los cuatro dominios', async () => {
  const cliente = await crearCliente({ nombre: 'Cliente integrado', telefono: '3001234567', email: 'integrado@example.com', direccion: 'Calle 1', activo: true });
  expect((await obtenerClientes()).some(c => c.id === cliente.id)).toBe(true);
  const producto = (await obtenerProductos())[0];
  await actualizarProducto(1, { ...producto, precioVenta: 20000 });
  await actualizarStock(1, 10);
  const venta = await crearVenta({ clienteId: cliente.id, metodoPago: 'EFECTIVO', detalles: [{ productoId: 1, cantidad: 3 }] });
  expect(venta.total).toBe(60000);
  expect((await obtenerProductos())[0].stock).toBe(7);
  await expect(actualizarStock(1, -1)).rejects.toThrow();
  expect((await obtenerProductos())[0].stock).toBe(7);
});
