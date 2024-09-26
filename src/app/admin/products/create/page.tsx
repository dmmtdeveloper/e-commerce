"use client";

import { useState } from 'react';
import axios from 'axios';
import { Product } from '@/types/product';
import { AddProducto } from '@/utils/authHelpers';
import MainLayout from "../../../layouts/MainLayout"; // Asegúrate de que la ruta sea correcta
import NavAdmin from "@/components/shared/NavAdmin"; // Asegúrate de que la ruta sea correcta
import Link from 'next/link';
import { useRouter } from "next/navigation";

const CrearProducto = () => {
  const [producto, setProducto] = useState<Product>({
    productoId: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    stockReservado: 0,
    habilitado: true,
    eliminado: false,
    foto: '',
  });

  const router = useRouter(); // Inicializa el router para la redirección

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' || name === 'stockReservado'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Llama a AddProducto con los datos del producto
      await AddProducto(
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.stockReservado,
        producto.habilitado,
        producto.eliminado,
        producto.foto
      );

      // Redirige a la página de productos
      router.push("/admin/products");
    } catch (error) {
      let errorMessage = "Error desconocido al crear el producto.";

      if (axios.isAxiosError(error)) {
        // Acceder a la respuesta de Axios
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert("Error al crear el producto: " + errorMessage);
      console.error("Error al crear el producto:", error);
    }
  };

  return (
    <MainLayout>
      <div className="relative mt-20">
        <NavAdmin className="pl-8 w-full z-50 bg-white shadow-md" />
        <section className="pt-8 p-4">
          <h1 className="font-semibold text-4xl mb-4">Crear Producto</h1>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
            <div className="mb-4">
              <label className="block mb-1">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Descripción:</label>
              <textarea
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Precio:</label>
              <input
                type="number"
                name="precio"
                value={producto.precio}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Stock:</label>
              <input
                type="number"
                name="stock"
                value={producto.stock}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Foto (URL):</label>
              <input
                type="text"
                name="foto"
                value={producto.foto}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                Crear Producto
              </button>
              <Link href="/admin/products">
                <button type="button" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </section>
      </div>
    </MainLayout>
  );
};

export default CrearProducto;
