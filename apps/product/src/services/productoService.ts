import api from '@bysellens/frontend-core/api';
import { modoMock } from '@bysellens/frontend-core/configuracion';
import { leer, guardar, buscar, fallo } from '@bysellens/frontend-core/mock';
import type { Producto } from '@bysellens/frontend-core/modelos';
export type { Producto } from '@bysellens/frontend-core/modelos';
export const obtenerProductos = async (): Promise<Producto[]> => modoMock ? leer().productos.filter(p => p.activo) : (await api.get<Producto[]>('/api/productos')).data;
export const actualizarStock = async (id: number, nuevoStock: number): Promise<Producto> => {
  if (modoMock) {
    if (nuevoStock < 0 || !Number.isInteger(nuevoStock)) fallo('Precio o stock inválido');
    const datos = leer(); const producto = buscar(datos.productos, id);
    producto.stock = nuevoStock; guardar(datos); return producto;
  }
  const producto = (await api.get<Producto>(`/api/productos/${id}`)).data;
  const datos = { codigo: producto.codigo, nombre: producto.nombre, descripcion: producto.descripcion,
    categoria: producto.categoria, tono: producto.tono, precioCompra: Number(producto.precioCompra),
    precioVenta: Number(producto.precioVenta), stockMinimo: Number(producto.stockMinimo), activo: producto.activo };
  const formulario = new FormData();
  formulario.append('producto', new Blob([JSON.stringify({ ...datos, stock: nuevoStock })], { type: 'application/json' }));
  return (await api.put<Producto>(`/api/productos/${id}`, formulario)).data;
};
