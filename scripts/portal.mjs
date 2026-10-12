import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const [accion = 'build', portal = 'shell'] = process.argv.slice(2);
if (!['shell', 'customer', 'inventory', 'product', 'sales'].includes(portal) || !['build', 'dev'].includes(accion)) {
  throw new Error('Uso: node scripts/portal.mjs build|dev shell|customer|inventory|product|sales');
}
const env = { ...process.env, VITE_PORTAL: portal, VITE_DATA_MODE: process.env.VITE_DATA_MODE || 'mock' };
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Ejecuta este script mediante npm run build:portal o npm run dev:portal');
const cwd = fileURLToPath(new URL(`../apps/${portal}/`, import.meta.url));
const resultado = spawnSync(process.execPath, [npm, 'run', accion, ...(accion === 'dev' ? ['--', '--host', '0.0.0.0'] : [])], { cwd, stdio: 'inherit', env });
process.exit(resultado.status || 0);
