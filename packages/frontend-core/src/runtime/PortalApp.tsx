import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';
import Sidebar from '../components/Sidebar.js';
import { rutaInicial } from '../configuracion.js';
import '../styles/App.css';

interface PortalAppProps {
  pantalla: React.ComponentType;
  inicioSesion: React.ComponentType;
}

const Contenido: React.FC<PortalAppProps> = ({ pantalla: Pantalla, inicioSesion: Login }) => {
  const { autenticado } = useAuth();
  const location = useLocation();
  const mostrar = autenticado && location.pathname !== '/login';
  return <div className={mostrar ? 'app-layout' : ''}>
    {mostrar && <Sidebar />}
    <main className={mostrar ? 'main-content' : 'main-content-login'}>
      <IonRouterOutlet>
        <Route path="/login" element={autenticado ? <Navigate to={rutaInicial} replace /> : <Login />} />
        <Route path={rutaInicial} element={autenticado ? <Pantalla /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={autenticado ? rutaInicial : '/login'} replace />} />
      </IonRouterOutlet>
    </main>
  </div>;
};
const PortalApp: React.FC<PortalAppProps> = ({ pantalla, inicioSesion }) => <IonApp><IonReactRouter><Contenido pantalla={pantalla} inicioSesion={inicioSesion} /></IonReactRouter></IonApp>;
export default PortalApp;
