import { Product } from "@/types/product";

interface ModalProps {
  product: Product;
  onClose: () => void; // Función para cerrar el modal
}

export default function Modal({ product, onClose }: ModalProps) {
  const handleGoToCart = () => {
    // Redirigir al carrito (esto depende de cómo manejes la ruta del carrito)
    window.location.href = "/cart";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Producto agregado al carrito</h2>
        <p className="mb-2">Has agregado <strong>{product.nombre}</strong> al carrito.</p>
        <p className="mb-4">Precio: ${product.precio}</p>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Seguir comprando
          </button>
          <button
            onClick={handleGoToCart}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Ir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
