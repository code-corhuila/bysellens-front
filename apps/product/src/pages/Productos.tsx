import { imagenProducto } from '@bysellens/frontend-core/configuracion';
import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  IonContent,
  IonPage
} from '@ionic/react';

import {
  obtenerProductos,
  actualizarStock,
  Producto
} from '../services/productoService';

import './Productos.css';

/* =========================================================
   URL DE IMÁGENES DEL BACKEND
   ========================================================= */




const Productos: React.FC = () => {

  // =====================================================
  // DATOS
  // =====================================================

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState('');


  // =====================================================
  // FILTROS
  // =====================================================

  const [busqueda, setBusqueda] =
    useState('');

  const [categoria, setCategoria] =
    useState('Todas');

  const [stockFiltro, setStockFiltro] =
    useState('Todos');

  const [precioFiltro, setPrecioFiltro] =
    useState('Todos');


  // =====================================================
  // PANEL ACTUALIZAR EXISTENCIAS
  // =====================================================

  const [mostrarAjuste, setMostrarAjuste] =
    useState(false);

  const [productoAjuste, setProductoAjuste] =
    useState<Producto | null>(null);

  const [cantidadAjuste, setCantidadAjuste] =
    useState(1);

  const [motivoAjuste, setMotivoAjuste] =
    useState('Reabastecimiento');

  const [guardandoAjuste, setGuardandoAjuste] =
    useState(false);


  // =====================================================
  // CARGAR PRODUCTOS
  // =====================================================

  const cargarProductos = async () => {

    try {

      setCargando(true);
      setError('');

      const data =
        await obtenerProductos();

      setProductos(data);

    } catch (err) {

      console.error(
        'Error al cargar productos:',
        err
      );

      setError(
        'No fue posible conectar con el backend.'
      );

    } finally {

      setCargando(false);

    }

  };


  useEffect(() => {

    cargarProductos();

  }, []);


  // =====================================================
  // CATEGORÍAS
  // =====================================================

  const categorias = useMemo(() => {

    const lista = productos
      .map(producto => producto.categoria)
      .filter(Boolean);

    return [
      'Todas',
      ...Array.from(new Set(lista))
    ];

  }, [productos]);


  // =====================================================
  // FILTRAR Y ORDENAR
  // =====================================================

  const productosFiltrados = useMemo(() => {

    const texto =
      busqueda
        .toLowerCase()
        .trim();

    const resultado =
      productos.filter(
        producto => {

          const nombre =
            producto.nombre?.toLowerCase() || '';

          const codigo =
            producto.codigo?.toLowerCase() || '';

          const categoriaProducto =
            producto.categoria?.toLowerCase() || '';

          const coincideBusqueda =
            nombre.includes(texto) ||
            codigo.includes(texto) ||
            categoriaProducto.includes(texto);

          const coincideCategoria =
            categoria === 'Todas' ||
            producto.categoria === categoria;

          let coincideStock = true;

          if (stockFiltro === 'Disponibles') {

            coincideStock =
              producto.stock >
              producto.stockMinimo;

          }

          if (stockFiltro === 'Bajo stock') {

            coincideStock =
              producto.stock > 0 &&
              producto.stock <= producto.stockMinimo;

          }

          if (stockFiltro === 'Agotados') {

            coincideStock =
              producto.stock === 0;

          }

          return (
            coincideBusqueda &&
            coincideCategoria &&
            coincideStock
          );

        }
      );


    // ===================================================
    // ORDENAR POR PRECIO
    // ===================================================

    if (precioFiltro === 'Mayor') {

      return [...resultado].sort(
        (a, b) =>
          Number(b.precioVenta || 0) -
          Number(a.precioVenta || 0)
      );

    }


    if (precioFiltro === 'Menor') {

      return [...resultado].sort(
        (a, b) =>
          Number(a.precioVenta || 0) -
          Number(b.precioVenta || 0)
      );

    }


    return resultado;

  }, [
    productos,
    busqueda,
    categoria,
    stockFiltro,
    precioFiltro
  ]);


  // =====================================================
  // ESTADÍSTICAS
  // =====================================================

  const totalProductos =
    productos.length;

  const bajoStock =
    productos.filter(
      producto =>
        producto.stock > 0 &&
        producto.stock <= producto.stockMinimo
    ).length;

  const unidadesTotales =
    productos.reduce(
      (total, producto) =>
        total +
        Number(producto.stock || 0),
      0
    );

  const valorInventario =
    productos.reduce(
      (total, producto) =>
        total +
        Number(producto.precioVenta || 0) *
        Number(producto.stock || 0),
      0
    );


  // =====================================================
  // MONEDA
  // =====================================================

  const moneda = (valor: number) => {

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
  // ABRIR PANEL
  // =====================================================

  const abrirPanelAjuste = () => {

    setProductoAjuste(null);
    setCantidadAjuste(1);
    setMotivoAjuste('Reabastecimiento');
    setMostrarAjuste(true);

  };


  // =====================================================
  // CERRAR PANEL
  // =====================================================

  const cerrarPanelAjuste = () => {

    if (guardandoAjuste) {
      return;
    }

    setMostrarAjuste(false);
    setProductoAjuste(null);
    setCantidadAjuste(1);
    setMotivoAjuste('Reabastecimiento');

  };


  // =====================================================
  // APLICAR AJUSTE REAL
  // =====================================================

  const aplicarAjuste = async () => {

    if (!productoAjuste) {

      alert(
        'Selecciona un producto.'
      );

      return;
    }


    if (cantidadAjuste <= 0) {

      alert(
        'La cantidad debe ser mayor que cero.'
      );

      return;
    }


    try {

      setGuardandoAjuste(true);

      const nuevoStock =
        Number(productoAjuste.stock) +
        Number(cantidadAjuste);


      await actualizarStock(
        productoAjuste.id,
        nuevoStock
      );


      // =================================================
      // ACTUALIZAR TABLA INMEDIATAMENTE
      // =================================================

      setProductos(
        productosActuales =>
          productosActuales.map(producto =>
            producto.id === productoAjuste.id
              ? {
                  ...producto,
                  stock: nuevoStock
                }
              : producto
          )
      );


      alert(
        `Se agregaron ${cantidadAjuste} unidades a ${productoAjuste.nombre}.`
      );


      cerrarPanelAjuste();

    } catch (err) {

      console.error(
        'Error actualizando stock:',
        err
      );

      alert(
        'No fue posible actualizar el stock.'
      );

    } finally {

      setGuardandoAjuste(false);

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <IonPage>

      <IonContent className="productos-content">

        <div className="productos-page">

          <div className="productos-container">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="productos-header">

              <div className="productos-header-info">

                <span className="productos-kicker">
                  PÉTALOS ADMIN
                </span>

                <h1 className="productos-title">
                  Catálogo de Productos
                </h1>

                <p className="productos-description">
                  Consulta y controla los productos,
                  precios y existencias de tu tienda.
                </p>

              </div>


              <button
                className="productos-main-button"
                onClick={abrirPanelAjuste}
              >

                <span>+</span>

                Actualizar Existencias

              </button>

            </header>


            {/* =================================================
                FILTROS
            ================================================= */}

            <section className="productos-filters">

              <div className="productos-search-wrapper">

                <span className="productos-search-icon">
                  ⌕
                </span>

                <input
                  className="productos-search"
                  type="text"
                  placeholder="Buscar cosméticos..."
                  value={busqueda}
                  onChange={e =>
                    setBusqueda(e.target.value)
                  }
                />

              </div>


              <select
                className="productos-select"
                value={categoria}
                onChange={e =>
                  setCategoria(e.target.value)
                }
              >

                {categorias.map(cat => (

                  <option
                    key={cat}
                    value={cat}
                  >

                    {cat === 'Todas'
                      ? 'Categoría: Todas'
                      : cat}

                  </option>

                ))}

              </select>


              <select
                className="productos-select"
                value={precioFiltro}
                onChange={e =>
                  setPrecioFiltro(e.target.value)
                }
              >

                <option value="Todos">
                  Precio: Alto-Bajo
                </option>

                <option value="Mayor">
                  Mayor precio
                </option>

                <option value="Menor">
                  Menor precio
                </option>

              </select>


              <select
                className="productos-select"
                value={stockFiltro}
                onChange={e =>
                  setStockFiltro(e.target.value)
                }
              >

                <option value="Todos">
                  Stock: Todos
                </option>

                <option value="Disponibles">
                  Disponibles
                </option>

                <option value="Bajo stock">
                  Bajo stock
                </option>

                <option value="Agotados">
                  Agotados
                </option>

              </select>

            </section>


            {/* =================================================
                ESTADÍSTICAS
            ================================================= */}

            <section className="productos-stats">

              <div className="productos-stat">

                <div className="productos-stat-top">

                  <span>
                    Total Productos
                  </span>

                  <span className="productos-stat-icon">
                    ◇
                  </span>

                </div>

                <strong className="productos-stat-value">
                  {totalProductos}
                </strong>

              </div>


              <div className="productos-stat">

                <div className="productos-stat-top">

                  <span>
                    Bajo Stock
                  </span>

                  <span className="productos-stat-icon">
                    △
                  </span>

                </div>

                <strong className="productos-stat-value">
                  {bajoStock}
                </strong>

              </div>


              <div className="productos-stat">

                <div className="productos-stat-top">

                  <span>
                    Valor Inventario
                  </span>

                  <span className="productos-stat-icon">
                    ◇
                  </span>

                </div>

                <strong className="productos-stat-value productos-stat-money">
                  {moneda(valorInventario)}
                </strong>

              </div>


              <div className="productos-stat">

                <div className="productos-stat-top">

                  <span>
                    Unidades
                  </span>

                  <span className="productos-stat-icon">
                    ◫
                  </span>

                </div>

                <strong className="productos-stat-value">
                  {unidadesTotales}
                </strong>

              </div>

            </section>


            {/* =================================================
                TABLA
            ================================================= */}

            <section className="productos-card">

              <div className="productos-card-header">

                <div>

                  <h2>
                    Productos
                  </h2>

                  <p>
                    {productosFiltrados.length}{' '}
                    productos registrados
                  </p>

                </div>


                <button
                  className="productos-refresh"
                  onClick={cargarProductos}
                >

                  ↻&nbsp; Actualizar

                </button>

              </div>


              {cargando && (

                <div className="productos-message">
                  Cargando productos...
                </div>

              )}


              {error && (

                <div className="productos-message productos-error">
                  {error}
                </div>

              )}


              {!cargando &&
                !error && (

                  <div className="productos-table-container">

                    <table className="productos-table">

                      <thead>

                        <tr>

                          <th>Imagen</th>
                          <th>Nombre</th>
                          <th>Código</th>
                          <th>Categoría</th>
                          <th>Tono</th>
                          <th>Precio compra</th>
                          <th>Precio venta</th>
                          <th>Stock</th>
                          <th>Estado</th>

                        </tr>

                      </thead>


                      <tbody>

                        {productosFiltrados.map(
                          producto => (

                            <tr
                              key={producto.id}
                            >


                              {/* =================================================
                                  IMAGEN DEL PRODUCTO
                              ================================================= */}

                              <td>

                                <div className="productos-image">

                                  {producto.imagen ? (

                                    <img
                                      src={imagenProducto(producto.imagen)}
                                      alt={producto.nombre}
                                      onError={e => {
                                        e.currentTarget.style.display =
                                          'none';
                                      }}
                                    />

                                  ) : (

                                    <span>
                                      ✦
                                    </span>

                                  )}

                                </div>

                              </td>


                              {/* NOMBRE */}

                              <td>

                                <strong>
                                  {producto.nombre}
                                </strong>

                              </td>


                              {/* CÓDIGO */}

                              <td>

                                {producto.codigo}

                              </td>


                              {/* CATEGORÍA */}

                              <td>

                                <span className="productos-category">
                                  {producto.categoria}
                                </span>

                              </td>


                              {/* TONO */}

                              <td>

                                {producto.tono || '—'}

                              </td>


                              {/* PRECIO COMPRA */}

                              <td>

                                {moneda(
                                  Number(
                                    producto.precioCompra
                                  )
                                )}

                              </td>


                              {/* PRECIO VENTA */}

                              <td>

                                <strong>

                                  {moneda(
                                    Number(
                                      producto.precioVenta
                                    )
                                  )}

                                </strong>

                              </td>


                              {/* STOCK */}

                              <td>

                                <span
                                  className={
                                    producto.stock === 0
                                      ? 'productos-stock empty'
                                      : producto.stock <=
                                        producto.stockMinimo
                                      ? 'productos-stock low'
                                      : 'productos-stock'
                                  }
                                >

                                  {producto.stock}

                                </span>

                              </td>


                              {/* ESTADO */}

                              <td>

                                <span
                                  className={
                                    producto.activo
                                      ? 'productos-status active'
                                      : 'productos-status inactive'
                                  }
                                >

                                  {producto.activo
                                    ? 'Activo'
                                    : 'Inactivo'}

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
                productosFiltrados.length === 0 && (

                  <div className="productos-message">

                    No se encontraron productos
                    con los filtros seleccionados.

                  </div>

                )}

            </section>

          </div>

        </div>


        {/* =====================================================
            PANEL ACTUALIZAR EXISTENCIAS
        ===================================================== */}

        {mostrarAjuste && (

          <>

            <div
              className="ajuste-overlay"
              onClick={cerrarPanelAjuste}
            />


            <aside className="ajuste-panel">


              {/* HEADER */}

              <div className="ajuste-panel-header">

                <div>

                  <span className="ajuste-kicker">
                    INVENTARIO
                  </span>

                  <h2>
                    Actualizar Existencias
                  </h2>

                  <p>
                    Ajusta rápidamente la cantidad
                    disponible de un producto.
                  </p>

                </div>


                <button
                  className="ajuste-close"
                  onClick={cerrarPanelAjuste}
                  disabled={guardandoAjuste}
                  aria-label="Cerrar"
                >
                  ×
                </button>

              </div>


              {/* FORMULARIO */}

              <div className="ajuste-form">


                {/* PRODUCTO */}

                <div className="ajuste-field">

                  <label>
                    Seleccionar producto
                  </label>

                  <select
                    value={
                      productoAjuste?.id ?? ''
                    }
                    onChange={e => {

                      const id =
                        Number(
                          e.target.value
                        );

                      const seleccionado =
                        productos.find(
                          producto =>
                            producto.id === id
                        ) || null;

                      setProductoAjuste(
                        seleccionado
                      );

                    }}
                  >

                    <option value="">
                      Seleccionar producto
                    </option>


                    {productos.map(
                      producto => (

                        <option
                          key={producto.id}
                          value={producto.id}
                        >

                          {producto.nombre}
                          {' — '}
                          {producto.codigo}

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* =================================================
                    PREVIEW DEL PRODUCTO
                ================================================= */}

                {productoAjuste && (

                  <div className="ajuste-producto-preview">


                    <div className="ajuste-producto-image">

                      {productoAjuste.imagen ? (

                        <img
                          src={imagenProducto(productoAjuste.imagen)}
                          alt={productoAjuste.nombre}
                          onError={e => {
                            e.currentTarget.style.display =
                              'none';
                          }}
                        />

                      ) : (

                        <span>
                          ✦
                        </span>

                      )}

                    </div>


                    <div className="ajuste-producto-info">

                      <strong>
                        {productoAjuste.nombre}
                      </strong>

                      <span>
                        Código: {productoAjuste.codigo}
                      </span>

                      <span>
                        Stock actual:{' '}

                        <b>
                          {productoAjuste.stock}
                        </b>{' '}

                        unidades
                      </span>

                    </div>

                  </div>

                )}


                {/* =================================================
                    CANTIDAD
                ================================================= */}

                <div className="ajuste-field">

                  <label>
                    Cantidad a agregar
                  </label>

                  <div className="ajuste-counter">

                    <button
                      type="button"
                      onClick={() =>
                        setCantidadAjuste(
                          Math.max(
                            1,
                            cantidadAjuste - 1
                          )
                        )
                      }
                      disabled={
                        guardandoAjuste
                      }
                    >
                      −
                    </button>


                    <div>
                      +{cantidadAjuste}
                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        setCantidadAjuste(
                          cantidadAjuste + 1
                        )
                      }
                      disabled={
                        guardandoAjuste
                      }
                    >
                      +
                    </button>

                  </div>

                </div>


                {/* =================================================
                    MOTIVO
                ================================================= */}

                <div className="ajuste-field">

                  <label>
                    Motivo del ajuste
                  </label>

                  <select
                    value={motivoAjuste}
                    onChange={e =>
                      setMotivoAjuste(
                        e.target.value
                      )
                    }
                    disabled={guardandoAjuste}
                  >

                    <option value="Reabastecimiento">
                      Reabastecimiento
                    </option>

                    <option value="Corrección de inventario">
                      Corrección de inventario
                    </option>

                    <option value="Devolución">
                      Devolución
                    </option>

                    <option value="Ingreso de mercancía">
                      Ingreso de mercancía
                    </option>

                  </select>

                </div>


                {/* =================================================
                    RESUMEN
                ================================================= */}

                {productoAjuste && (

                  <div className="ajuste-resumen">

                    <div>

                      <span>
                        Stock actual
                      </span>

                      <strong>
                        {productoAjuste.stock}
                      </strong>

                    </div>


                    <span className="ajuste-resumen-sign">
                      +
                    </span>


                    <div>

                      <span>
                        Ajuste
                      </span>

                      <strong>
                        {cantidadAjuste}
                      </strong>

                    </div>


                    <span className="ajuste-resumen-sign">
                      =
                    </span>


                    <div>

                      <span>
                        Nuevo stock
                      </span>

                      <strong className="nuevo-stock">
                        {productoAjuste.stock +
                          cantidadAjuste}
                      </strong>

                    </div>

                  </div>

                )}

              </div>


              {/* =================================================
                  ACCIONES
              ================================================= */}

              <div className="ajuste-actions">

                <button
                  className="ajuste-primary"
                  onClick={aplicarAjuste}
                  disabled={
                    !productoAjuste ||
                    guardandoAjuste
                  }
                >

                  {guardandoAjuste
                    ? 'Guardando...'
                    : 'Aplicar Ajuste'}

                </button>


                <button
                  className="ajuste-secondary"
                  onClick={cerrarPanelAjuste}
                  disabled={guardandoAjuste}
                >

                  Cancelar

                </button>

              </div>

            </aside>

          </>

        )}

      </IonContent>

    </IonPage>

  );

};


export default Productos;