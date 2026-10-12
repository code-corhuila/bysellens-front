import { useEffect, useState } from 'react';

import {
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea
} from '@ionic/react';

import {
  Producto,
  ProductoRequest
} from '../services/productoService';

interface ProductoFormProps {
  producto: Producto | null;
  onGuardar: (producto: ProductoRequest) => void;
  onCancelar: () => void;
}

const ProductoForm: React.FC<ProductoFormProps> = ({
  producto,
  onGuardar,
  onCancelar
}) => {

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tono, setTono] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stock, setStock] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [imagen, setImagen] = useState('');
  const [activo, setActivo] = useState(true);

  useEffect(() => {

    if (producto) {

      setCodigo(producto.codigo || '');
      setNombre(producto.nombre || '');
      setDescripcion(producto.descripcion || '');
      setCategoria(producto.categoria || '');
      setTono(producto.tono || '');
      setPrecioCompra(
        String(producto.precioCompra ?? '')
      );
      setPrecioVenta(
        String(producto.precioVenta ?? '')
      );
      setStock(
        String(producto.stock ?? '')
      );
      setStockMinimo(
        String(producto.stockMinimo ?? '')
      );
      setImagen(producto.imagen || '');
      setActivo(producto.activo ?? true);

    } else {

      setCodigo('');
      setNombre('');
      setDescripcion('');
      setCategoria('');
      setTono('');
      setPrecioCompra('');
      setPrecioVenta('');
      setStock('');
      setStockMinimo('');
      setImagen('');
      setActivo(true);

    }

  }, [producto]);

  const guardar = () => {

    if (!codigo.trim()) {
      alert('El código es obligatorio');
      return;
    }

    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (!categoria.trim()) {
      alert('La categoría es obligatoria');
      return;
    }

    if (!precioCompra || Number(precioCompra) < 0) {
      alert('El precio de compra no es válido');
      return;
    }

    if (!precioVenta || Number(precioVenta) < 0) {
      alert('El precio de venta no es válido');
      return;
    }

    if (
      Number(precioVenta) <
      Number(precioCompra)
    ) {
      alert(
        'El precio de venta no puede ser menor que el precio de compra'
      );
      return;
    }

    if (!stock || Number(stock) < 0) {
      alert('El stock no es válido');
      return;
    }

    if (
      !stockMinimo ||
      Number(stockMinimo) < 0
    ) {
      alert('El stock mínimo no es válido');
      return;
    }

    const datos: ProductoRequest = {

      codigo: codigo.trim(),

      nombre: nombre.trim(),

      descripcion: descripcion.trim(),

      categoria: categoria.trim(),

      tono: tono.trim(),

      precioCompra: Number(precioCompra),

      precioVenta: Number(precioVenta),

      stock: Number(stock),

      stockMinimo: Number(stockMinimo),

     

      activo

    };

    onGuardar(datos);
  };

  return (

    <div className="form-container">

      <div className="form-header">

        <div>

          <span className="page-subtitle">
            PRODUCTOS
          </span>

          <h2>
            {producto
              ? 'Editar producto'
              : 'Nuevo producto'}
          </h2>

        </div>

      </div>

      <div className="form-grid">

        <IonItem>

          <IonLabel position="stacked">
            Código *
          </IonLabel>

          <IonInput
            value={codigo}
            placeholder="Ej: P001"
            onIonInput={(event) =>
              setCodigo(
                event.detail.value || ''
              )
            }
          />

        </IonItem>

        <IonItem>

          <IonLabel position="stacked">
            Nombre *
          </IonLabel>

          <IonInput
            value={nombre}
            placeholder="Nombre del producto"
            onIonInput={(event) =>
              setNombre(
                event.detail.value || ''
              )
            }
          />

        </IonItem>

        <IonItem>

          <IonLabel position="stacked">
            Categoría *
          </IonLabel>

          <IonInput
            value={categoria}
            placeholder="Ej: Labiales"
            onIonInput={(event) =>
              setCategoria(
                event.detail.value || ''
              )
            }
          />

        </IonItem>

        <IonItem>

          <IonLabel position="stacked">
            Tono
          </IonLabel>

          <IonInput
            value={tono}
            placeholder="Ej: Beige 03"
            onIonInput={(event) =>
              setTono(
                event.detail.value || ''
              )
            }
          />

        </IonItem>

        <IonItem>

          <IonLabel position="stacked">
            Precio de compra *
          </IonLabel>

          <IonInput
            type="number"
            value={precioCompra}
            placeholder="0"
            onIonInput={(event) =>
              setPrecioCompra(
                event.detail.value || ''
              )
            }
          />

        </IonItem>

        <IonItem>

          <IonLabel position="stacked">
            Precio de venta *
          </IonLabel>

          <IonInput
            type="number"
            value={precioVenta}
            placeholder="0"
            onIonInput={(event) =>
              setPrecioVenta(
                event.detail.value || ''
              )
            }
          />

        </IonItem>

        <IonItem>

          <IonLabel position="stacked">
            Stock *
          </IonLabel>

          <IonInput
            type="number"
            value={stock}
            placeholder="0"
            onIonInput={(event) =>
              setStock(
                event.detail.value || ''
              )
            }
          />

        </IonItem>

        <IonItem>

          <IonLabel position="stacked">
            Stock mínimo *
          </IonLabel>

          <IonInput
            type="number"
            value={stockMinimo}
            placeholder="0"
            onIonInput={(event) =>
              setStockMinimo(
                event.detail.value || ''
              )
            }
          />

        </IonItem>

      </div>

      <IonItem>

        <IonLabel position="stacked">
          Descripción
        </IonLabel>

        <IonTextarea
          value={descripcion}
          placeholder="Descripción del producto"
          rows={3}
          onIonInput={(event) =>
            setDescripcion(
              event.detail.value || ''
            )
          }
        />

      </IonItem>

      <IonItem>

        <IonLabel position="stacked">
          Imagen
        </IonLabel>

        <IonInput
          value={imagen}
          placeholder="Ej: base-liquida.jpg"
          onIonInput={(event) =>
            setImagen(
              event.detail.value || ''
            )
          }
        />

      </IonItem>

      <div className="form-actions">

        <button
          className="secondary-button"
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          className="primary-button"
          onClick={guardar}
        >
          {producto
            ? 'Actualizar producto'
            : 'Guardar producto'}
        </button>

      </div>

    </div>
  );
};

export default ProductoForm;