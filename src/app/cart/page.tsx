"use client";

import useCartStore from "@/store/cartStore"; // Importa el store del carrito
import Link from "next/link";
import MainLayout from "../layouts/MainLayout";

export default function CartPage() {
  const { items, removeItem } = useCartStore(); // Obtenemos los productos del carrito

  // Función para manejar la eliminación de un producto del carrito
  const handleRemove = (id: string) => {
    removeItem(id);
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
                <p>Cantidad: {item.quantity}</p>
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
        <Link href="/checkout">
          <button className="bg-green-500 text-white py-2 px-4 mt-4 rounded">
            Proceder al pago
          </button>
        </Link>
      </section>
    </MainLayout>
  );
}
