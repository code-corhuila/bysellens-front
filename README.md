# By_Sellens — frontend completo

Sistema interno de administración de una tienda de maquillaje. Esta entrega conserva el frontend del workspace local: React 19, Ionic React 9, TypeScript y Vite, con cinco aplicaciones y ejecución MOCK sin backend.

## Estructura

- apps/shell/: entrada, login y navegación hacia los portales.
- apps/customer/: listado, búsqueda, registro, edición y eliminación de clientes.
- apps/inventory/: consulta y gestión del inventario.
- apps/product/: catálogo y gestión de productos.
- apps/sales/: listado y registro de ventas, selección de cliente/productos y actualización de stock MOCK.
- packages/frontend-core/: fuentes de autenticación, sesión, modelos, API, runtime, estilos y almacén MOCK compartidos.
- vendor/ y apps/*/vendor/: paquete instalable frontend-core 1.0.0.
- src/: entrada conjunta conservada del proyecto local.
- scripts/: ejecución de aplicaciones y empaquetado del core.
- tests/ y cypress/: pruebas de configuración, dominios, coherencia entre portales y navegación.
- docker/ y apps/*/docker/: configuración Nginx.
- compose.yaml: cinco servicios frontend, sin backend ni base de datos.

La carpeta shared/ del origen está vacía; Git no versiona directorios vacíos. El código común efectivo está en frontend-core.

## Requisitos e instalación

Node.js 22 y npm; Docker Desktop con motor Linux y Docker Compose para la ejecución integrada. No se incluyen node_modules ni builds.

Desde la raíz:

```powershell
npm ci
foreach ($portal in 'shell','customer','inventory','product','sales') {
  npm ci --prefix "apps/$portal"
}
```

Cada aplicación tiene su propio package.json, package-lock.json y dependencia local file:vendor/bysellens-frontend-core-1.0.0.tgz. Las seis copias del paquete son necesarias para instalar la raíz y cada aplicación con sus rutas actuales, sin depender del frontend original. No requieren un registro npm privado. Las fuentes del paquete también están incluidas.

## Ejecutar aplicaciones

En una terminal por aplicación:

```sh
npm run dev:portal -- shell
npm run dev:portal -- customer
npm run dev:portal -- inventory
npm run dev:portal -- product
npm run dev:portal -- sales
```

| Aplicación | Puerto | Ruta |
| --- | --- | --- |
| Shell | 5173 | /login |
| Customer | 5174 | /clientes |
| Inventory | 5175 | /inventario |
| Product | 5176 | /productos |
| Sales | 5177 | /ventas |

Los comandos dev:portal activan MOCK por defecto. Las aplicaciones se pueden abrir individualmente. La navegación integrada mediante proxy del Shell se ejecuta con Docker; el servidor Vite del Shell no incluye el proxy Nginx.

La entrada conjunta local también se conserva; para ejecutarla en MOCK:

```powershell
$env:VITE_DATA_MODE = 'mock'
npm run dev
```

Usa el puerto 5173: no iniciar simultáneamente con el Shell en ese puerto.

## Docker integrado

```sh
docker compose up --build -d
docker compose ps
```

Abrir http://localhost:5173. El Shell sirve las rutas de los cuatro portales mediante Nginx y conserva el mismo origen para sesión y datos MOCK. Los portales también están publicados en los puertos 5174–5177. Cada servicio expone /health y un healthcheck. DATA_MODE es mock por defecto; no se necesita backend. No se incluyen servicios de PostgreSQL, RabbitMQ ni migraciones.

Para detener esta composición sin borrar volúmenes:

```sh
docker compose down
```

## MOCK y sesión

Credenciales de demostración: admin@bysellens.com / demo123.

El core conserva los datos simulados en localStorage con la clave bysellens_mock_v1 y la sesión en sessionStorage. Los servicios reutilizan ese almacén para clientes, productos, inventario y ventas. El almacenamiento del navegador se separa por origen: al entrar por los diferentes puertos, los datos no se comparten entre esos orígenes. La entrada integrada del Shell mantiene un origen común.

VITE_DATA_MODE controla mock/real y VITE_API_BASE_URL configura la URL de API; Docker usa DATA_MODE y API_BASE_URL como argumentos. Esta entrega valida exclusivamente MOCK. El backend REAL y su integración no están validados.

## Calidad y pruebas

```sh
npm exec -- tsc --noEmit
npm run build
npm run lint
npm run test.unit -- --run
npm run build:core
```

Para cada aplicación, sustituir customer por el portal:

```sh
npm run build --prefix apps/customer
npm run lint --prefix apps/customer
npm run test.unit --prefix apps/customer
```

Con los cinco contenedores disponibles en sus puertos:

```sh
npm run test.e2e
```

Cypress comprueba navegación y sesión, registro de clientes, acceso independiente a los portales y una venta cuyo stock se consulta desde Productos. Las pruebas existentes no constituyen cobertura exhaustiva de todas las operaciones de cada módulo.

## Limitaciones y entrega

- Backend REAL, plataformas móviles y despliegue productivo no validados.
- Los datos MOCK son locales al navegador y origen; no son una base de datos multiusuario.
- Se conserva el diseño y comportamiento local, incluidos textos originales de las pantallas.
- Las advertencias de dependencias y resultados reales de validación se detallan en el PR.
- No se publican copias históricas de migración, cachés, secretos ni artefactos generados.

El flujo usa un único PR hacia develop. Solo después de confirmar su fusión se preparará un PR hacia qa mediante cherry-pick -x; después de confirmar QA, otro hacia main. No se realizan commits directos a ramas permanentes ni merges entre ellas.

## Verificaciones de esta entrega

La suite conjunta pasó 13/13 pruebas (9 archivos) y Cypress pasó 6/6 escenarios contra los cinco contenedores. Los cinco Docker builds, healthchecks y rutas principales respondieron correctamente (HTTP 200). Los resultados independientes por aplicación se detallan en el PR.

La copia de entrega corrige cuatro errores de lint heredados (tipos de errores en Inventory/Sales e interfaz vacía de un componente de plantilla) y sitúa resolve.dedupe en la configuración de Vite para que las pruebas conjuntas compartan una sola instancia del core. No modifica el workspace original.

Advertencias conocidas: 13 vulnerabilidades de dependencias reportadas por npm (9 moderadas y 4 altas); ESLint mantiene advertencias en useMemo de Ventas y fast refresh del contexto de autenticación; Vite advierte sobre bundles grandes y Cypress sobre Browserslist desactualizado. El entorno local de verificación utiliza Node 20.20.2 y reporta el requisito Node >=22 de Capacitor CLI; se recomienda Node 22 y Docker utiliza Node 22.
