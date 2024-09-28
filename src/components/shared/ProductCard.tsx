import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import useCartStore from "@/store/cartStore";
import Modal from "@/components/Modal"; // Asegúrate de importar el componente Modal
import Image from "next/image";
import notebook from "@/public/assets/img/notebook.jpg";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlineShoppingCart } from "react-icons/md";

interface ProductCardProps {
  product: Product;
}

interface ModalProps {
  product: Product;
  onClose: () => void; // Función para cerrar el modal
  onContinueShopping: () => void;
  onGoToCart: () => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore(); // Usamos el store del carrito
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  // Función para manejar agregar al carrito
  const handleAddToCart = () => {
    addItem({
      id: product.productoId.toString(),
      name: product.nombre,
      quantity: 1,
    });
    setIsModalOpen(true); // Abrir el modal después de agregar al carrito
  };

  // Función para cerrar el modal
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white pb-5 flex flex-col justify-between border p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-3xl">
      <Link
        href={`/products/${product.productoId}`}
        className="flex items-center justify-between flex-col"
      >
        <div className="relative w-40 h-40 overflow-hidden flex items-center justify-center mb-8">
          <Image
            className=""
            width={250}
            height={250} // Asegúrate de que la altura sea igual al ancho para mantener la proporción
            src={
              product.foto
                ? `data:image/${product.extension};base64,${product.foto}`
                : notebook
            }
            alt="items"
            priority
          />
        </div>
      </Link>
      <div className="flex flex-col items-start">
        <h2 className="text-lg mt-2">{product.nombre}</h2>
        <p className="text-sm text-gray-600">{product.descripcion}</p>
        <p className="text-md font-semibold mt-2">${product.precio}</p>
        <p className="text-sm mt-2">
          Stock disponible: {product.stock - product.stockReservado}
        </p>
      </div>

      {/* Botón para agregar al carrito */}

      {product.stock - product.stockReservado > 0 ? (
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-4 hover:bg-blue-700 transition-all bg-blue-600 text-white py-3 mt-4 w-full rounded-xl"
        >
          Agregar al carrito
          <MdOutlineShoppingCart className="text-2xl" />
        </button>
      ) : (
        <div className="bg-gray-200 text-gray-500 p-2 mt-4 w-full rounded-xl text-center">
          No Disponible
        </div>
      )}

      {/* Modal que aparece después de agregar al carrito */}
      {isModalOpen && <Modal product={product} onClose={handleCloseModal} />}
    </div>
  );
}
