"use client";

import { useState } from "react";
import useCartStore from "@/store/cartStore"; // Importa el store del carrito
import Link from "next/link";
import MainLayout from "../layouts/MainLayout";
import { FaPlus, FaMinus } from "react-icons/fa"; // Importar los íconos
import ConfirmationModal from "@/components/ConfirmationModal"; // Importar el modal
import SuccessModal from "@/components/SuccessModal"; // Importa el modal de éxito
import { addPedido } from "@/utils/authHelpers";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore"; // Para obtener el token
import axios from "axios";

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCartStore(); // Obtenemos los productos del carrito
  const [showRemoveModal, setShowRemoveModal] = useState(false); // Estado para mostrar el modal de eliminar
  const [showClearModal, setShowClearModal] = useState(false); // Estado para mostrar el modal de vaciar
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para mostrar el modal de éxito
  const [itemToRemove, setItemToRemove] = useState<string | null>(null); // ID del producto a eliminar
  const router = useRouter();
  const { token } = useAuthStore(); // Obtener token de autenticación desde el store

  const handlePedido = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentDate = new Date().toISOString().split("T")[0]; // Obtener fecha actual en formato "YYYY-MM-DD"

    const detallesPedido = items.map((item) => ({
      pedidoDetalleId: 0, // Ajusta este valor según sea necesario
      pedidoId: 0, // Ajusta este valor según sea necesario
      productoId: parseInt(item.id), // Asegúrate de que el id sea numérico
      cantidad: item.quantity,
      precioTotal: item.quantity * 200, // Ajusta el precio total según la lógica de tu aplicación
    }));

    try {
      await addPedido(0, token, 1, 1, currentDate, false, detallesPedido);
      alert("Pedido Realizad con exito")
      // setShowSuccessModal(true); // Muestra el modal de éxito
      clearCart(); // Limpia el carrito después de crear el pedido
    } catch (error) {
      let errorMessage = "Error desconocido al crear el pedido.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert("Error al crear el pedido: " + errorMessage);
      console.error("Error al crear el pedido:", error);
    }
  };

  // Función para manejar la eliminación de un producto del carrito
  const handleRemove = (id: string) => {
    setItemToRemove(id);
    setShowRemoveModal(true);
  };

  // Función para confirmar la eliminación
  const confirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      setShowRemoveModal(false);
      setItemToRemove(null);
    }
  };

  // Función para cancelar la eliminación
  const cancelRemove = () => {
    setShowRemoveModal(false);
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
    setShowClearModal(true); // Muestra el modal de confirmación
  };

  // Función para confirmar vaciar el carrito
  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false); // Cierra el modal
  };

  // Función para cancelar el vaciado del carrito
  const cancelClearCart = () => {
    setShowClearModal(false); // Cierra el modal
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
      <section className="p-6 mt-32 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">Tu carrito de compras</h1>
          <ul>
            {items.map((item) => (
              <li key={item.id} className="border p-4 mb-4 flex justify-between items-center">
                <div className="flex">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 mr-4" />
                  <div>
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-sm">ID {item.id}</p>
                    <p className="text-sm text-gray-500">Precio: ${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button onClick={() => handleDecreaseQuantity(item.id, item.quantity)} className="p-2 bg-gray-200 rounded">
                    <FaMinus />
                  </button>
                  <span className="mx-4 text-lg">{item.quantity}</span>
                  <button onClick={() => handleIncreaseQuantity(item.id, item.quantity)} className="p-2 bg-gray-200 rounded">
                    <FaPlus />
                  </button>
                </div>
                <div>
                  <button onClick={() => handleRemove(item.id)} className="bg-red-500 text-white py-2 px-4 rounded">
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen de compra */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Resumen de tu compra</h2>
          <div className="mb-2 flex justify-between">
            <span>Total transferencia</span>
            <span className="font-bold">${items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            El costo de envío se calculará al añadir la dirección.
          </p>
          <Link href="/">
            <button className="bg-green-500 text-white w-full py-2 rounded mb-2">
              Agregar más productos
            </button>
          </Link>
          <button onClick={handlePedido} className="bg-black text-white w-full py-2 rounded">
            Crear Pedido
          </button>
        </div>
      </section>

      {/* Modal de confirmación para eliminar producto */}
      <ConfirmationModal
        isOpen={showRemoveModal}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        message="¿Estás seguro de que deseas eliminar este producto del carrito?"
      />

      {/* Modal de confirmación para vaciar el carrito */}
      <ConfirmationModal
        isOpen={showClearModal}
        onConfirm={confirmClearCart}
        onCancel={cancelClearCart}
        message="¿Estás seguro de que deseas vaciar el carrito?"
      />

      {/* Modal de éxito al crear pedido */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)} // Cierra el modal
        message="¡Pedido realizado con éxito!"
      />
    </MainLayout>
  );
}
