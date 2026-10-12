import type { Cliente, Producto, Venta } from '../modelos.js';
export const clave = 'bysellens_mock_v1';
export interface Datos { clientes: Cliente[]; productos: Producto[]; ventas: Venta[] }
export const inicial = (): Datos => {
  const cliente: Cliente = { id: 1, nombre: 'Ana Demo', telefono: '3001234567', email: 'ana@example.com', direccion: 'Calle 10 # 5-20', activo: true };
  const producto: Producto = { id: 1, codigo: 'LAB001', nombre: 'Labial rosa', descripcion: 'Labial de demostración', categoria: 'Labiales', tono: 'Rosa', precioCompra: 10000, precioVenta: 18000, stock: 20, stockMinimo: 5, imagen: '', activo: true };
  return { clientes: [cliente], productos: [producto], ventas: [{ id: 1, cliente: { ...cliente }, detalles: [{ id: 1, producto: { ...producto }, cantidad: 1, precio: 18000, subtotal: 18000 }], fecha: '2026-10-01T15:00:00.000Z', metodoPago: 'EFECTIVO', total: 18000 }] };
};
export const leer = (): Datos => JSON.parse(localStorage.getItem(clave) || JSON.stringify(inicial()));
export const guardar = (datos: Datos) => localStorage.setItem(clave, JSON.stringify(datos));
export const siguiente = (filas: { id: number }[]) => Math.max(0, ...filas.map(fila => fila.id)) + 1;
export const fallo = (mensaje: string): never => { throw Object.assign(new Error(mensaje), { response: { data: { error: mensaje, mensaje } } }); };
export const buscar = <T extends { id: number }>(filas: T[], id: number): T => filas.find(fila => fila.id === id) || fallo('Registro no encontrado');

