import { configurarFrontend } from '@bysellens/frontend-core/configuracion';
configurarFrontend({ modo: import.meta.env.VITE_DATA_MODE === 'mock' ? 'mock' : 'real', apiBase: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', portal: 'monolito' });
