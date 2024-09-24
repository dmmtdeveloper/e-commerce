import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import useCartStore from "@/store/cartStore";
import Modal from "@/components/Modal"; // Asegúrate de importar el componente Modal
import Image from "next/image";
import notebook from "@/public/assets/img/notebook.jpg";

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
    <div className="border p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <Image
        className="w-56 h-auto"
        width={300}
        height={500}
        src={notebook}
        alt="items"
        priority
      />

      <Link href={`/products/${product.productoId}`}>
        <h2 className="text-lg font-bold mt-2">{product.nombre}</h2>
      </Link>
      <p className="text-sm text-gray-600">{product.descripcion}</p>
      <p className="text-md font-semibold mt-2">${product.precio}</p>

      {/* Botón para agregar al carrito */}
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white p-2 mt-4 w-full"
      >
        Agregar al carrito
      </button>

      {/* Modal que aparece después de agregar al carrito */}
      {isModalOpen && <Modal product={product} onClose={handleCloseModal} />}
    </div>
  );
}
