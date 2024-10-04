"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { GetPedidos } from "@/utils/authHelpers";
import MainLayout from "../../../components/layouts/MainLayout";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
import Link from "next/link";
import { VmPedido } from "@/types/types";
import useAdmin from "@/hooks/useAdmin";
import { useAuthStore } from "@/store/useAuthStore";
import { Title } from "@/components/title/Title";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import LayoutDivComponent from "@/components/layouts/layout-div-component";
import FilterButtonComponent from "@/components/buttons-components/button-product-component/Filter-button-component";
import LabelComponent from "@/components/label-component/label-component";
import { InputComponent } from "@/components/input/InputComponent";

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
      const matchesFechaDesde =
        !fechaDesde || new Date(pedido.fecha) >= new Date(fechaDesde);
      const matchesFechaHasta =
        !fechaHasta || new Date(pedido.fecha) <= new Date(fechaHasta);

      return matchesEstadoId && matchesFechaDesde && matchesFechaHasta;
    });
    setFilteredPedidos(filtered);
  }, [filters, VmPedidos, fechaDesde, fechaHasta]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reiniciar a la primera página al cambiar el número de elementos por página
  };

  // Calcular los elementos a mostrar según la página y los filtros aplicados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPedidos = filteredPedidos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);

  const formatCurrency = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

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
          <LayoutSectionComponent>
            <LayoutDivComponent>
              <NavAdmin />
              <div>
                <Title className="text-left" text="Pedidos" />
                <p className="text-gray-500">Revisa el historial de pedidos</p>
              </div>
              {/* Panel de Filtros */}
              <div>
                <FilterButtonComponent
                  text={
                    isPanelCollapsed ? "Mostrar filtros" : "Ocultar filtros"
                  }
                  onclick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                  className="my-custom-class"
                  isPanelCollapsed={isPanelCollapsed} // Pasar el estado como prop
                />
                <div
                  className={`transition-opacity duration-300 ${
                    isPanelCollapsed
                      ? "opacity-0 h-0 overflow-hidden"
                      : "opacity-100"
                  }`}
                >
                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col flex-grow">
                      <LabelComponent text="Estado" />
                      <select
                        id="estadoId"
                        name="estadoId"
                        value={filters.estadoId}
                        onChange={handleFilterChange}
                        className="border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-blue-400"
                      >
                        <option value="">Todos</option>
                        <option value="1">Pendiente</option>
                        <option value="2">Completado</option>
                        <option value="3">Cancelado</option>
                        <option value="4">Anulado</option>
                      </select>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <LabelComponent text="Fecha Desde" />
                      <InputComponent
                        id="fechaDesde"
                        name="fechaDesde"
                        type="date"
                        value={fechaDesde}
                        onChange={handleDateChange}
                        onClick={(e) => e.currentTarget.showPicker()}
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <LabelComponent text="Fecha Hasta" />
                      <InputComponent
                        id="fechaHasta"
                        name="fechaHasta"
                        type="date"
                        value={fechaHasta}
                        onChange={handleDateChange}
                        onClick={(e) => e.currentTarget.showPicker()}
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
                        <td className="border p-2">
                          {new Date(pedido.fecha).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{pedido.nombreUsuario}</td>
                        <td className="border p-2">{pedido.estadoNombre}</td>
                        <td className="border p-2">
                          {pedido.cantidadDetalles}
                        </td>
                        <td className="border p-2">
                          $
                          {pedido.valorTotal !== undefined &&
                          pedido.valorTotal !== null
                            ? `${formatCurrency.format(pedido.valorTotal)}`
                            : "N/A"}
                        </td>
                        <td className="border p-2">
                          <Link
                            href={`/admin/orders/${pedido.pedidoId}`}
                            className="text-blue-500 hover:underline"
                          >
                            Ver Detalle
                          </Link>
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
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((pageNumber) => (
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
                    ))}
                  </div>
                </div>
              </div>

              {/* Padding final */}
              <div className="mt-8" style={{ paddingBottom: "30px" }}></div>
            </LayoutDivComponent>
          </LayoutSectionComponent>
        </MainLayout>
      )}
    </>
  );
}
