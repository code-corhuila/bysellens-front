import { imagenProducto } from '@bysellens/frontend-core/configuracion';
import React, { useEffect, useState } from 'react';

import {
  IonContent,
  IonPage
} from '@ionic/react';

import './Inventario.css';

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  Producto,
  ProductoRequest
} from '../services/productoService';



const Inventario: React.FC = () => {

  // =========================
  // ESTADOS
  // =========================

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Drawer
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeFormulario, setMensajeFormulario] = useState('');

  // Producto que estamos editando
  const [productoEditando, setProductoEditando] =
    useState<Producto | null>(null);

  // =========================
  // IMAGEN
  // =========================

  const [archivoImagen, setArchivoImagen] =
    useState<File | null>(null);

  const [previewImagen, setPreviewImagen] =
    useState('');

  // =========================
  // FORMULARIO
  // =========================

  const [formulario, setFormulario] =
    useState<ProductoRequest>({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      tono: '',
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      stockMinimo: 0,
      activo: true
    });

  // =========================
  // CARGAR PRODUCTOS
  // =========================

  const cargarProductos = async () => {

    try {

      setCargando(true);
      setError('');

      const data = await obtenerProductos();

      setProductos(data);

    } catch (error) {

      console.error(
        'Error cargando inventario:',
        error
      );

      setError(
        'No fue posible cargar el inventario.'
      );

    } finally {

      setCargando(false);
    }
  };

  useEffect(() => {

    cargarProductos();

  }, []);

  // =========================
  // NUEVO PRODUCTO
  // =========================

  const abrirNuevo = () => {

    setProductoEditando(null);
    setMensajeFormulario('');

    setArchivoImagen(null);
    setPreviewImagen('');

    setFormulario({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      tono: '',
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      stockMinimo: 5,
      activo: true
    });

    setMostrarFormulario(true);
  };

  // =========================
  // EDITAR PRODUCTO
  // =========================

  const abrirEditar = (
    producto: Producto
  ) => {

    setProductoEditando(producto);
    setMensajeFormulario('');
    setArchivoImagen(null);

    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || '',
      tono: producto.tono || '',
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      activo: producto.activo
    });

    // Mostrar imagen existente
    if (producto.imagen) {

      setPreviewImagen(
        imagenProducto(producto.imagen)
      );

    } else {

      setPreviewImagen('');
    }

    setMostrarFormulario(true);
  };

  // =========================
  // CERRAR FORMULARIO
  // =========================

  const cerrarFormulario = () => {

    if (!guardando) {

      setMostrarFormulario(false);
      setProductoEditando(null);

      setArchivoImagen(null);
      setPreviewImagen('');

      setMensajeFormulario('');
    }
  };

  // =========================
  // CAMBIAR CAMPO
  // =========================

  const cambiarCampo = (
    campo: keyof ProductoRequest,
    valor: string | number | boolean
  ) => {

    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor
    }));

  };

  // =========================
  // SELECCIONAR IMAGEN
  // =========================

  const seleccionarImagen = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const archivo =
      event.target.files?.[0];

    if (!archivo) {
      return;
    }

    // =========================
    // VALIDAR TIPO
    // =========================

    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!tiposPermitidos.includes(archivo.type)) {

      setMensajeFormulario(
        'Solo se permiten imágenes JPG, PNG o WEBP.'
      );

      event.target.value = '';

      return;
    }

    // =========================
    // VALIDAR TAMAÑO
    // =========================

    const maximo =
      5 * 1024 * 1024;

    if (archivo.size > maximo) {

      setMensajeFormulario(
        'La imagen no puede superar los 5 MB.'
      );

      event.target.value = '';

      return;
    }

    setMensajeFormulario('');

    setArchivoImagen(archivo);

    // =========================
    // CREAR PREVIEW
    // =========================

    const url =
      URL.createObjectURL(archivo);

    setPreviewImagen(url);
  };

  // =========================
  // ELIMINAR IMAGEN
  // =========================

  const eliminarImagen = () => {

    setArchivoImagen(null);
    setPreviewImagen('');

    const input =
      document.getElementById(
        'imagen-producto'
      ) as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  };

  // =========================
  // CAMBIAR IMAGEN
  // =========================

  const cambiarImagen = () => {

    const input =
      document.getElementById(
        'imagen-producto'
      ) as HTMLInputElement | null;

    if (input) {
      input.click();
    }
  };

  // =========================
  // VALIDAR
  // =========================

  const validarFormulario = (): boolean => {

    if (!formulario.codigo.trim()) {

      setMensajeFormulario(
        'El código es obligatorio.'
      );

      return false;
    }

    if (!formulario.nombre.trim()) {

      setMensajeFormulario(
        'El nombre del producto es obligatorio.'
      );

      return false;
    }

    if (!formulario.categoria.trim()) {

      setMensajeFormulario(
        'La categoría es obligatoria.'
      );

      return false;
    }

    if (formulario.precioCompra < 0) {

      setMensajeFormulario(
        'El precio de compra no puede ser negativo.'
      );

      return false;
    }

    if (
      formulario.precioVenta <
      formulario.precioCompra
    ) {

      setMensajeFormulario(
        'El precio de venta no puede ser menor que el precio de compra.'
      );

      return false;
    }

    if (formulario.stock < 0) {

      setMensajeFormulario(
        'El stock no puede ser negativo.'
      );

      return false;
    }

    if (formulario.stockMinimo < 0) {

      setMensajeFormulario(
        'El stock mínimo no puede ser negativo.'
      );

      return false;
    }

    return true;
  };

  // =========================
  // GUARDAR
  // =========================

  const guardarProducto = async () => {

    setMensajeFormulario('');

    if (!validarFormulario()) {
      return;
    }

    try {

      setGuardando(true);

      // =========================
      // EDITAR
      // =========================

      if (productoEditando) {

        const actualizado =
          await actualizarProducto(
            productoEditando.id,
            formulario,
            archivoImagen
          );

        setProductos((anteriores) =>
          anteriores.map((producto) =>
            producto.id === actualizado.id
              ? actualizado
              : producto
          )
        );

      }

      // =========================
      // CREAR
      // =========================

      else {

        const creado =
          await crearProducto(
            formulario,
            archivoImagen
          );

        setProductos((anteriores) => [
          ...anteriores,
          creado
        ]);
      }

      cerrarFormulario();

    } catch (errorCapturado: unknown) {
      const error = errorCapturado as { response?: { data?: { message?: string } } };

      console.error(
        'Error guardando producto:',
        error
      );

      if (
        error.response?.data?.message
      ) {

        setMensajeFormulario(
          error.response.data.message
        );

      } else {

        setMensajeFormulario(
          'No fue posible guardar el producto.'
        );
      }

    } finally {

      setGuardando(false);
    }
  };

  // =========================
  // ELIMINAR
  // =========================

  const eliminar = async (
    producto: Producto
  ) => {

    const confirmar =
      window.confirm(
        `¿Deseas eliminar "${producto.nombre}"?`
      );

    if (!confirmar) {
      return;
    }

    try {

      await eliminarProducto(
        producto.id
      );

      setProductos((anteriores) =>
        anteriores.filter(
          (item) =>
            item.id !== producto.id
        )
      );

    } catch (errorCapturado: unknown) {
      const error = errorCapturado as { response?: { data?: { message?: string } } };

      console.error(
        'Error eliminando producto:',
        error
      );

      alert(
        error.response?.data?.message ||
        'No fue posible eliminar el producto.'
      );
    }
  };

  // =========================
  // FILTRAR
  // =========================

  const productosFiltrados =
    productos.filter((producto) => {

      const texto =
        busqueda.toLowerCase();

      return (

        producto.codigo
          ?.toLowerCase()
          .includes(texto)

        ||

        producto.nombre
          ?.toLowerCase()
          .includes(texto)

        ||

        producto.categoria
          ?.toLowerCase()
          .includes(texto)

        ||

        producto.tono
          ?.toLowerCase()
          .includes(texto)
      );

    });

  // =========================
  // PRECIO
  // =========================

  const formatoPrecio = (
    precio: number
  ) => {

    return new Intl.NumberFormat(
      'es-CO',
      {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }
    ).format(precio);

  };

  // =========================
  // VISTA
  // =========================

  return (

    <IonPage>

      <IonContent>

        <div className="page-content">

          {/* ========================================
              HEADER
              ======================================== */}

          <div className="page-header">

            <div>

              <div className="page-subtitle">
                PÉTALOS ADMIN
              </div>

              <h1>
                Inventario
              </h1>

              <p>
                Controla y actualiza las existencias
                de tus productos.
              </p>

            </div>

            <button
              className="primary-button"
              onClick={abrirNuevo}
            >
              + Nuevo producto
            </button>

          </div>


          {/* ========================================
              CARD
              ======================================== */}

          <div className="products-card">

            <div className="products-header">

              <div>

                <h2>
                  Control de inventario
                </h2>

                <span className="product-count">
                  {productos.length}{' '}
                  productos registrados
                </span>

              </div>

              <button
                className="refresh-button"
                onClick={cargarProductos}
              >
                Actualizar
              </button>

            </div>


            {/* ========================================
                BUSCADOR
                ======================================== */}

            <div className="search-container">

              <input
                type="text"
                placeholder="Buscar por código, nombre, categoría o tono..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
              />

            </div>


            {/* ========================================
                CARGANDO
                ======================================== */}

            {cargando && (

              <div className="message">
                Cargando inventario...
              </div>

            )}


            {/* ========================================
                ERROR
                ======================================== */}

            {!cargando && error && (

              <div className="message error">
                {error}
              </div>

            )}


            {/* ========================================
                TABLA
                ======================================== */}

            {!cargando &&
              !error &&
              productosFiltrados.length > 0 && (

                <div className="table-container">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Código
                        </th>

                        <th>
                          Producto
                        </th>

                        <th>
                          Categoría
                        </th>

                        <th>
                          Tono
                        </th>

                        <th>
                          Compra
                        </th>

                        <th>
                          Venta
                        </th>

                        <th>
                          Stock
                        </th>

                        <th>
                          Mínimo
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

                      {productosFiltrados.map(
                        (producto) => (

                          <tr
                            key={producto.id}
                          >

                            <td>

                              <span className="product-code">
                                {producto.codigo}
                              </span>

                            </td>


                            <td>

                              <div className="product-name">

                                <strong>
                                  {producto.nombre}
                                </strong>

                                {producto.descripcion && (

                                  <small>
                                    {
                                      producto.descripcion
                                    }
                                  </small>

                                )}

                              </div>

                            </td>


                            <td>
                              {producto.categoria}
                            </td>


                            <td>
                              {producto.tono || '-'}
                            </td>


                            <td>
                              {formatoPrecio(
                                producto.precioCompra
                              )}
                            </td>


                            <td>
                              {formatoPrecio(
                                producto.precioVenta
                              )}
                            </td>


                            <td>

                              <span
                                className={
                                  producto.stock <=
                                  producto.stockMinimo
                                    ? 'stock low'
                                    : 'stock'
                                }
                              >
                                {producto.stock}
                              </span>

                            </td>


                            <td>
                              {producto.stockMinimo}
                            </td>


                            <td>

                              <span
                                className={
                                  producto.activo
                                    ? 'status active'
                                    : 'status inactive'
                                }
                              >
                                {producto.activo
                                  ? 'Activo'
                                  : 'Inactivo'}
                              </span>

                            </td>


                            <td>

                              <div className="actions">

                                <button
                                  className="table-button"
                                  onClick={() =>
                                    abrirEditar(
                                      producto
                                    )
                                  }
                                >
                                  Editar
                                </button>


                                <button
                                  className="table-button delete"
                                  onClick={() =>
                                    eliminar(
                                      producto
                                    )
                                  }
                                >
                                  Eliminar
                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}


            {/* ========================================
                SIN RESULTADOS
                ======================================== */}

            {!cargando &&
              !error &&
              productosFiltrados.length === 0 && (

                <div className="empty-products">

                  <div className="empty-title">
                    No se encontraron productos
                  </div>

                  <div className="empty-text">
                    Agrega un producto o cambia
                    el criterio de búsqueda.
                  </div>

                </div>

              )}

          </div>

        </div>


        {/* ==========================================
            DRAWER
            ========================================== */}

        {mostrarFormulario && (

          <>

            <div
              className="inventario-drawer-overlay"
              onClick={cerrarFormulario}
            />


            <aside
              className="inventario-drawer"
              aria-label={
                productoEditando
                  ? 'Editar producto'
                  : 'Nuevo producto'
              }
            >

              <div className="product-form">


                {/* ==================================
                    HEADER DEL DRAWER
                    ================================== */}

                <div className="form-header">

                  <div>

                    <div className="form-kicker">
                      PÉTALOS ADMIN
                    </div>

                    <h2>
                      {productoEditando
                        ? 'Editar producto'
                        : 'Nuevo producto'}
                    </h2>

                    <p>
                      {productoEditando
                        ? 'Modifica la información del producto.'
                        : 'Registra un nuevo producto en el inventario.'}
                    </p>

                  </div>


                  <button
                    type="button"
                    className="close-button"
                    onClick={cerrarFormulario}
                    disabled={guardando}
                    aria-label="Cerrar"
                  >
                    ×
                  </button>

                </div>


                {/* ==================================
                    INFORMACIÓN
                    ================================== */}

                <section className="form-section">

                  <div className="form-section-title">
                    Información del producto
                  </div>

                  <div className="form-section-description">
                    Identificación y características principales.
                  </div>

                </section>


                <div className="form-grid">

                  {/* CÓDIGO */}

                  <div className="form-field">

                    <label htmlFor="codigo">
                      Código *
                    </label>

                    <input
                      id="codigo"
                      type="text"
                      value={formulario.codigo}
                      placeholder="Ej. PRD-002"
                      onChange={(e) =>
                        cambiarCampo(
                          'codigo',
                          e.target.value
                        )
                      }
                    />

                  </div>


                  {/* NOMBRE */}

                  <div className="form-field">

                    <label htmlFor="nombre">
                      Nombre *
                    </label>

                    <input
                      id="nombre"
                      type="text"
                      value={formulario.nombre}
                      placeholder="Ej. Labial Matte"
                      onChange={(e) =>
                        cambiarCampo(
                          'nombre',
                          e.target.value
                        )
                      }
                    />

                  </div>


                  {/* CATEGORÍA */}

                  <div className="form-field">

                    <label htmlFor="categoria">
                      Categoría *
                    </label>

                    <select
                      id="categoria"
                      value={formulario.categoria}
                      onChange={(e) =>
                        cambiarCampo(
                          'categoria',
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Seleccionar categoría
                      </option>

                      <option value="Maquillaje">
                        Maquillaje
                      </option>

                      <option value="Perfumería">
                        Perfumería
                      </option>

                      <option value="Cuidado facial">
                        Cuidado facial
                      </option>

                      <option value="Cuidado corporal">
                        Cuidado corporal
                      </option>

                      <option value="Accesorios">
                        Accesorios
                      </option>

                    </select>

                  </div>


                  {/* TONO */}

                  <div className="form-field">

                    <label htmlFor="tono">
                      Tono
                    </label>

                    <input
                      id="tono"
                      type="text"
                      value={formulario.tono}
                      placeholder="Ej. Beige 03"
                      onChange={(e) =>
                        cambiarCampo(
                          'tono',
                          e.target.value
                        )
                      }
                    />

                  </div>


                  {/* DESCRIPCIÓN */}

                  <div className="form-field form-field-full">

                    <label htmlFor="descripcion">
                      Descripción
                    </label>

                    <textarea
                      id="descripcion"
                      value={formulario.descripcion}
                      placeholder="Descripción del producto..."
                      onChange={(e) =>
                        cambiarCampo(
                          'descripcion',
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                {/* ==================================
                    INVENTARIO
                    ================================== */}

                <section className="form-section inventory-section">

                  <div className="form-section-title">
                    Inventario y precios
                  </div>

                  <div className="form-section-description">
                    Control de costos y existencias.
                  </div>

                </section>


                <div className="form-grid">

                  {/* PRECIO COMPRA */}

                  <div className="form-field">

                    <label htmlFor="precioCompra">
                      Precio de compra *
                    </label>

                    <input
                      id="precioCompra"
                      type="number"
                      min="0"
                      value={formulario.precioCompra}
                      placeholder="Ej. 35000"
                      onChange={(e) =>
                        cambiarCampo(
                          'precioCompra',
                          Number(e.target.value) || 0
                        )
                      }
                    />

                  </div>


                  {/* PRECIO VENTA */}

                  <div className="form-field">

                    <label htmlFor="precioVenta">
                      Precio de venta *
                    </label>

                    <input
                      id="precioVenta"
                      type="number"
                      min="0"
                      value={formulario.precioVenta}
                      placeholder="Ej. 52000"
                      onChange={(e) =>
                        cambiarCampo(
                          'precioVenta',
                          Number(e.target.value) || 0
                        )
                      }
                    />

                  </div>


                  {/* STOCK */}

                  <div className="form-field">

                    <label htmlFor="stock">
                      Stock *
                    </label>

                    <input
                      id="stock"
                      type="number"
                      min="0"
                      value={formulario.stock}
                      placeholder="Ej. 20"
                      onChange={(e) =>
                        cambiarCampo(
                          'stock',
                          Number(e.target.value) || 0
                        )
                      }
                    />

                  </div>


                  {/* STOCK MÍNIMO */}

                  <div className="form-field">

                    <label htmlFor="stockMinimo">
                      Stock mínimo *
                    </label>

                    <input
                      id="stockMinimo"
                      type="number"
                      min="0"
                      value={formulario.stockMinimo}
                      placeholder="Ej. 5"
                      onChange={(e) =>
                        cambiarCampo(
                          'stockMinimo',
                          Number(e.target.value) || 0
                        )
                      }
                    />

                  </div>

                </div>


                {/* ==================================
                    IMAGEN DEL PRODUCTO
                    ================================== */}

                <section className="form-section image-section">

                  <div className="form-section-title">
                    Imagen del producto
                  </div>

                  <div className="form-section-description">
                    Agrega una imagen para mostrar el producto en el catálogo.
                  </div>

                </section>


                <div className="form-field">

                  <label>
                    Imagen
                  </label>


                  <div className="inventario-upload">

                    {/* INPUT REAL OCULTO */}

                    <input
                      id="imagen-producto"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="inventario-file-input"
                      onChange={seleccionarImagen}
                    />


                    {/* ==================================
                        SIN IMAGEN
                        ================================== */}

                    {!previewImagen ? (

                      <div className="inventario-upload-box">

                        <div className="inventario-upload-icon">

                          <svg
                            width="34"
                            height="34"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >

                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                            />

                            <circle
                              cx="8.5"
                              cy="8.5"
                              r="1.5"
                            />

                            <path
                              d="M21 15l-5-5L5 21"
                            />

                          </svg>

                        </div>


                        <div className="inventario-upload-title">
                          Agrega una imagen
                        </div>


                        <div className="inventario-upload-description">
                          JPG, PNG o WEBP · Máximo 5 MB
                        </div>


                        <button
                          type="button"
                          className="inventario-upload-button"
                          onClick={() => {
                            document
                              .getElementById(
                                'imagen-producto'
                              )
                              ?.click();
                          }}
                        >
                          Seleccionar imagen
                        </button>

                      </div>

                    ) : (


                      /* ==================================
                          CON IMAGEN
                          ================================== */

                      <div className="inventario-image-preview">

                        <div className="inventario-image-preview-container">

                          <img
                            src={previewImagen}
                            alt="Vista previa del producto"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                'none';
                            }}
                          />

                        </div>


                        <div className="inventario-image-info">

                          <span className="inventario-image-selected">
                            {archivoImagen
                              ? 'Nueva imagen seleccionada'
                              : 'Imagen actual'}
                          </span>


                          <span className="inventario-image-name">

                            {archivoImagen
                              ? archivoImagen.name
                              : 'Imagen guardada del producto'}

                          </span>


                          <div className="inventario-image-actions">

                            <button
                              type="button"
                              className="inventario-image-change"
                              onClick={cambiarImagen}
                            >
                              Cambiar imagen
                            </button>


                            <button
                              type="button"
                              className="inventario-image-remove"
                              onClick={eliminarImagen}
                            >
                              Eliminar
                            </button>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                </div>


                {/* ==================================
                    ERROR
                    ================================== */}

                {mensajeFormulario && (

                  <div className="form-error">
                    {mensajeFormulario}
                  </div>

                )}


                {/* ==================================
                    ACCIONES
                    ================================== */}

                <div className="form-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={cerrarFormulario}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>


                  <button
                    type="button"
                    className="primary-button"
                    onClick={guardarProducto}
                    disabled={guardando}
                  >

                    {guardando
                      ? 'Guardando...'
                      : productoEditando
                        ? 'Guardar cambios'
                        : 'Registrar producto'}

                  </button>

                </div>

              </div>

            </aside>

          </>

        )}

      </IonContent>

    </IonPage>
  );
};

export default Inventario;