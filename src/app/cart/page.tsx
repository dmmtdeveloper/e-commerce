"use client";

import { useState } from "react";
import useCartStore from "@/store/cartStore"; // Importa el store del carrito
import Link from "next/link";
import MainLayout from "../layouts/MainLayout";
import { FaPlus, FaMinus } from "react-icons/fa"; // Importar los íconos
import ConfirmationModal from "@/components/ConfirmationModal"; // Importar el modal

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCartStore(); // Obtenemos los productos del carrito
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [itemToRemove, setItemToRemove] = useState<string | null>(null); // ID del producto a eliminar

  // Función para manejar la eliminación de un producto del carrito
  const handleRemove = (id: string) => {
    setItemToRemove(id);
    setShowModal(true);
  };

  // Función para confirmar la eliminación
  const confirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      setShowModal(false);
      setItemToRemove(null);
    }
  };

  // Función para cancelar la eliminación
  const cancelRemove = () => {
    setShowModal(false);
    setItemToRemove(null);
  };

  // Función para manejar el incremento de la cantidad
  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    updateItemQuantity(id, currentQuantity + 1);
  };

  // Función para manejar la disminución de la cantidad
  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateItemQuantity(id, currentQuantity - 1);
    }
  };

  // Función para vaciar el carrito
  const handleClearCart = () => {
    clearCart();
  };

  // Si no hay productos en el carrito
  if (items.length === 0) {
    return (
      <MainLayout>
        <section className="p-6 mt-72 justify-center flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <Link href="/">
            <button className="bg-blue-500 text-white py-2 px-4 rounded">
              Volver a la tienda
            </button>
          </Link>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="p-6 mt-32">
        <h1 className="text-2xl font-bold mb-4">Tu carrito de compras</h1>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="border p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-bold">{item.name}</h2>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                    className="p-2 bg-gray-200 rounded"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-4 text-lg">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                    className="p-2 bg-gray-200 rounded"
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Vaciar carrito
          </button>
          <Link href="/checkout">
            <button className="bg-green-500 text-white py-2 px-4 rounded">
              Proceder al pago
            </button>
          </Link>
        </div>
      </section>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </MainLayout>
  );
}
