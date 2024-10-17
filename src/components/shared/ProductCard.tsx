import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import useCartStore from "@/store/cartStore";
import Modal from "@/components/modals/Modal"; // Asegúrate de importar el componente Modal
import Image from "next/image";
import noImage from "@/public/assets/img/no_image.jpg";
import { Reveal } from "@/components/animation/Reveal";
import ButtonShoppingComponent from "../buttons-components/button-shopping";
import clsx from "clsx";

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
      price: product.precio,
      totalPrice: product.precio,
      quantity: 1,
      foto: product.foto,
      extension: product.extension,
    });
    setIsModalOpen(true); // Abrir el modal después de agregar al carrito
  };

  const formatCurrency = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Función para cerrar el modal
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Reveal>
      <section
        className={clsx(
          "bg-slate-50 pb-5",
          "border-slate-200 border",
          "duration-300 cursor-pointer",
          "flex flex-col justify-between",
          "p-4 hover:shadow-xl",
          "rounded-3xl",
          "transition-shadow",
          "min-h-[450px]", // Altura mínima de la tarjeta para mantener el tamaño uniforme
          "h-[450px]" // Altura fija para todas las tarjetas
        )}
      >
        <Link
          href={`/products/${product.productoId}`}
          className="flex items-center justify-between flex-col"
        >
          <div
            className={clsx(
              "flex items-center",
              "justify-center mb-8",
              "overflow-hidden",
              "relative",
              "w-full h-48" // Tamaño fijo para el contenedor de la imagen
            )}
          >
            <Image
              className="object-cover w-100 h-auto" // Asegúrate de que la imagen mantenga la proporción correcta
              width={190}
              height={190}
              src={
                product.foto
                  ? `data:image/${product.extension};base64,${product.foto}`
                  : noImage
              }
              alt="items"
              priority
            />
          </div>
        </Link>
        <Link href={`/products/${product.productoId}`}>
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-semibold text-slate-900">
              {product.nombre}
            </h2>
            <p className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis">
              {product.descripcion.length > 10
                ? `${product.descripcion.substring(0, 37)}...`
                : product.descripcion}
            </p>

            <p className="text-md font-semibold mt-2 text-slate-600">
              {product.precio !== undefined && product.precio !== null
                ? `$${formatCurrency.format(product.precio)}`
                : "N/A"}
            </p>
            <p className="text-sm mt-2">
              Stock disponible: {product.stock - product.stockReservado}
            </p>
          </div>
        </Link>

        {product.stock - product.stockReservado > 0 ? (
          <ButtonShoppingComponent
            text="Agregar al carrito"
            onClick={handleAddToCart}
          />
        ) : (
          <div className="bg-gray-200 text-gray-500 p-2 mt-4 w-full rounded-xl text-center">
            No Disponible
          </div>
        )}

        {isModalOpen && <Modal product={product} onClose={handleCloseModal} />}
      </section>
    </Reveal>
  );
}
