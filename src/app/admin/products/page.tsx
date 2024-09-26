"use client";
import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import NavAdmin from "@/components/shared/NavAdmin";
import { GetProductos, UpdateHabilitadoProducto, UpdateEliminadoProducto } from "@/utils/authHelpers"; //
import { Product } from "@/types/product";
import Link from "next/link";

export default function ProductsPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<{
    productoId: number;
    field: "habilitado" | "eliminado";
    value: boolean;
  } | null>(null);

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
      const matchesNombre = producto.nombre.toLowerCase().includes(nombre.toLowerCase());
      const matchesDescripcion = producto.descripcion.toLowerCase().includes(descripcion.toLowerCase());

      return matchesNombre && matchesDescripcion;
    });
    setFilteredProductos(filtered);
  }, [filters, productos]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (productoId: number, field: "habilitado" | "eliminado", value: boolean) => {
    setCurrentAction({ productoId, field, value });
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!currentAction) return;
    const { productoId, field, value } = currentAction;

    try {
      if (field === "habilitado") {
        await UpdateHabilitadoProducto(productoId, value);
      } else if (field === "eliminado") {
        await UpdateEliminadoProducto(productoId, value);
      }

      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.productoId === productoId
            ? { ...producto, [field]: value }
            : producto
        )
      );
    } catch (error) {
      console.error(`Error actualizando ${field}:`, error);
    }

    setIsModalOpen(false);
    setCurrentAction(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentAction(null);
  };

  const ConfirmationModal = () => {
    if (!currentAction) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Confirmación</h2>
          <p>¿Estás seguro de que deseas cambiar este valor?</p>
          <div className="mt-4">
            <button onClick={handleConfirm} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
              Confirmar
            </button>
            <button onClick={handleCancel} className="bg-gray-300 py-2 px-4 rounded">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Calcular los elementos a mostrar según la página y los filtros aplicados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);

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
              className={`transition-opacity duration-300 ${
                isPanelCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
              }`}
            >
              <div className="mb-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Buscar por Nombre"
                  value={filters.nombre}
                  onChange={handleFilterChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Buscar por Descripción"
                  value={filters.descripcion}
                  onChange={handleFilterChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </div>

          {/* Tabla de Productos */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2">Precio</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Reservado</th>
                <th className="border p-2">Habilitado</th>
                <th className="border p-2">Eliminado</th>
              </tr>
            </thead>
            <tbody>
              {currentProductos.map((producto) => (
                <tr key={producto.productoId}>
                  <td className="border p-2">
                    {producto.eliminado ? (
                        <span>{producto.productoId}</span>
                    ) : (
                        <Link href={`/admin/products/${producto.productoId}`}>
                        {producto.productoId}
                        </Link>
                    )}
                  </td>
                  <td className="border-b p-2">{producto.nombre}</td>
                  <td className="border-b p-2">{producto.descripcion}</td>
                  <td className="border-b p-2">{producto.precio}</td>
                  <td className="border-b p-2">{producto.stock}</td>
                  <td className="border-b p-2">{producto.stockReservado}</td>
                  <td className="border-b p-2">
                    <input
                      type="checkbox"
                      checked={producto.habilitado}
                      onChange={() =>
                        !producto.eliminado &&
                        handleCheckboxChange(producto.productoId, "habilitado", !producto.habilitado)
                      }
                      disabled={producto.eliminado}
                    />
                  </td>
                  <td className="border-b p-2">
                    <input
                      type="checkbox"
                      checked={producto.eliminado}
                      onChange={() =>
                        handleCheckboxChange(producto.productoId, "eliminado", !producto.eliminado)
                      }
                      disabled={producto.eliminado}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="mt-4">
            <span>Página {currentPage} de {totalPages}</span>
            <div className="mt-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className="bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>

        {/* Renderizar el modal */}
        {isModalOpen && <ConfirmationModal />}
      </div>
    </MainLayout>
  );
}
