"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { GetProductoById, UpdateProductoAll } from '@/utils/authHelpers'; 
import MainLayout from "../../../layouts/MainLayout"; 
import NavAdmin from "@/components/shared/NavAdmin"; 
import Link from 'next/link';
import axios from 'axios';

interface EditPageProps { 
  params: {
    id: string;
  };
}

const EditarProducto = ({ params }: EditPageProps) => {
  const router = useRouter();
  const [producto, setProducto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const productId = parseInt(params.id); // Convierte el ID a número
  const hasFetched = useRef(false); // Flag para controlar la llamada a la API

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await GetProductoById(productId);
        setProducto(data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(productId) && !hasFetched.current) { // Verifica que productId no sea NaN y que no se haya llamado antes
      hasFetched.current = true; // Marca como llamado
      fetchProducto();
    } else if (isNaN(productId)) {
      setLoading(false); // Si productId es inválido, setea loading a false
    }
  }, [productId]); // Solo productId como dependencia

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducto((prev) => (prev ? {
      ...prev,
      [name]: name === 'precio' || name === 'stock' || name === 'stockReservado'
        ? Number(value)
        : value,
    } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (producto) {
      try {
        // Llama a UpdateProducto con los datos del producto
        await UpdateProductoAll(producto);

        // Redirige a la página de productos
        router.push("/admin/products");
      } catch (error) {
        let errorMessage = "Error desconocido al actualizar el producto.";

        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        alert("Error al actualizar el producto: " + errorMessage);
        console.error("Error al actualizar el producto:", error);
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga
  }

  if (!producto) {
    return <div>No se encontró el producto.</div>; // Mostrar un mensaje si no se encuentra el producto
  }

  return (
    <MainLayout>
      <div className="relative mt-20">
        <NavAdmin className="pl-8 w-full z-50 bg-white shadow-md" />
        <section className="pt-8 p-4">
          <h1 className="font-semibold text-4xl mb-4">Editar Producto</h1>
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
                Actualizar Producto
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

export default EditarProducto;
