/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const pantallas: Record<string, string> = {
  customer: 'Clientes', inventory: 'Inventario', product: 'Productos', sales: 'Ventas', shell: 'Home',
};

// ===== AISLAMIENTO DEL CÓDIGO DE CADA APLICACIÓN =====
function verificarAislamiento(portal: string): Plugin {
  return {

    name: 'verificar-aislamiento',
    generateBundle(_opciones, archivos) {
      const modulos = [...new Set(Object.values(archivos).flatMap(archivo =>
        archivo.type === 'chunk' ? Object.keys(archivo.modules) : [],
      ))].map(id => id.replace(/\\/g, '/').split('?')[0])
        .filter(id => !id.includes('/node_modules/') && /\/(apps|shared|src)\//.test(id))
        .map(id => {
          const coincidencia = id.match(/\/(apps|shared|src)\/.*$/);
          return coincidencia ? coincidencia[0].slice(1) : id;
        }).sort();
      if (portal !== 'monolito') {
        const ajenos = modulos.filter(id =>
          id.startsWith('src/') || (id.startsWith('apps/') &&
            !id.startsWith(`apps/${portal}/`) &&
            !/^apps\/shell\/src\/pages\/Login\.(tsx|css)$/.test(id)),
        );
        if (ajenos.length) this.error(`Módulos ajenos al portal ${portal}: ${ajenos.join(', ')}`);
        const pantalla = `apps/${portal}/src/pages/${pantallas[portal]}.tsx`;
        if (!modulos.includes(pantalla)) this.error(`Falta la pantalla del portal: ${pantalla}`);
      }
      this.emitFile({ type: 'asset', fileName: 'modulos.json', source: JSON.stringify({ portal, modulos }, null, 2) });
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  const portal = env.VITE_PORTAL || 'monolito';
  if (portal !== 'monolito' && !pantallas[portal]) throw new Error('Portal desconocido');
  return {
  resolve: { dedupe: ['react', 'react-dom', '@bysellens/frontend-core'] },
  base: portal === 'monolito' || command === 'serve' ? '/' : `/mfe/${portal}/`,
  server: {
    port: ({ shell: 5173, customer: 5174, inventory: 5175, product: 5176, sales: 5177 } as Record<string, number>)[portal] || 5173,
    strictPort: true,
  },
  build: { outDir: portal === 'monolito' ? 'dist' : `dist/${portal}` },
  plugins: [
    react(),
    {
      name: 'entrada-por-aplicacion',
      transformIndexHtml: {
        order: 'pre',
        handler: html => portal === 'monolito' ? html : html.replace('/src/main.tsx', `/apps/${portal}/src/main.tsx`),
      },
    },
    verificarAislamiento(portal),
  ],

  test: {
    server: { deps: { inline: ['@bysellens/frontend-core'] } },
    globals: true,
    environment: 'jsdom',
    setupFiles: './packages/frontend-core/testing/setupTests.ts',
    include: ['apps/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}', 'packages/frontend-core/tests/**/*.test.{ts,tsx}'],
  }
}; });
