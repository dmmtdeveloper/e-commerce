
"use client";
import { GetPedidosByToken } from "@/utils/authHelpers";
import { IoMdSearch } from "react-icons/io";
import { NavSetting } from "@/components/shared/NavSetting";
import { Pedido } from "@/types/types";
import { Title } from "@/components/title/Title";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";

import * as XLSX from "xlsx"; // Importar la biblioteca XLSX
import ExcelButtonComponent from "@/components/buttons-components/Excel-Button";
import FilterButtonComponent from "@/components/buttons-components/button-product-component/Filter-button-component";
import LabelComponent from "@/components/label-component/label-component";
import LayoutDivComponent from "@/components/layouts/layout-div-component";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
import Pagination from "@/components/pagination-component/pagination-component";

export default function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuthStore();

  // Estados para los filtros, paginación, rango de fechas, y colapso de panel
  const [filters, setFilters] = useState({ estadoId: "1" });
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de elementos por página
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true); // Estado para colapsar el panel

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      GetPedidosByToken(token)
        .then((pedidos) => {
          setPedidos(pedidos.length === 0 ? [] : pedidos);
          setLoading(false);
        })
        .catch((error) => {
          setError(
            "Error obteniendo los pedidos. Por favor, intente de nuevo."
          );
          console.error("Error obteniendo los pedidos:", error);
          setLoading(false);
        });
    } else {
      setError("No se encontró un token válido.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { estadoId } = filters;
    const filtered = pedidos.filter((pedido) => {
      const matchesEstadoId = !estadoId || pedido.estadoId === Number(estadoId);
      const matchesFechaDesde =
        !fechaDesde || new Date(pedido.fecha) >= new Date(fechaDesde);
      const matchesFechaHasta =
        !fechaHasta || new Date(pedido.fecha) <= new Date(fechaHasta);
      return matchesEstadoId && matchesFechaDesde && matchesFechaHasta;
    });
    setFilteredPedidos(filtered);
  }, [filters, pedidos, fechaDesde, fechaHasta]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    name === "fechaDesde" ? setFechaDesde(value) : setFechaHasta(value);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Lógica de paginación
  const indexOfLastItems = currentPage * itemsPerPage;
  const indexOfFirstItems = indexOfLastItems - itemsPerPage;
  const paginatedPedidos = filteredPedidos.slice(
    indexOfFirstItems,
    indexOfLastItems
  );

  // Función para descargar los pedidos como archivo Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPedidos.map((pedido) => ({
        "Pedido ID": pedido.pedidoId,
        Fecha: new Date(pedido.fecha).toLocaleDateString(),
        Cantidad: pedido.cantidad,
        Estado: pedido.estadoNombre,
        "Total Pedido":
          pedido.valorTotal !== undefined && pedido.valorTotal !== null
            ? formatCurrency.format(pedido.valorTotal)
            : "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

    // Generar y descargar el archivo Excel
    XLSX.writeFile(workbook, "pedidos.xlsx");
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
  return (
    <MainLayout>
      <LayoutSectionComponent>
        <LayoutDivComponent>
          {!isAdmin ? <NavSetting /> : <NavAdmin />}
          <div>
            <div className="mb-10">
              <Title className="text-left" text="Mis Compras" />
              <p className="text-gray-500">Panel de pedidos históricos</p>
            </div>
            <FilterButtonComponent
              text={isPanelCollapsed ? "Mostrar filtros" : "Ocultar filtros"}
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
            ></div>
            {!isPanelCollapsed && (
              <div className="transition-opacity duration-300">
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col flex-grow">
                    <LabelComponent text="Estado" />
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
                    <LabelComponent text="Fecha desde:" />

                    <input
                      id="fechaDesde"
                      name="fechaDesde"
                      type="date"
                      value={fechaDesde}
                      onChange={handleDateChange}
                      className="border p-2 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <LabelComponent text="Fecha hasta:" />
                    <input
                      id="fechaHasta"
                      name="fechaHasta"
                      type="date"
                      value={fechaHasta}
                      onChange={handleDateChange}
                      className="border p-2 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón de descarga */}
          <div className="w-[20rem]">
            <ExcelButtonComponent text="Descarga Excel" onClick={downloadExcel}/>
           
          </div>

          <div className="flex items-center flex-col">
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  <th className="border p-2"></th>
                  <th className="border p-2">Fecha</th>
                  <th className="border p-2">Estado</th>
                  <th className="border p-2">Cantidad Producto</th>
                  <th className="border p-2">Valor Total</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPedidos.map((pedido) => (
                  <tr key={pedido.pedidoId}>
                    <td className="border p-2">#{pedido.pedidoId}</td>
                    <td className="border p-2">
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{pedido.estadoNombre}</td>
                    <td className="border p-2">{pedido.cantidad}</td>
                    <td className="border p-2">
                      $
                      {pedido.valorTotal !== undefined &&
                      pedido.valorTotal !== null
                        ? `${formatCurrency.format(pedido.valorTotal)}`
                        : "N/A"}
                    </td>
                    <td className="border items-center flex justify-center py-2">
                      <Link
                        href={`/orders/ordersDetails/${pedido.pedidoId}`}
                        className="text-blue-500"
                      >
                       <IoMdSearch className="text-2xl hover:scale-125 transition-all"/>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex  items-center mt-4">
              {/* Paginación */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={paginate}
              />
            </div>
          </div>
        </LayoutDivComponent>
      </LayoutSectionComponent>
    </MainLayout>
  );
}
