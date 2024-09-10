// app/products/[id]/page.tsx
import { Product } from "@/types/product";
import axios from "axios";
import { notFound } from "next/navigation";

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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await fetchProductDetails(params.id);

  if (!product) {
    notFound(); // Muestra una página 404 si no se encuentra el producto
  }

  return (
    <section className="mt-10 p-4">
      <h1 className="text-3xl font-bold">{product.nombre}</h1>
      <p className="text-lg text-gray-600">{product.descripcion}</p>
      <p className="text-xl font-semibold mt-4">Precio: ${product.precio}</p>
      {/* Aquí podrías agregar más detalles del producto, como una imagen */}
      <button className="bg-blue-500 text-white p-2 mt-4">
        Agregar al carrito
      </button>
    </section>
  );
}
