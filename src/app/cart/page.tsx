"use client";

import { useState } from "react";
import useCartStore from "@/store/cartStore"; // Importa el store del carrito
import Link from "next/link";
import MainLayout from "../../components/layouts/MainLayout";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa"; // Importar los íconos
import ConfirmationModal from "@/components/ConfirmationModal"; // Importar el modal
import SuccessModal from "@/components/SuccessModal"; // Importa el modal de éxito
import { addPedido } from "@/utils/authHelpers";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore"; // Para obtener el token
import axios from "axios";
// import { AuthButton } from "@/components/buttons/AuthButton";
import { InputPassword } from "@/components/input/InputPassword";
import { InputComponent } from "@/components/input/InputComponent";
import { login } from "../../utils/authHelpers";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import notebook from "@/public/assets/img/notebook.png";
import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import QuantityControl from "@/components/cart-component/quantity-control-component";
import { Title } from "@/components/title/Title";
import { IoHome } from "react-icons/io5";
import CartSummaryComponent from "@/components/cart-component/cart-summary-component";

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
      router.push("/cart");
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
        <section className="flex pt-64 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Title text="Tu carrito de está vacio" />

            <article className="flex gap-4">
              <Link href="/">
                <ButtonCtaComponent
                  className="bg-green-400 hover:bg-green-500 transition-all duration-300"
                  text="Volver a tienda"
                />
              </Link>
              <Link href={"/orders"}>
                <ButtonCtaComponent
                  className="bg-blue-400 hover:bg-blue-500 transition-all duration-300"
                  text="Ver mis pedidos"
                />
              </Link>
            </article>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="p-6 mt-24 2xl:px-24 lg:px-24 md:px-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <Link href={"/"} className="flex gap-2 items-center hover:underline font-light">
            <IoHome className="text-2xl" />
            <p>home</p>
          </Link>
          <Title className="mt-4 mb-10" text="Tu carrito de compras" />

          <ul className="border border-gray-300 border-x-0 border-b-0">
            {items.map((item) => (
              <section
                key={item.id}
                className="grid grid-cols-3 p-2 items-center text-center justify-center border border-gray-300 border-b-1 border-x-0 border-t-0"
              >
                <div className="flex items-center gap-8">
                  <div className="relative w-50 h-50 overflow-hidden flex items-center justify-center mb-8">
                    <Image
                      className="w-32 h-auto"
                      width={200}
                      height={200} // Asegúrate de que la altura sea igual al ancho para mantener la proporción
                      src={
                        item.foto
                          ? `data:image/${item.extension};base64,${item.foto}`
                          : notebook
                      }
                      alt="items"
                      priority
                    />
                  </div>

                  <div className="2xl:block hidden">
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      Precio: $
                      {item.price !== undefined && item.price !== null
                        ? `${formatCurrency.format(item.price)}`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* suma y resta de productos */}
                <QuantityControl
                  id={item.id}
                  quantity={item.quantity}
                  handleDecreaseQuantity={handleDecreaseQuantity}
                  handleIncreaseQuantity={handleIncreaseQuantity}
                  handleRemove={handleRemove}
                />

                <div className="font-semibold text-right">
                  <p className="font-light">Transferencia</p>$
                  {item.totalPrice !== undefined && item.totalPrice !== null
                    ? `${formatCurrency.format(item.totalPrice)}`
                    : "N/A"}
                </div>
              </section>
            ))}
          </ul>
        </div>
        {/* Resumen de compra */}
        <CartSummaryComponent
          items={items}
          formatCurrency={
            new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
            })
          }
          handlePedido={handlePedido}
        />

        {/* Botón para vaciar el carrito */}
        <button  className="text-left hover:underline" onClick={handleClearCart}>Vaciar Carrito</button>
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
                <InputPassword
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
                <ButtonCtaComponent
                  text="Cancelar"
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                  onClick={() => setShowLoginModal(false)}
                />
                <ButtonCtaComponent type="submit" text="Iniciar sesión" />
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
