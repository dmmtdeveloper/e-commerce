// app/products/[id]/page.tsx
"use client";
import MainLayout from "@/app/layouts/MainLayout";
import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa"; // Importar los íconos

import useCartStore from "@/store/cartStore";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const fetchProductDetails = async (id: string): Promise<Product | null> => {
  try {
    const response = await axios.get(
      `https://proyectosocius-hnfjbhheebgefpc7.eastus2-01.azurewebsites.net/api/Productos/${id}`,
      {
        headers: {
          accept: "text/plain",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

export default function ProductDetailPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await fetchProductDetails(params.id);
      if (data) setProduct(data);
      else notFound();
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.productoId,
        name: product.nombre,
        quantity,
      });
    }
  };

  const handleIncreaseQuantity = () => setQuantity((qty) => qty + 1);
  const handleDecreaseQuantity = () =>
    setQuantity((qty) => Math.max(qty - 1, 1));

  if (!product) {
    return null; // Opcional: Manejo de estado de carga o error
  }

  return (
    <MainLayout>
      <section className="mt-10 p-4">
        <h1 className="text-3xl font-bold">{product.nombre}</h1>
        <p className="text-lg text-gray-600">{product.descripcion}</p>
        <p className="text-xl font-semibold mt-4">Precio: ${product.precio}</p>

        {/* Controles de cantidad */}
        <div className="flex items-center mt-4">
          <button
            onClick={handleDecreaseQuantity}
            className="p-2 bg-gray-200 rounded"
          >
            <FaMinus />
          </button>
          <span className="mx-4 text-lg">{quantity}</span>
          <button
            onClick={handleIncreaseQuantity}
            className="p-2 bg-gray-200 rounded"
          >
            <FaPlus />
          </button>
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white p-2 mt-4"
        >
          Agregar al carrito
        </button>
      </section>
    </MainLayout>
  );
}
