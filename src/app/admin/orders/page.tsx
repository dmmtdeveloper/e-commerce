"use client";
import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import NavAdmin from "@/components/shared/NavAdmin";
import { GetPedidos } from "@/utils/authHelpers";
import { Pedido } from "@/types/types";
import Link from "next/link";

export default function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [filters, setFilters] = useState({
    search: "",
    estadoId: "",
    eliminado: false,
  });

  // Estado para manejar el colapso del panel
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(true);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    GetPedidos()
      .then((pedidos) => {
        setPedidos(pedidos);
        setLoading(false);
        setFilteredPedidos(pedidos);
      })
      .catch((error) => {
        setError("Error obteniendo los pedidos");
        console.error("Error obteniendo los pedidos:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const { search, estadoId, eliminado } = filters;
    const filtered = pedidos.filter((pedido) => {
      const matchesSearch =
        pedido.token.toLowerCase().includes(search.toLowerCase());
      const matchesEstadoId = !estadoId || pedido.estadoId === Number(estadoId);
      const matchesEliminado = !eliminado || pedido.eliminado;

      return matchesSearch && matchesEstadoId && matchesEliminado;
    });
    setFilteredPedidos(filtered);
  }, [filters, pedidos]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
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
  const currentPedidos = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);

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
          {/* Botón para Crear Pedido */}
          <div className="mb-4 relative">
            <Link
              href="/admin/orders/create"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 z-10"
            >
              Crear Pedido
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
                isPanelCollapsed
                  ? "opacity-0 h-0 overflow-hidden"
                  : "opacity-100"
              }`}
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col flex-grow">
                  <label htmlFor="search">Buscar por Token:</label>
                  <input
                    id="search"
                    name="search"
                    type="text"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                    placeholder="Token"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <label htmlFor="estadoId">Estado:</label>
                  <select
                    id="estadoId"
                    name="estadoId"
                    value={filters.estadoId}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">Todos</option>
                    <option value="1">Pendiente</option>
                    <option value="2">En Proceso</option>
                    <option value="3">Completado</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="eliminado"
                    name="eliminado"
                    type="checkbox"
                    checked={filters.eliminado}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <label htmlFor="eliminado">Mostrar solo eliminados</label>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Pedidos */}
          <div>
            <h1 className="font-semibold text-4xl mb-4">Pedidos del Sistema</h1>
            <p className="mb-4">
              A continuación se muestra la lista de pedidos registrados en el
              sistema:
            </p>

            <table className="table-auto w-full border mb-6">
              <thead>
                <tr>
                  <th className="border p-2">Pedido ID</th>
                  <th className="border p-2">Token</th>
                  <th className="border p-2">Estado ID</th>
                  <th className="border p-2">Valor Total</th>
                  <th className="border p-2">Fecha</th>
                  <th className="border p-2">Eliminado</th>
                </tr>
              </thead>
              <tbody>
                {currentPedidos.map((pedido) => (
                  <tr key={pedido.pedidoId}>
                    <td className="border p-2">{pedido.pedidoId}</td>
                    <td className="border p-2">{pedido.token}</td>
                    <td className="border p-2">{pedido.estadoId}</td>
                    <td className="border p-2">{pedido.valorTotal}</td>
                    <td className="border p-2">{pedido.fecha}</td>
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={pedido.eliminado}
                        disabled={pedido.eliminado}
                      />
                    </td>
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
