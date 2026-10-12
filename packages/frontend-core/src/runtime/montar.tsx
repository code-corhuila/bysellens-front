import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '../auth/AuthContext.js';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '../styles/variables.css';

export function montar(aplicacion: React.ReactNode) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuthProvider>{aplicacion}</AuthProvider>
    </React.StrictMode>,
  );
}
