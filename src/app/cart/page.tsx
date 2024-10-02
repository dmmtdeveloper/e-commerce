"use client";

import { useState } from "react";
import useCartStore from "@/store/cartStore"; // Importa el store del carrito
import Link from "next/link";
import MainLayout from "../layouts/MainLayout";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa"; // Importar los íconos
import ConfirmationModal from "@/components/ConfirmationModal"; // Importar el modal
import SuccessModal from "@/components/SuccessModal"; // Importa el modal de éxito
import { addPedido } from "@/utils/authHelpers";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore"; // Para obtener el token
import axios from "axios";
// import { AuthButton } from "@/components/buttons/AuthButton";
import { Input } from "@/components/input/InputPassword";
import { InputComponent } from "@/components/input/InputComponent";
import { login } from "../../utils/authHelpers";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import notebook from "@/public/assets/img/notebook.png";

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCartStore(); // Obtenemos los productos del carrito
  const [showRemoveModal, setShowRemoveModal] = useState(false); // Estado para mostrar el modal de eliminar
  const [showClearModal, setShowClearModal] = useState(false); // Estado para mostrar el modal de vaciar
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para mostrar el modal de éxito
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para mostrar el modal de login
  const [itemToRemove, setItemToRemove] = useState<string | null>(null); // ID del producto a eliminar
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { token } = useAuthStore(); // Obtener token de autenticación desde el store

  const handlePedido = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica si el usuario está autenticado
    if (!token) {
      setShowLoginModal(true); // Si no está autenticado, muestra el modal de inicio de sesión
      return;
    }

    const detallesPedido = items.map((item) => ({
      pedidoDetalleId: 0, // Ajusta este valor según sea necesario
      pedidoId: 0, // Ajusta este valor según sea necesario
      productoId: parseInt(item.id), // Asegúrate de que el id sea numérico
      cantidad: item.quantity,
      precio: item.price,
      precioTotal: item.quantity * item.price,
    }));

    try {
      await addPedido(token, 1, detallesPedido);
      alert("Pedido realizado con éxito");
      clearCart(); // Limpia el carrito después de crear el pedido
      router.push("/orders");
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

  // Mostrar contraseña al mantener presionado
  const handleMouseDown = () => {
    setShowPassword(true);
  };

  // Ocultar contraseña al soltar el botón del mouse
  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      setShowLoginModal(false); // Cierra el modal al iniciar sesión exitosamente
      alert("Login exitoso");
      router.push("/cart");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error en el login");
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

  const formatCurrency = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

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
              <li
                key={item.id}
                className="border p-4 mb-4 flex justify-between items-center"
              >
                <div className="flex">
                  <div className="relative w-50 h-50 overflow-hidden flex items-center justify-center mb-8">
                    <Image
                      className="w-48 h-auto"
                      width={260}
                      height={260} // Asegúrate de que la altura sea igual al ancho para mantener la proporción
                      src={
                        item.foto
                          ? `data:image/${item.extension};base64,${item.foto}`
                          : notebook
                      }
                      alt="items"
                      priority
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-sm">ID {item.id}</p>
                    <p className="text-sm text-gray-500">
                      Precio: $
                      {item.price !== undefined && item.price !== null
                        ? `${formatCurrency.format(item.price)}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleDecreaseQuantity(item.id, item.quantity)
                    }
                    className="p-2 bg-gray-200 rounded"
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-4 text-lg">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleIncreaseQuantity(item.id, item.quantity)
                    }
                    className="p-2 bg-gray-200 rounded"
                  >
                    <FaPlus />
                  </button>
                  {/* <span className="mx-4 text-lg">Precio Unitario: {item.price}</span> */}
                  <span className="mx-4 text-lg">
                    Precio Total: $
                    {item.totalPrice !== undefined && item.totalPrice !== null
                      ? `${formatCurrency.format(item.totalPrice)}`
                      : "N/A"}
                  </span>
                </div>
                <div className="p-10">
                  <FaTrashAlt
                    className="text-red-500 hover:text-red-700 text-2xl"
                    onClick={() => handleRemove(item.id)}
                  />
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
            <span className="font-bold">
              $
              {formatCurrency.format(
                items.reduce((acc, item) => acc + item.price * item.quantity, 0)
              )}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            El costo de envío se calculará al añadir la dirección.
          </p>
          <Link href="/">
            <button className="bg-green-500 text-white w-full py-2 rounded mb-2">
              Agregar más productos
            </button>
          </Link>
          <button
            onClick={handlePedido}
            className="bg-black text-white w-full py-2 rounded"
          >
            Crear Pedido
          </button>
        </div>
        {/* Botón para vaciar el carrito */}
        <button
          onClick={handleClearCart}
          className="bg-red-500 text-white w-full py-2 rounded mb-2"
        >
          Vaciar Carrito
        </button>
      </section>

      {/* Modal de inicio de sesión */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-center mb-4">
              Iniciar Sesión
            </h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Email:</label>
                <InputComponent
                  type="email"
                  value={email}
                  placeholder="Ingresa tu correo electrónico"
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
              </div>
              <div className="mb-4">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  name="password"
                />
              </div>
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none shadow-lg"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>

            <div className="flex flex-col items-center">
              <p className="text-sm">¿Eres nuevo?</p>
              <Link
                className="text-blue-500 hover:underline text-sm mt-1"
                href="/register"
              >
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      )}

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
