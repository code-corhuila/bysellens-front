import { beforeEach, describe, expect, it } from 'vitest';
import { mockClientes } from '../apps/customer/src/services/mock';
import { mockProductos } from '../apps/inventory/src/services/mock';
import { mockVentas } from '../apps/sales/src/services/mock';

beforeEach(() => localStorage.clear());
describe('Operaciones coherentes de demostración', () => {
  it('conserva clientes creados y editados y permite eliminarlos', async () => {
    const cliente = await mockClientes.guardar({ nombre: 'Demo', telefono: '300', email: 'demo@example.com', direccion: 'Calle 1', activo: true });
    await mockClientes.guardar({ ...cliente, nombre: 'Editado' }, cliente.id);
    expect((await mockClientes.obtener(cliente.id)).nombre).toBe('Editado');
    await mockClientes.eliminar(cliente.id);
    expect(await mockClientes.listar()).toHaveLength(1);
  });
  it('calcula ventas con precios del catálogo y descuenta stock', async () => {
    const venta = await mockVentas.crear({ clienteId: 1, metodoPago: 'EFECTIVO', detalles: [{ productoId: 1, cantidad: 2 }] });
    expect(venta.total).toBe(36000);
    expect((await mockProductos.obtener(1)).stock).toBe(18);
    expect(await mockVentas.listar()).toHaveLength(2);
  });
  it('rechaza stock insuficiente incluso con líneas repetidas sin cambios parciales', async () => {
    await expect(mockVentas.crear({ clienteId: 1, metodoPago: 'EFECTIVO', detalles: [{ productoId: 1, cantidad: 15 }, { productoId: 1, cantidad: 15 }] })).rejects.toThrow('Stock insuficiente');
    expect((await mockProductos.obtener(1)).stock).toBe(20);
    expect(await mockVentas.listar()).toHaveLength(1);
  });
  it('desactiva productos y protege el precio mínimo', async () => {
    const producto = await mockProductos.obtener(1);
    await expect(mockProductos.guardar({ ...producto, precioVenta: 1 }, null, 1)).rejects.toThrow();
    await mockProductos.eliminar(1);
    expect(await mockProductos.listar()).toHaveLength(0);
  });
});
