import { readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
function copiar(ruta) {
  for (const archivo of readdirSync(ruta, { withFileTypes: true })) {
    const origen = join(ruta, archivo.name);
    if (archivo.isDirectory()) copiar(origen);
    else if (origen.endsWith('.css')) {
      const destino = origen.replace(/^src/, 'dist');
      mkdirSync(dirname(destino), { recursive: true }); copyFileSync(origen, destino);
    }
  }
}
copiar('src');
