import './configurar';
import React from 'react';
import Login from '@bysellens/frontend-core/auth/Login';
import Home from './pages/Home';
import PortalApp from '@bysellens/frontend-core/runtime/PortalApp';
import { montar } from '@bysellens/frontend-core/runtime/montar';
montar(<PortalApp pantalla={Home} inicioSesion={Login} />);
