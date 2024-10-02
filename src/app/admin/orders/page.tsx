"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { GetPedidos } from "@/utils/authHelpers"; 
import MainLayout from "../../layouts/MainLayout"; 
import NavAdmin from "@/components/shared/NavAdmin"; 
import Link from 'next/link';
import { VmPedido } from "@/types/types";
import useAdmin from '@/hooks/useAdmin';
import { useAuthStore } from '@/store/useAuthStore';

export default function OrdersPage() {
  useAdmin();
  const [VmPedidos, setPedidos] = useState<VmPedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<VmPedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuthStore();

  // Estados para los filtros
  const [filters, setFilters] = useState({
    estadoId: "1", // Estado "Pendiente" por defecto
  });

  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(true);
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

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
    const { estadoId } = filters;
    const filtered = VmPedidos.filter((pedido) => {
      const matchesEstadoId = !estadoId || pedido.estadoId === Number(estadoId);
      const matchesFechaDesde = !fechaDesde || new Date(pedido.fecha) >= new Date(fechaDesde);
      const matchesFechaHasta = !fechaHasta || new Date(pedido.fecha) <= new Date(fechaHasta);

      return matchesEstadoId && matchesFechaDesde && matchesFechaHasta;
    });
    setFilteredPedidos(filtered);
  }, [filters, VmPedidos, fechaDesde, fechaHasta]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "fechaDesde") {
      setFechaDesde(value);
    } else {
      setFechaHasta(value);
    }
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
    <>
    {isAdmin && (
    <MainLayout>
      <div className="relative mt-20">
        {/* Navbar */}
        <NavAdmin/>

        <section className="pt-8 p-4">
          <h1 className="font-semibold text-4xl mb-4">Historial de Pedidos</h1>
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
                    <option value="2">Completado</option>
                    <option value="3">Cancelado</option>
                    <option value="4">Anulado</option>
                  </select>
                </div>
                <div className="flex flex-col flex-grow">
                  <label htmlFor="fechaDesde">Fecha Desde:</label>
                  <input
                    id="fechaDesde"
                    name="fechaDesde"
                    type="date"
                    value={fechaDesde}
                    onChange={handleDateChange}
                    className="border p-2 rounded cursor-pointer" // Añadir cursor pointer para indicar que se puede hacer clic
                    onClick={(e) => e.currentTarget.showPicker()} // Mostrar el selector de fecha al hacer clic en el input
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <label htmlFor="fechaHasta">Fecha Hasta:</label>
                  <input
                    id="fechaHasta"
                    name="fechaHasta"
                    type="date"
                    value={fechaHasta}
                    onChange={handleDateChange}
                    className="border p-2 rounded cursor-pointer" // Añadir cursor pointer para indicar que se puede hacer clic
                    onClick={(e) => e.currentTarget.showPicker()} // Mostrar el selector de fecha al hacer clic en el input
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Tabla de Pedidos */}
          <div>
            <table className="table-auto w-full border mb-6">
              <thead>
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">Fecha</th>
                  <th className="border p-2">Usuario</th>
                  <th className="border p-2">Estado</th>
                  <th className="border p-2">Cantidad Productos</th>
                  <th className="border p-2">Valor Total</th>
                  <th className="border px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPedidos.map((pedido) => (
                  <tr key={pedido.pedidoId}>
                    <td className="border p-2">#{pedido.pedidoId}</td>
                    <td className="border p-2">{pedido.fecha}</td>
                    <td className="border p-2">{pedido.nombreUsuario}</td>
                    <td className="border p-2">{pedido.estadoNombre}</td>
                    <td className="border p-2">{pedido.cantidadDetalles}</td>
                    <td className="border p-2">{pedido.valorTotal}</td>
                    <td className="border p-2">
                      <Link href={`/admin/orders/${pedido.pedidoId}`} className="text-blue-500 hover:underline">Ver Detalle</Link>
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
    )}
    </>
  );
}
