import React from 'react';

import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import {
  Navigate,
  Route,
  useLocation,
} from 'react-router-dom';

import Sidebar from '@bysellens/frontend-core/components/Sidebar';

import Productos from '../apps/product/src/pages/Productos';
import Inventario from '../apps/inventory/src/pages/Inventario';
import Clientes from '../apps/customer/src/pages/Clientes';
import Ventas from '../apps/sales/src/pages/Ventas';
import Login from '@bysellens/frontend-core/auth/Login';

import { useAuth } from '@bysellens/frontend-core/auth/AuthContext';

import '@bysellens/frontend-core/styles/App.css';

interface RutaProtegidaProps {
  children: React.ReactNode;
}

const RutaProtegida: React.FC<
  RutaProtegidaProps
> = ({ children }) => {

  const { autenticado } = useAuth();

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
};

const AppContenido: React.FC = () => {

  const { autenticado } = useAuth();

  const location = useLocation();

  const estaEnLogin =
    location.pathname === '/login';

  const mostrarSidebar =
    autenticado && !estaEnLogin;

  return (

    <div
      className={
        mostrarSidebar
          ? 'app-layout'
          : ''
      }
    >

      {mostrarSidebar && <Sidebar />}

      <main
        className={
          mostrarSidebar
            ? 'main-content'
            : 'main-content-login'
        }
      >

        <IonRouterOutlet>

          {/* =================================================
              LOGIN
              ================================================= */}

          <Route
            path="/login"
            element={
              autenticado ? (
                <Navigate
                  to="/productos"
                  replace
                />
              ) : (
                <Login />
              )
            }
          />

          {/* =================================================
              PRODUCTOS
              ================================================= */}

          <Route
            path="/productos"
            element={
              <RutaProtegida>
                <Productos />
              </RutaProtegida>
            }
          />

          {/* =================================================
              INVENTARIO
              ================================================= */}

          <Route
            path="/inventario"
            element={
              <RutaProtegida>
                <Inventario />
              </RutaProtegida>
            }
          />

          {/* =================================================
              CLIENTES
              ================================================= */}

          <Route
            path="/clientes"
            element={
              <RutaProtegida>
                <Clientes />
              </RutaProtegida>
            }
          />

          {/* =================================================
              VENTAS
              ================================================= */}

          <Route
            path="/ventas"
            element={
              <RutaProtegida>
                <Ventas />
              </RutaProtegida>
            }
          />

          {/* =================================================
              INICIO
              ================================================= */}

          <Route
            path="/"
            element={
              <Navigate
                to={
                  autenticado
                    ? '/productos'
                    : '/login'
                }
                replace
              />
            }
          />

          {/* =================================================
              RUTA NO EXISTENTE
              ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to={
                  autenticado
                    ? '/productos'
                    : '/login'
                }
                replace
              />
            }
          />

        </IonRouterOutlet>

      </main>

    </div>
  );
};

const App: React.FC = () => {

  return (

    <IonApp>

      <IonReactRouter>

        <AppContenido />

      </IonReactRouter>

    </IonApp>
  );
};

export default App;