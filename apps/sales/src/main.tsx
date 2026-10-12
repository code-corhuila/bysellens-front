import './configurar';
import React from 'react';
import Login from '@bysellens/frontend-core/auth/Login';
import Ventas from './pages/Ventas';
import PortalApp from '@bysellens/frontend-core/runtime/PortalApp';
import { montar } from '@bysellens/frontend-core/runtime/montar';
montar(<PortalApp pantalla={Ventas} inicioSesion={Login} />);
