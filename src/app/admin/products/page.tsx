"use client";
import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import NavAdmin from "@/components/shared/NavAdmin";
import { GetProductos } from "@/utils/authHelpers";
import { Product } from "@/types/product";
import Link from "next/link";

export default function ProductsPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [filters, setFilters] = useState({
    nombre: "",
    descripcion: "",
  });

  // Estado para manejar el colapso del panel
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(true);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    GetProductos()
      .then((productos) => {
        setProductos(productos);
        setFilteredProductos(productos);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al obtener los productos");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const { nombre, descripcion } = filters;
    const filtered = productos.filter((producto) => {
      const matchesNombre = producto.nombre
        .toLowerCase()
        .includes(nombre.toLowerCase());
      const matchesDescripcion = producto.descripcion
        .toLowerCase()
        .includes(descripcion.toLowerCase());

      return matchesNombre && matchesDescripcion;
    });
    setFilteredProductos(filtered);
  }, [filters, productos]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Manejo del cambio de página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Manejo del cambio de elementos por página
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reiniciar a la primera página al cambiar el número de elementos por página
  };

  // Calcular los elementos a mostrar según la página y los filtros aplicados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = filteredProductos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MainLayout>
      <div className="relative mt-20">
        {/* Navbar */}
        <NavAdmin className="pl-8 w-full z-50 bg-white shadow-md" />

        <section className="pt-8 p-4">
          {/* Botón para Crear Producto */}
          <div className="mb-4 relative">
            <Link
              href="/admin/products/create"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 z-10"
            >
              Crear Producto
            </Link>
          </div>

          {/* Panel de Filtros */}
          <div className="bg-gray-100 p-4 border-b-2 border-gray-200 mb-4">
            <button
              className="text-blue-500 mb-4 block"
              onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            >
              {isPanelCollapsed ? "Mostrar Filtros" : "Ocultar Filtros"}
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                isPanelCollapsed ? "h-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
              }`}
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col flex-grow">
                  <label htmlFor="nombre">Buscar por Nombre:</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={filters.nombre}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                    placeholder="Nombre del producto"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <label htmlFor="descripcion">Buscar por Descripción:</label>
                  <input
                    id="descripcion"
                    name="descripcion"
                    type="text"
                    value={filters.descripcion}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                    placeholder="Descripción del producto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div>
            <h1 className="font-semibold text-4xl mb-4">Productos del Sistema</h1>
            <p className="mb-4">
              A continuación se muestra la lista de productos registrados en el
              sistema:
            </p>

            <table className="table-auto w-full border mb-6">
              <thead>
                <tr>
                  <th className="border p-2">Producto ID</th>
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">Descripción</th>
                  <th className="border p-2">Precio</th>
                  <th className="border p-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {currentProductos.map((producto) => (
                  <tr key={producto.productoId}>
                    <td className="border p-2">
                        <Link href={`/admin/products/${producto.productoId}`}>
                        {producto.productoId}
                        </Link>
                    </td>
                    <td className="border p-2">{producto.nombre}</td>
                    <td className="border p-2">{producto.descripcion}</td>
                    <td className="border p-2">{producto.precio}</td>
                    <td className="border p-2">{producto.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex items-center justify-between">
              <div>
                <span>Mostrar </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border p-2 rounded"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span> elementos por página</span>
              </div>
              <div>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 mx-1 ${
                        pageNumber === currentPage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      } rounded`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Padding final */}
          <div className="mt-8" style={{ paddingBottom: "30px" }}></div>
        </section>
      </div>
    </MainLayout>
  );
}
