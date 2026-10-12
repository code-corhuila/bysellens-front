export interface ConfiguracionFrontend {
  modo: 'mock' | 'real';
  apiBase: string;
  portal: string;
}
export let modoMock = false;
export let apiBase = 'http://localhost:8080';
export let portal = 'monolito';
export const rutasPortal: Record<string, string> = {
  customer: '/clientes', inventory: '/inventario', product: '/productos', sales: '/ventas',
};
export let rutaInicial = '/productos';
export function configurarFrontend(configuracion: ConfiguracionFrontend) {
  modoMock = configuracion.modo === 'mock';
  apiBase = configuracion.apiBase;
  portal = configuracion.portal;
  rutaInicial = rutasPortal[portal] || '/productos';
}
export const imagenProducto = (nombre: string) => nombre.startsWith('data:')
  ? nombre : `${apiBase}/uploads/productos/${nombre}`;
