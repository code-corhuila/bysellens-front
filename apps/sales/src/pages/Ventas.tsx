import React, { useEffect, useMemo, useState } from 'react';
import {
  addOutline,
  closeOutline,
  receiptOutline,
  personOutline,
  cubeOutline,
  cardOutline,
  trashOutline,
  searchOutline
} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

import {
  obtenerVentas,
  crearVenta,
  Venta
} from '../services/ventaService';

import {
  obtenerClientes,
  Cliente
} from '../services/catalogoService';

import {
  obtenerProductos,
  Producto
} from '../services/catalogoService';

import './Ventas.css';


interface DetalleFormulario {
  productoId: number;
  cantidad: number;
}


const Ventas: React.FC = () => {

  // =====================================================
  // DATOS
  // =====================================================

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [busqueda, setBusqueda] = useState('');

  // =====================================================
  // MODAL
  // =====================================================

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [guardando, setGuardando] =
    useState(false);

  const [mensajeFormulario, setMensajeFormulario] =
    useState('');

  // =====================================================
  // FORMULARIO
  // =====================================================

  const [clienteId, setClienteId] =
    useState<number | ''>('');

  const [metodoPago, setMetodoPago] =
    useState('EFECTIVO');

  const [detalles, setDetalles] =
    useState<DetalleFormulario[]>([
      {
        productoId: 0,
        cantidad: 1
      }
    ]);


  // =====================================================
  // CARGAR DATOS
  // =====================================================

  const cargarDatos = async () => {

    try {

      setCargando(true);
      setError('');

      const [
        ventasData,
        clientesData,
        productosData
      ] = await Promise.all([
        obtenerVentas(),
        obtenerClientes(),
        obtenerProductos()
      ]);

      setVentas(ventasData);
      setClientes(clientesData);
      setProductos(productosData);

    } catch (err) {

      console.error(err);

      setError(
        'No fue posible cargar la información de ventas.'
      );

    } finally {

      setCargando(false);

    }

  };


  useEffect(() => {
    cargarDatos();
  }, []);


  // =====================================================
  // ABRIR NUEVA VENTA
  // =====================================================

  const abrirFormulario = () => {

    setClienteId('');

    setMetodoPago('EFECTIVO');

    setDetalles([
      {
        productoId: 0,
        cantidad: 1
      }
    ]);

    setMensajeFormulario('');

    setMostrarFormulario(true);

  };


  // =====================================================
  // CERRAR
  // =====================================================

  const cerrarFormulario = () => {

    if (guardando) {
      return;
    }

    setMostrarFormulario(false);
    setMensajeFormulario('');

  };


  // =====================================================
  // PRODUCTO
  // =====================================================

  const buscarProducto = (
    productoId: number
  ): Producto | undefined => {

    return productos.find(
      producto => producto.id === productoId
    );

  };


  // =====================================================
  // CAMBIAR CLIENTE
  // =====================================================

  const cambiarCliente = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {

    const valor = event.target.value;

    setClienteId(
      valor === ''
        ? ''
        : Number(valor)
    );

  };


  // =====================================================
  // CAMBIAR PRODUCTO
  // =====================================================

  const cambiarProducto = (
    indice: number,
    productoId: number
  ) => {

    setDetalles(actuales => {

      const nuevos = [...actuales];

      nuevos[indice] = {
        ...nuevos[indice],
        productoId
      };

      return nuevos;

    });

  };


  // =====================================================
  // CAMBIAR CANTIDAD
  // =====================================================

  const cambiarCantidad = (
    indice: number,
    cantidad: number
  ) => {

    const producto =
      buscarProducto(
        detalles[indice].productoId
      );

    let nuevaCantidad =
      Number.isFinite(cantidad)
        ? cantidad
        : 1;

    nuevaCantidad =
      Math.max(1, nuevaCantidad);

    if (
      producto &&
      nuevaCantidad > producto.stock
    ) {

      nuevaCantidad =
        producto.stock;

    }

    setDetalles(actuales => {

      const nuevos = [...actuales];

      nuevos[indice] = {
        ...nuevos[indice],
        cantidad: nuevaCantidad
      };

      return nuevos;

    });

  };


  // =====================================================
  // AGREGAR PRODUCTO
  // =====================================================

  const agregarProducto = () => {

    setDetalles(actuales => [

      ...actuales,

      {
        productoId: 0,
        cantidad: 1
      }

    ]);

  };


  // =====================================================
  // ELIMINAR PRODUCTO
  // =====================================================

  const eliminarProducto = (
    indice: number
  ) => {

    if (detalles.length === 1) {

      setDetalles([
        {
          productoId: 0,
          cantidad: 1
        }
      ]);

      return;

    }

    setDetalles(actuales =>
      actuales.filter(
        (_, index) =>
          index !== indice
      )
    );

  };


  // =====================================================
  // TOTAL
  // =====================================================

  const totalVenta = useMemo(() => {

    return detalles.reduce(
      (total, detalle) => {

        const producto =
          buscarProducto(
            detalle.productoId
          );

        if (!producto) {
          return total;
        }

        return total +
          producto.precioVenta *
          detalle.cantidad;

      },
      0
    );

  }, [detalles, productos]);


  // =====================================================
  // FORMATO MONEDA
  // =====================================================

  const formatoPrecio = (
    valor: number
  ) => {

    return new Intl.NumberFormat(
      'es-CO',
      {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }
    ).format(valor);

  };


  // =====================================================
  // GUARDAR VENTA
  // =====================================================

  const guardarVenta = async () => {

    setMensajeFormulario('');


    // ---------------------------------------------------
    // CLIENTE
    // ---------------------------------------------------

    if (!clienteId) {

      setMensajeFormulario(
        'Selecciona un cliente para continuar.'
      );

      return;

    }


    // ---------------------------------------------------
    // PRODUCTOS
    // ---------------------------------------------------

    const detallesValidos =
      detalles.filter(
        detalle =>
          detalle.productoId > 0
      );


    if (detallesValidos.length === 0) {

      setMensajeFormulario(
        'Agrega al menos un producto.'
      );

      return;

    }


    // ---------------------------------------------------
    // PRODUCTOS REPETIDOS
    // ---------------------------------------------------

    const ids =
      detallesValidos.map(
        detalle =>
          detalle.productoId
      );


    if (
      new Set(ids).size !== ids.length
    ) {

      setMensajeFormulario(
        'No puedes agregar el mismo producto dos veces.'
      );

      return;

    }


    // ---------------------------------------------------
    // VALIDAR PRODUCTOS
    // ---------------------------------------------------

    for (
      const detalle
      of detallesValidos
    ) {

      const producto =
        buscarProducto(
          detalle.productoId
        );


      if (!producto) {

        setMensajeFormulario(
          'Uno de los productos seleccionados no existe.'
        );

        return;

      }


      if (!producto.activo) {

        setMensajeFormulario(
          `El producto "${producto.nombre}" está inactivo.`
        );

        return;

      }


      if (
        detalle.cantidad < 1
      ) {

        setMensajeFormulario(
          'La cantidad debe ser mayor a 0.'
        );

        return;

      }


      if (
        detalle.cantidad >
        producto.stock
      ) {

        setMensajeFormulario(
          `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}.`
        );

        return;

      }

    }


    // ---------------------------------------------------
    // REGISTRAR
    // ---------------------------------------------------

    try {

      setGuardando(true);


      const nuevaVenta =
        await crearVenta({

          clienteId: Number(clienteId),

          metodoPago,

          detalles:
            detallesValidos.map(
              detalle => ({
                productoId:
                  detalle.productoId,

                cantidad:
                  detalle.cantidad
              })
            )

        });


      // Agregar venta a la tabla
      setVentas(actuales => [
        nuevaVenta,
        ...actuales
      ]);


      // Recargar productos para actualizar stock
      try {

        const productosActualizados =
          await obtenerProductos();

        setProductos(
          productosActualizados
        );

      } catch (error) {

        console.warn(
          'No se pudieron actualizar los productos',
          error
        );

      }


      setMostrarFormulario(false);

      setMensajeFormulario('');

    } catch (errorCapturado: unknown) {
      const error = errorCapturado as { response?: { data?: { message?: string } } };

      console.error(
        'ERROR CREANDO VENTA:',
        error
      );


      const mensaje =
        error?.response?.data?.message;


      setMensajeFormulario(
        mensaje ||
        'No fue posible registrar la venta.'
      );

    } finally {

      setGuardando(false);

    }

  };


  // =====================================================
  // FILTRAR
  // =====================================================

  const ventasFiltradas =
    ventas.filter(venta => {

      const texto =
        busqueda
          .toLowerCase()
          .trim();

      if (!texto) {
        return true;
      }

      return (

        String(venta.id)
          .includes(texto)

        ||

        venta.cliente.nombre
          .toLowerCase()
          .includes(texto)

        ||

        venta.metodoPago
          .toLowerCase()
          .includes(texto)

      );

    });


  // =====================================================
  // TOTAL VENDIDO
  // =====================================================

  const totalVendido =
    ventas.reduce(
      (total, venta) =>
        total + venta.total,
      0
    );


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="ventas-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="ventas-header">

        <div>

          <span className="ventas-eyebrow">
            PÉTALOS ADMIN
          </span>

          <h1>
            Ventas
          </h1>

          <p>
            Registra y consulta las ventas realizadas en tu tienda.
          </p>

        </div>


        <button
          className="ventas-new-button"
          onClick={abrirFormulario}
        >

          <IonIcon icon={addOutline} />

          Nueva venta

        </button>

      </header>


      {/* =================================================
          CONTENIDO
      ================================================= */}

      <main className="ventas-content">

        {/* ESTADÍSTICAS */}

        <div className="ventas-stats">

          <div className="venta-stat-card">

            <div className="venta-stat-icon">
              <IonIcon icon={receiptOutline} />
            </div>

            <div>

              <span>
                Ventas registradas
              </span>

              <strong>
                {ventas.length}
              </strong>

            </div>

          </div>


          <div className="venta-stat-card">

            <div className="venta-stat-icon">
              <IonIcon icon={cardOutline} />
            </div>

            <div>

              <span>
                Total vendido
              </span>

              <strong>
                {formatoPrecio(totalVendido)}
              </strong>

            </div>

          </div>


          <div className="venta-stat-card">

            <div className="venta-stat-icon">
              <IonIcon icon={personOutline} />
            </div>

            <div>

              <span>
                Clientes
              </span>

              <strong>
                {clientes.length}
              </strong>

            </div>

          </div>

        </div>


        {/* TABLA */}

        <section className="ventas-card">

          <div className="ventas-card-header">

            <div>

              <h2>
                Registro de ventas
              </h2>

              <span>
                {ventas.length}{' '}
                {ventas.length === 1
                  ? 'venta registrada'
                  : 'ventas registradas'}
              </span>

            </div>


            <button
              className="ventas-refresh-button"
              onClick={cargarDatos}
            >
              Actualizar
            </button>

          </div>


          {/* BUSCADOR */}

          <div className="ventas-search">

            <IonIcon icon={searchOutline} />

            <input
              value={busqueda}
              onChange={e =>
                setBusqueda(e.target.value)
              }
              placeholder="Buscar por cliente, método de pago o ID..."
            />

          </div>


          {cargando && (

            <div className="ventas-message">
              Cargando ventas...
            </div>

          )}


          {!cargando && error && (

            <div className="ventas-message ventas-error">
              {error}
            </div>

          )}


          {!cargando &&
            !error &&
            ventasFiltradas.length > 0 && (

              <div className="ventas-table-wrapper">

                <table className="ventas-table">

                  <thead>

                    <tr>

                      <th>ID</th>

                      <th>Fecha</th>

                      <th>Cliente</th>

                      <th>Productos</th>

                      <th>Total</th>

                      <th>Método de pago</th>

                    </tr>

                  </thead>


                  <tbody>

                    {ventasFiltradas.map(
                      venta => (

                        <tr
                          key={venta.id}
                        >

                          <td>

                            <span className="venta-id">
                              #{venta.id}
                            </span>

                          </td>


                          <td>
                            {new Date(
                              venta.fecha
                            ).toLocaleDateString(
                              'es-CO'
                            )}
                          </td>


                          <td>

                            <div className="venta-client-cell">

                              <div className="venta-avatar">

                                {venta.cliente.nombre
                                  ?.charAt(0)
                                  .toUpperCase()}

                              </div>

                              <strong>
                                {venta.cliente.nombre}
                              </strong>

                            </div>

                          </td>


                          <td>

                            <span className="venta-products-count">

                              <IonIcon
                                icon={cubeOutline}
                              />

                              {venta.detalles.length}{' '}

                              {venta.detalles.length === 1
                                ? 'producto'
                                : 'productos'}

                            </span>

                          </td>


                          <td>

                            <strong className="venta-total">

                              {formatoPrecio(
                                venta.total
                              )}

                            </strong>

                          </td>


                          <td>

                            <span className="venta-payment-badge">

                              {venta.metodoPago}

                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}


          {!cargando &&
            !error &&
            ventas.length === 0 && (

              <div className="ventas-empty">

                <div className="ventas-empty-icon">

                  <IonIcon
                    icon={receiptOutline}
                  />

                </div>

                <strong>
                  No hay ventas registradas
                </strong>

                <span>
                  Registra tu primera venta para comenzar.
                </span>

                <button
                  className="ventas-empty-button"
                  onClick={abrirFormulario}
                >

                  <IonIcon icon={addOutline} />

                  Nueva venta

                </button>

              </div>

            )}

        </section>

      </main>


      {/* =================================================
          MODAL NUEVA VENTA
      ================================================= */}

      {mostrarFormulario && (

        <div className="venta-modal-overlay">

          <button
            className="venta-modal-backdrop"
            onClick={cerrarFormulario}
            aria-label="Cerrar"
          />


          <aside className="venta-modal-panel">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="venta-form-header">

              <div>

                <span className="venta-form-eyebrow">
                  PÉTALOS ADMIN
                </span>

                <h2>
                  Nueva venta
                </h2>

                <p>
                  Registra los productos vendidos y el método de pago.
                </p>

              </div>


              <button
                className="venta-close-button"
                onClick={cerrarFormulario}
                disabled={guardando}
              >

                <IonIcon
                  icon={closeOutline}
                />

              </button>

            </div>


            {/* =================================================
                FORM CONTENT
            ================================================= */}

            <div className="venta-form-content">


              {/* =================================================
                  CLIENTE
              ================================================= */}

              <section className="venta-section">

                <div className="venta-section-title">

                  <div className="venta-section-icon">

                    <IonIcon
                      icon={personOutline}
                    />

                  </div>

                  <div>

                    <h3>
                      Cliente
                    </h3>

                    <p>
                      Selecciona el cliente asociado a la venta.
                    </p>

                  </div>

                </div>


                <div className="venta-field">

                  <label>
                    Cliente <span>*</span>
                  </label>

                  <select
                    value={clienteId}
                    onChange={cambiarCliente}
                  >

                    <option value="">
                      Seleccionar cliente
                    </option>

                    {clientes
                      .filter(
                        cliente =>
                          cliente.activo
                      )
                      .map(
                        cliente => (

                          <option
                            key={cliente.id}
                            value={cliente.id}
                          >

                            {cliente.nombre}

                          </option>

                        )
                      )}

                  </select>

                </div>

              </section>


              {/* =================================================
                  PRODUCTOS
              ================================================= */}

              <section className="venta-section">

                <div className="venta-section-title">

                  <div className="venta-section-icon">

                    <IonIcon
                      icon={cubeOutline}
                    />

                  </div>

                  <div>

                    <h3>
                      Productos
                    </h3>

                    <p>
                      Agrega los productos incluidos en la venta.
                    </p>

                  </div>

                </div>


                <div className="venta-products-list">

                  {detalles.map(
                    (detalle, indice) => {

                      const producto =
                        buscarProducto(
                          detalle.productoId
                        );


                      return (

                        <div
                          className="venta-product-row"
                          key={indice}
                        >


                          <div className="venta-product-select">

                            <label>
                              Producto
                            </label>

                            <select
                              value={
                                detalle.productoId || ''
                              }
                              onChange={e =>
                                cambiarProducto(
                                  indice,
                                  Number(
                                    e.target.value
                                  )
                                )
                              }
                            >

                              <option value="">
                                Seleccionar producto
                              </option>

                              {productos
                                .filter(
                                  producto =>
                                    producto.activo &&
                                    producto.stock > 0
                                )
                                .map(
                                  producto => (

                                    <option
                                      key={producto.id}
                                      value={producto.id}
                                    >

                                      {producto.nombre}
                                      {' · '}
                                      {formatoPrecio(
                                        producto.precioVenta
                                      )}
                                      {' · Stock: '}
                                      {producto.stock}

                                    </option>

                                  )
                                )}

                            </select>

                          </div>


                          <div className="venta-quantity">

                            <label>
                              Cant.
                            </label>

                            <input
                              type="number"
                              min="1"
                              max={
                                producto?.stock ||
                                undefined
                              }
                              value={
                                detalle.cantidad
                              }
                              onChange={e =>
                                cambiarCantidad(
                                  indice,
                                  Number(
                                    e.target.value
                                  )
                                )
                              }
                            />

                          </div>


                          <div className="venta-product-total">

                            <span>
                              Total
                            </span>

                            <strong>

                              {formatoPrecio(
                                (producto?.precioVenta || 0) *
                                detalle.cantidad
                              )}

                            </strong>

                          </div>


                          <button
                            type="button"
                            className="venta-remove-product"
                            onClick={() =>
                              eliminarProducto(
                                indice
                              )
                            }
                            title="Eliminar producto"
                          >

                            <IonIcon
                              icon={trashOutline}
                            />

                          </button>

                        </div>

                      );

                    }
                  )}

                </div>


                <button
                  type="button"
                  className="venta-add-product"
                  onClick={agregarProducto}
                >

                  <IonIcon
                    icon={addOutline}
                  />

                  Agregar otro producto

                </button>

              </section>


              {/* =================================================
                  MÉTODO DE PAGO
              ================================================= */}

              <section className="venta-section">

                <div className="venta-section-title">

                  <div className="venta-section-icon">

                    <IonIcon
                      icon={cardOutline}
                    />

                  </div>

                  <div>

                    <h3>
                      Método de pago
                    </h3>

                    <p>
                      Selecciona cómo se realizó el pago.
                    </p>

                  </div>

                </div>


                <div className="venta-field">

                  <label>
                    Forma de pago <span>*</span>
                  </label>

                  <select
                    value={metodoPago}
                    onChange={e =>
                      setMetodoPago(
                        e.target.value
                      )
                    }
                  >

                    <option value="EFECTIVO">
                      Efectivo
                    </option>

                    <option value="TARJETA">
                      Tarjeta
                    </option>

                    <option value="TRANSFERENCIA">
                      Transferencia
                    </option>

                    <option value="NEQUI">
                      Nequi
                    </option>

                    <option value="DAVIPLATA">
                      Daviplata
                    </option>

                  </select>

                </div>

              </section>


              {/* =================================================
                  RESUMEN
              ================================================= */}

              <div className="venta-summary">

                <span>
                  Total de la venta
                </span>

                <strong>
                  {formatoPrecio(
                    totalVenta
                  )}
                </strong>

              </div>


              {mensajeFormulario && (

                <div className="venta-form-error">

                  {mensajeFormulario}

                </div>

              )}

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="venta-form-footer">

              <button
                type="button"
                className="venta-button venta-button-secondary"
                onClick={cerrarFormulario}
                disabled={guardando}
              >

                Cancelar

              </button>


              <button
                type="button"
                className="venta-button venta-button-primary"
                onClick={guardarVenta}
                disabled={guardando}
              >

                <IonIcon
                  icon={receiptOutline}
                />

                {guardando
                  ? 'Registrando...'
                  : 'Registrar venta'}

              </button>

            </div>

          </aside>

        </div>

      )}

    </div>
  );
};


export default Ventas;