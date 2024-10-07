import Link from "next/link";

// components/ModalProductId.tsx
interface ModalProps {
  product: {
    nombre: string;
    precio: number;
    quantity: number;
  };
  onClose: () => void;
  onContinueShopping: () => void;
  onGoToCart: () => void;
}

const formatCurrency = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ModalProductId = ({ product, onClose, onContinueShopping }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Producto agregado al carrito</h2>

        {/* Detalles del producto */}
        <div className="mb-4">
          <p className="text-lg font-semibold">{product.nombre}</p>
          <p className="text-lg">Cantidad: {product.quantity}</p>
          <p className="text-lg">Precio unitario: ${product.precio !== undefined && product.precio !== null
                        ? `${formatCurrency.format(product.precio)}`
                        : "N/A"}</p>
          <p className="text-lg font-bold">
            Total: ${formatCurrency.format(product.precio * product.quantity)}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-4">
          <button
            onClick={onContinueShopping}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Seguir comprando
          </button>
          <Link href={"/cart"}>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Ir al carrito
            </button>
          </Link>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ModalProductId;
