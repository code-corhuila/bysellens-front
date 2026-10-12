import './configurar';
import React from 'react';
import Login from '@bysellens/frontend-core/auth/Login';
import Clientes from './pages/Clientes';
import PortalApp from '@bysellens/frontend-core/runtime/PortalApp';
import { montar } from '@bysellens/frontend-core/runtime/montar';
montar(<PortalApp pantalla={Clientes} inicioSesion={Login} />);
