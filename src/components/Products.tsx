"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/shared/ProductCard";
import { Product } from "@/types/product"; // Importar el tipo Product
import axiosInstance from "@/utils/axiosInstance";
import { InputComponent } from "./input/InputComponent";
import { Reveal } from "@/animation/Reveal";
import Pagination from "./pagination-component/pagination-component";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); // Estado para almacenar productos
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [itemsPerPage, setItemsPerPage] = useState(10); // Estado para la cantidad de productos por página

  // Consumir la API al cargar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/Productos/habilitados", {
          headers: {
            accept: "text/plain",
          },
        });

        // Almacenar los productos obtenidos en el estado
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, []); // Solo ejecuta al montar el componente

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter((product) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      product.nombre.toLowerCase().includes(lowerCaseSearchTerm) || // Filtrar por nombre
      product.descripcion.toLowerCase().includes(lowerCaseSearchTerm) // Filtrar por descripción
    );
  });

  // Calcular los productos a mostrar en la página actual
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <Reveal>
      <section className="2xl:pt-24 pt-8 pb-32 bg-slate-100">
        <Reveal>
          <div className="p-4 mt-10 2xl:mt-0">
            <InputComponent
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              name="search"
            />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 xl:grid-cols-5 md:grid-cols-4 gap-4 p-4">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard key={product.productoId} product={product} />
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>

        {/* Controles de paginación */}
        <div className="flex items-center justify-center gap-5 mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          <select
            className="border p-2 rounded focus:outline-none text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value)); // Actualizar la cantidad de productos por página
              setCurrentPage(1); // Reiniciar a la primera página al cambiar la cantidad de productos por página
            }}
          >
            <option value={20}>20</option>
            <option value={10}>10</option>
            <option value={5}>5</option>
            <option value={2}>2</option>
          </select>
        </div>
      </section>
    </Reveal>
  );
}
