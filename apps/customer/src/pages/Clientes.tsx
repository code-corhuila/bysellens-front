import React, { useEffect, useState } from 'react';

import { IonIcon } from '@ionic/react';

import {
  personAddOutline,
  createOutline,
  trashOutline,
  closeOutline,
  searchOutline,
  peopleOutline
} from 'ionicons/icons';

import {
  Cliente,
  ClienteRequest,
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../services/clienteService';

import './Clientes.css';

/* =========================================================
   TIPOS
========================================================= */

interface ClienteFormProps {
  cliente: Cliente | null;
  onGuardar: (datos: ClienteRequest) => void;
  onCancelar: () => void;
}

/* =========================================================
   FORMULARIO CLIENTE
========================================================= */

const ClienteForm: React.FC<ClienteFormProps> = ({
  cliente,
  onGuardar,
  onCancelar
}) => {

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [activo, setActivo] = useState(true);

  const esEdicion = cliente !== null;

  /* =======================================================
     CARGAR DATOS PARA EDITAR
  ======================================================= */

  useEffect(() => {

    if (cliente) {

      setNombre(cliente.nombre || '');
      setTelefono(cliente.telefono || '');
      setCorreo(cliente.email || '');
      setDireccion(cliente.direccion || '');
      setActivo(cliente.activo ?? true);

    } else {

      setNombre('');
      setTelefono('');
      setCorreo('');
      setDireccion('');
      setActivo(true);

    }

  }, [cliente]);

  /* =======================================================
     GUARDAR
  ======================================================= */

  const guardar = () => {

    if (!nombre.trim()) {
      alert('El nombre completo es obligatorio');
      return;
    }

    if (!telefono.trim()) {
      alert('El teléfono es obligatorio');
      return;
    }

    if (!correo.trim()) {
      alert('El correo electrónico es obligatorio');
      return;
    }

    if (!direccion.trim()) {
      alert('La dirección es obligatoria');
      return;
    }

    if (!correo.includes('@')) {
      alert('Ingresa un correo electrónico válido');
      return;
    }

    const datos: ClienteRequest = {

      nombre: nombre.trim(),

      telefono: telefono.trim(),

      email: correo.trim(),

      direccion: direccion.trim(),

      activo

    };

    onGuardar(datos);

  };

  return (

    <div className="cliente-form">

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <div className="cliente-form-header">

        <div>

          <span className="cliente-form-eyebrow">
            PÉTALOS ADMIN
          </span>

          <h1>
            {esEdicion
              ? 'Editar cliente'
              : 'Nuevo cliente'
            }
          </h1>

          <p>
            {esEdicion
              ? 'Modifica la información del cliente.'
              : 'Registra un nuevo cliente en el sistema.'
            }
          </p>

        </div>

        <button
          type="button"
          className="cliente-close-button"
          onClick={onCancelar}
          aria-label="Cerrar"
        >

          <IonIcon icon={closeOutline} />

        </button>

      </div>


      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <div className="cliente-form-content">

        {/* ===================================================
            INFORMACIÓN DEL CLIENTE
        =================================================== */}

        <section className="cliente-section">

          <div className="cliente-section-title">

            <div className="cliente-section-icon">

              <IonIcon icon={peopleOutline} />

            </div>

            <div>

              <h2>
                Información del cliente
              </h2>

              <p>
                Datos básicos para asociar el cliente con sus ventas.
              </p>

            </div>

          </div>


          <div className="cliente-fields">

            {/* =================================================
                NOMBRE
            ================================================= */}

            <div className="cliente-field cliente-field-full">

              <label>
                Nombre completo <span>*</span>
              </label>

              <input
                type="text"
                value={nombre}
                placeholder="Ej. María López"
                onChange={(e) =>
                  setNombre(e.target.value)
                }
              />

            </div>


            {/* =================================================
                TELÉFONO
            ================================================= */}

            <div className="cliente-field">

              <label>
                Teléfono <span>*</span>
              </label>

              <input
                type="tel"
                value={telefono}
                placeholder="Ej. 300 123 4567"
                onChange={(e) =>
                  setTelefono(e.target.value)
                }
              />

            </div>


            {/* =================================================
                CORREO
            ================================================= */}

            <div className="cliente-field">

              <label>
                Correo electrónico <span>*</span>
              </label>

              <input
                type="email"
                value={correo}
                placeholder="Ej. cliente@gmail.com"
                onChange={(e) =>
                  setCorreo(e.target.value)
                }
              />

            </div>


            {/* =================================================
                DIRECCIÓN
            ================================================= */}

            <div className="cliente-field cliente-field-full">

              <label>
                Dirección <span>*</span>
              </label>

              <input
                type="text"
                value={direccion}
                placeholder="Ej. Calle 10 # 15-20"
                onChange={(e) =>
                  setDireccion(e.target.value)
                }
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            ESTADO
        =================================================== */}

        <section className="cliente-section cliente-status-section">

          <div className="cliente-section-title">

            <div className="cliente-section-icon">

              <IonIcon icon={personAddOutline} />

            </div>

            <div>

              <h2>
                Estado del cliente
              </h2>

              <p>
                Define si el cliente está disponible para nuevas ventas.
              </p>

            </div>

          </div>


          <div className="cliente-status-card">

            <div>

              <strong>
                Cliente activo
              </strong>

              <span>
                Disponible para registrar ventas.
              </span>

            </div>


            <button
              type="button"
              className={
                activo
                  ? 'cliente-switch active'
                  : 'cliente-switch'
              }
              onClick={() =>
                setActivo(!activo)
              }
              aria-label="Cambiar estado del cliente"
            >

              <span />

            </button>

          </div>

        </section>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="cliente-form-footer">

        <button
          type="button"
          className="cliente-button cliente-button-secondary"
          onClick={onCancelar}
        >
          Cancelar
        </button>


        <button
          type="button"
          className="cliente-button cliente-button-primary"
          onClick={guardar}
        >

          <IonIcon
            icon={
              esEdicion
                ? createOutline
                : personAddOutline
            }
          />

          {esEdicion
            ? 'Guardar cambios'
            : 'Registrar cliente'
          }

        </button>

      </div>

    </div>

  );
};


/* =========================================================
   PÁGINA CLIENTES
========================================================= */

const Clientes: React.FC = () => {

  const [clientes, setClientes] =
    useState<Cliente[]>([]);

  const [busqueda, setBusqueda] =
    useState('');

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);


  /* =======================================================
     CARGAR CLIENTES
  ======================================================= */

  const cargarClientes = async () => {

    try {

      const respuesta =
        await listarClientes();

      setClientes(respuesta);

    } catch (error) {

      console.error(
        'Error cargando clientes:',
        error
      );

    }

  };


  useEffect(() => {

    cargarClientes();

  }, []);


  /* =======================================================
     NUEVO CLIENTE
  ======================================================= */

  const abrirNuevoCliente = () => {

    setClienteSeleccionado(null);

    setMostrarFormulario(true);

  };


  /* =======================================================
     EDITAR CLIENTE
  ======================================================= */

  const abrirEditarCliente = (
    cliente: Cliente
  ) => {

    setClienteSeleccionado(cliente);

    setMostrarFormulario(true);

  };


  /* =======================================================
     CERRAR FORMULARIO
  ======================================================= */

  const cerrarFormulario = () => {

    setMostrarFormulario(false);

    setClienteSeleccionado(null);

  };


  /* =======================================================
     GUARDAR CLIENTE
  ======================================================= */

  const guardarCliente = async (
    datos: ClienteRequest
  ) => {

    try {

      if (clienteSeleccionado) {

        await actualizarCliente(
          clienteSeleccionado.id,
          datos
        );

        alert(
          'Cliente actualizado correctamente'
        );

      } else {

        await crearCliente(datos);

        alert(
          'Cliente registrado correctamente'
        );

      }

      cerrarFormulario();

      cargarClientes();

    } catch (error) {

      console.error(
        'Error guardando cliente:',
        error
      );

      alert(
        'No fue posible guardar el cliente'
      );

    }

  };


  /* =======================================================
     ELIMINAR CLIENTE
  ======================================================= */

  const borrarCliente = async (
    cliente: Cliente
  ) => {

    const confirmar =
      window.confirm(
        `¿Deseas eliminar al cliente "${cliente.nombre}"?`
      );

    if (!confirmar) {
      return;
    }


    try {

      await eliminarCliente(
        cliente.id
      );

      cargarClientes();

    } catch (error) {

      console.error(
        'Error eliminando cliente:',
        error
      );

      alert(
        'No fue posible eliminar el cliente'
      );

    }

  };


  /* =======================================================
     FILTRO
  ======================================================= */

  const clientesFiltrados =
    clientes.filter((cliente) => {

      const texto =
        busqueda
          .toLowerCase()
          .trim();

      return (

        cliente.nombre
          ?.toLowerCase()
          .includes(texto)

        ||

        cliente.telefono
          ?.toLowerCase()
          .includes(texto)

        ||

        cliente.email
          ?.toLowerCase()
          .includes(texto)

      );

    });


  /* =======================================================
     VISTA
  ======================================================= */

  return (

    <div className="clientes-page">


      {/* =====================================================
          CABECERA
      ===================================================== */}

      <header className="clientes-header">

        <div>

          <span className="clientes-eyebrow">
            PÉTALOS ADMIN
          </span>

          <h1>
            Clientes
          </h1>

          <p>
            Registra y administra la información de tus clientes.
          </p>

        </div>


        <button
          className="clientes-new-button"
          onClick={abrirNuevoCliente}
        >

          <IonIcon
            icon={personAddOutline}
          />

          Nuevo cliente

        </button>

      </header>


      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <main className="clientes-content">


        {/* ===================================================
            CARD PRINCIPAL
        =================================================== */}

        <section className="clientes-card">


          {/* =================================================
              CABECERA CARD
          ================================================= */}

          <div className="clientes-card-header">

            <div>

              <h2>
                Gestión de clientes
              </h2>

              <span>

                {clientes.length}{' '}

                {clientes.length === 1
                  ? 'cliente registrado'
                  : 'clientes registrados'
                }

              </span>

            </div>

          </div>


          {/* =================================================
              BUSCADOR
          ================================================= */}

          <div className="clientes-search">

            <IonIcon
              icon={searchOutline}
            />

            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o correo..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />

          </div>


          {/* =================================================
              TABLA
          ================================================= */}

          <div className="clientes-table-wrapper">

            <table className="clientes-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Cliente
                  </th>

                  <th>
                    Teléfono
                  </th>

                  <th>
                    Correo electrónico
                  </th>

                  <th>
                    Dirección
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>

                {clientesFiltrados.length > 0 ? (

                  clientesFiltrados.map(
                    (cliente) => (

                      <tr
                        key={cliente.id}
                      >

                        {/* ID */}

                        <td>
                          {cliente.id}
                        </td>


                        {/* CLIENTE */}

                        <td>

                          <div className="cliente-name-cell">

                            <div className="cliente-avatar">

                              {cliente.nombre
                                ?.charAt(0)
                                .toUpperCase()
                              }

                            </div>

                            <strong>
                              {cliente.nombre}
                            </strong>

                          </div>

                        </td>


                        {/* TELÉFONO */}

                        <td>
                          {cliente.telefono}
                        </td>


                        {/* CORREO */}

                        <td>
                          {cliente.email}
                        </td>


                        {/* DIRECCIÓN */}

                        <td>
                          {cliente.direccion}
                        </td>


                        {/* ESTADO */}

                        <td>

                          <span
                            className={
                              cliente.activo
                                ? 'cliente-badge active'
                                : 'cliente-badge inactive'
                            }
                          >

                            {cliente.activo
                              ? 'Activo'
                              : 'Inactivo'
                            }

                          </span>

                        </td>


                        {/* ACCIONES */}

                        <td>

                          <div className="cliente-actions">


                            {/* EDITAR */}

                            <button
                              className="cliente-action edit"
                              onClick={() =>
                                abrirEditarCliente(
                                  cliente
                                )
                              }
                              title="Editar"
                            >

                              <IonIcon
                                icon={createOutline}
                              />

                              Editar

                            </button>


                            {/* ELIMINAR */}

                            <button
                              className="cliente-action delete"
                              onClick={() =>
                                borrarCliente(
                                  cliente
                                )
                              }
                              title="Eliminar"
                            >

                              <IonIcon
                                icon={trashOutline}
                              />

                              Eliminar

                            </button>


                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={7}
                      className="clientes-empty"
                    >

                      <div className="clientes-empty-icon">

                        <IonIcon
                          icon={peopleOutline}
                        />

                      </div>

                      <strong>
                        No se encontraron clientes
                      </strong>

                      <span>
                        Registra un cliente nuevo para comenzar.
                      </span>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* =====================================================
          MODAL / PANEL LATERAL
      ===================================================== */}

      {mostrarFormulario && (

        <div className="cliente-modal-overlay">


          {/* =================================================
              ZONA PARA CERRAR
          ================================================= */}

          <button
            className="cliente-modal-backdrop"
            onClick={cerrarFormulario}
            aria-label="Cerrar formulario"
          />


          {/* =================================================
              PANEL
          ================================================= */}

          <aside className="cliente-modal-panel">

            <ClienteForm
              cliente={clienteSeleccionado}
              onGuardar={guardarCliente}
              onCancelar={cerrarFormulario}
            />

          </aside>

        </div>

      )}

    </div>

  );

};


export default Clientes;