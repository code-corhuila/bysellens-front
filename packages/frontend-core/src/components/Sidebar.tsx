import { portal } from '../configuracion.js';
import React from 'react';

import { IonIcon } from '@ionic/react';

import {
  bagOutline,
  cubeOutline,
  peopleOutline,
  cartOutline,
  logOutOutline,
} from 'ionicons/icons';

import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext.js';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { usuario, logout } = useAuth();

  const navegar = (ruta: string) => {
    if (portal !== 'monolito') window.location.assign(ruta);
    else navigate(ruta);
  };

  const cerrarSesion = () => {
    logout();
    navigate('/login', {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">

      {/* =========================
          MARCA
      ========================== */}

      <div className="sidebar-brand">
        <div className="sidebar-brand-name">
          BY SELLENS
        </div>

        <div className="sidebar-brand-name">
          PLATFORM
        </div>
      </div>

      {/* =========================
          MENÚ
      ========================== */}

      <nav className="sidebar-menu">

        <button
          type="button"
          className={
            location.pathname === '/productos'
              ? 'sidebar-item active'
              : 'sidebar-item'
          }
          onClick={() => navegar('/productos')}
        >
          <IonIcon icon={bagOutline} />
          <span>Productos</span>
        </button>

        <button
          type="button"
          className={
            location.pathname === '/inventario'
              ? 'sidebar-item active'
              : 'sidebar-item'
          }
          onClick={() => navegar('/inventario')}
        >
          <IonIcon icon={cubeOutline} />
          <span>Inventario</span>
        </button>

        <button
          type="button"
          className={
            location.pathname === '/clientes'
              ? 'sidebar-item active'
              : 'sidebar-item'
          }
          onClick={() => navegar('/clientes')}
        >
          <IonIcon icon={peopleOutline} />
          <span>Clientes</span>
        </button>

        <button
          type="button"
          className={
            location.pathname === '/ventas'
              ? 'sidebar-item active'
              : 'sidebar-item'
          }
          onClick={() => navegar('/ventas')}
        >
          <IonIcon icon={cartOutline} />
          <span>Ventas</span>
        </button>

      </nav>

      {/* =========================
          USUARIO
      ========================== */}

      <div className="sidebar-user">

        <div className="user-avatar">
          {usuario?.email?.charAt(0).toUpperCase() || 'A'}
        </div>

        <div className="user-info">
          <strong>
            {usuario?.email || 'Administrador'}
          </strong>

          <span>
            {usuario?.rol || 'ADMIN'}
          </span>
        </div>

      </div>

      {/* =========================
          CERRAR SESIÓN
      ========================== */}

      <button
        type="button"
        className="sidebar-logout"
        onClick={cerrarSesion}
      >
        <IonIcon icon={logOutOutline} />
        <span>Cerrar sesión</span>
      </button>

    </aside>
  );
};

export default Sidebar;