"use client";

import { GetPedidos } from "@/utils/authHelpers";
import { InputComponent } from "@/components/input/InputComponent";
import { Title } from "@/components/title/Title";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { VmPedido } from "@/types/types";

import * as XLSX from "xlsx"; // Importar la biblioteca XLSX
import FilterButtonComponent from "@/components/buttons-components/button-product-component/Filter-button-component";
import LabelComponent from "@/components/label-component/label-component";
import LayoutDivComponent from "@/components/layouts/layout-div-component";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import Link from "next/link";
import MainLayout from "../../../components/layouts/MainLayout";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
import useAdmin from "@/hooks/useAdmin";
import ExcelButtonComponent from "@/components/buttons-components/Excel-Button";
import Pagination from "@/components/pagination-component/pagination-component";
import { IoMdSearch } from "react-icons/io";

export default function OrdersPage() {
  useAdmin();
  const [VmPedidos, setPedidos] = useState<VmPedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<VmPedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuthStore();

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  // Función para descargar los pedidos como archivo Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPedidos.map((pedido) => ({
        "Pedido ID": pedido.pedidoId,
        Fecha: new Date(pedido.fecha).toLocaleDateString(),
        Usuario: pedido.nombreUsuario,
        Estado: pedido.estadoNombre,
        "Cantidad Productos": pedido.cantidadDetalles,
        "Valor Total":
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

              {/* Botón de descarga */}
              <div className="w-[20rem]">
                <ExcelButtonComponent
                  text="Descarga Excel"
                  onClick={downloadExcel}
                />
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
                      <th className="border p-2">Cantidad</th>
                      <th className="border p-2">Valor Total</th>
                      <th className="border px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPedidos.map((pedido) => (
                      <tr key={pedido.pedidoId}>
                        <td className="border px-4 py-2">
                          <Link
                            href={`/admin/orders/${pedido.pedidoId}`}
                            className="text-blue-500 hover:underline"
                          >
                            #{pedido.pedidoId}
                          </Link>
                        </td>
                        <td className="border px-4 py-2">
                          {new Date(pedido.fecha).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">
                          {pedido.nombreUsuario}
                        </td>
                        <td className="border px-4 py-2">
                          {pedido.estadoNombre}
                        </td>
                        <td className="border  px-4 py-2">
                          {pedido.cantidadDetalles}
                        </td>
                        <td className="border px-4 py-2">
                          {pedido.valorTotal !== undefined &&
                          pedido.valorTotal !== null
                            ? formatCurrency.format(pedido.valorTotal)
                            : "N/A"}
                        </td>
                        <td className="border items-center flex justify-center py-2">
                          <Link
                            href={`/admin/orders/${pedido.pedidoId}`}
                            className="text-blue-500 hover:underline"
                          >
                            <IoMdSearch className="text-2xl hover:scale-125 transition-all"/>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}

                   {/* Paginación */}
                   <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={paginate}
              />
              {/* <div>
                <p>
                  Mostrando {indexOfFirstItem + 1} a{" "}
                  {Math.min(indexOfLastItem, filteredPedidos.length)} de{" "}
                  {filteredPedidos.length} pedidos
                </p>
                <div>
                </div>
              </div> */}
            </LayoutDivComponent>
          </LayoutSectionComponent>
        </MainLayout>
      )}
    </>
  );
}
