import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Ejecuta este script mediante npm run pack:core');
function ejecutar(args, cwd = '.') {
  const resultado = spawnSync(process.execPath, [npm, ...args], { cwd, stdio: 'inherit' });
  if (resultado.status !== 0) process.exit(resultado.status || 1);
}
ejecutar(['run', 'build'], 'packages/frontend-core');
mkdirSync('vendor', { recursive: true });
ejecutar(['pack', './packages/frontend-core', '--pack-destination', 'vendor']);
const { version } = JSON.parse(readFileSync('packages/frontend-core/package.json', 'utf8'));
const archivo = `bysellens-frontend-core-${version}.tgz`;
for (const portal of ['customer', 'inventory', 'product', 'sales', 'shell']) {
  const raiz = `apps/${portal}`;
  mkdirSync(`${raiz}/vendor`, { recursive: true });
  copyFileSync(`vendor/${archivo}`, `${raiz}/vendor/${archivo}`);
  const paquete = JSON.parse(readFileSync(`${raiz}/package.json`, 'utf8'));
  paquete.dependencies['@bysellens/frontend-core'] = `file:vendor/${archivo}`;
  writeFileSync(`${raiz}/package.json`, JSON.stringify(paquete, null, 2));
  ejecutar(['install', '--package-lock-only', '--ignore-scripts'], raiz);
}
const paquete = JSON.parse(readFileSync('package.json', 'utf8'));
paquete.dependencies['@bysellens/frontend-core'] = `file:vendor/${archivo}`;
writeFileSync('package.json', JSON.stringify(paquete, null, 2));
ejecutar(['install', '--ignore-scripts']);
