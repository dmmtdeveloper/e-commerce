"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/components/shared/ProductCard";
import { Product } from "@/types/product"; // Importar el tipo Product

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); // Estado para almacenar productos

  // Consumir la API al cargar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://proyectosocius-hnfjbhheebgefpc7.eastus2-01.azurewebsites.net/api/Productos/habilitados",
          {
            headers: {
              accept: "text/plain",
            },
          }
        );

        // Almacenar los productos obtenidos en el estado
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, []); // Solo ejecuta al montar el componente

  return (
    <section className="mt-32 mb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.productoId} product={product} />
          ))
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>
    </section>
  );
}