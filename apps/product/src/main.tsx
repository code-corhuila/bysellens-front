import './configurar';
import React from 'react';
import Login from '@bysellens/frontend-core/auth/Login';
import Productos from './pages/Productos';
import PortalApp from '@bysellens/frontend-core/runtime/PortalApp';
import { montar } from '@bysellens/frontend-core/runtime/montar';
montar(<PortalApp pantalla={Productos} inicioSesion={Login} />);
