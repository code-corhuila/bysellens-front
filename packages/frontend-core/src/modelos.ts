export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
}

export interface ClienteRequest {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  tono: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  imagen: string;
  activo: boolean;
}

export interface ProductoRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  tono: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
}

export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface VentaRequest {
  clienteId: number;
  metodoPago: string;
  detalles: DetalleVentaRequest[];
}

export interface ProductoVenta {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  tono?: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  imagen?: string;
  activo: boolean;
}

export interface ClienteVenta {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
}

export interface DetalleVenta {
  id: number;
  cantidad: number;
  precio: number;
  subtotal: number;
  producto: ProductoVenta;
}

export interface Venta {
  id: number;
  cliente: ClienteVenta;
  detalles: DetalleVenta[];
  fecha: string;
  metodoPago: string;
  total: number;
}