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
    <div className=" flex flex-col justify-between border p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <Link href={`/products/${product.productoId}`}>
        <Image
          className="w-56 h-auto"
          width={300}
          height={500}
          src={
            product.foto
              ? `data:image/${product.extension};base64,${product.foto}`
              : notebook
          }
          alt="items"
          priority
        />

        <h2 className="text-lg mt-2">{product.nombre}</h2>
        <p className="text-sm text-gray-600">{product.descripcion}</p>
        <p className="text-md font-semibold mt-2">${product.precio}</p>
      </Link>

      {/* Botón para agregar al carrito */}
      <button
        onClick={handleAddToCart}
        className="bg-blue-700 text-white p-2 mt-4 w-full rounded-xl"
      >
        Agregar al carrito
      </button>

      {/* Modal que aparece después de agregar al carrito */}
      {isModalOpen && <Modal product={product} onClose={handleCloseModal} />}
    </div>
  );
}
