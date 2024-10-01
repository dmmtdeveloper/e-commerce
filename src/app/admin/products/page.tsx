"use client";
import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import NavAdmin from "@/components/shared/NavAdmin";
import { GetProductos, UpdateHabilitadoProducto, UpdateEliminadoProducto } from "@/utils/authHelpers"; //
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import useAdmin from '@/hooks/useAdmin';
import { useAuthStore } from "@/store/useAuthStore";

export default function ProductsPage() {
  useAdmin();
  const [productos, setProductos] = useState<Product[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuthStore();
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
    habilitado: true,
    noEliminado: true,
    precioMinimo: 0,
    precioMaximo: 10000000,
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
    const { nombre, descripcion, habilitado, noEliminado, precioMinimo, precioMaximo } = filters;
    const filtered = productos.filter((producto) => {
      const matchesNombre = producto.nombre.toLowerCase().includes(nombre.toLowerCase());
      const matchesDescripcion = producto.descripcion.toLowerCase().includes(descripcion.toLowerCase());
      const matchesHabilitado = habilitado ? producto.habilitado : true; // Si habilitado está desmarcado, no filtra por habilitado
      const matchesNoEliminado = noEliminado ? !producto.eliminado : true; // Si no eliminado está desmarcado, no filtra por eliminado
      const matchesPrecio = producto.precio >= precioMinimo && producto.precio <= precioMaximo;

      return matchesNombre && matchesDescripcion && matchesHabilitado && matchesNoEliminado && matchesPrecio;
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
    <>
    {isAdmin && (
    <MainLayout>
      <div className="relative mt-20 mb-20">
        {/* Navbar */}
        <NavAdmin className="pl-8 w-full z-50 bg-white shadow-md" />

        <section className="pt-8 p-4">
          <h1 className="font-semibold text-4xl mb-4">Productos</h1>


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
              {/* Fila de filtros en una sola fila */}
              <div className="mb-4 flex flex-wrap items-center space-x-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Buscar por Nombre"
                    value={filters.nombre}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Buscar por Descripción"
                    value={filters.descripcion}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="habilitado"
                      checked={filters.habilitado}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    Habilitado
                  </label>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="noEliminado"
                      checked={filters.noEliminado}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    No Eliminado
                  </label>
                </div>
                <div className="flex-1 min-w-[300px]">
                  <label className="block mb-2">Rango de Precio</label>
                  <Slider
                    range
                    min={0}
                    max={1000000}
                    value={[filters.precioMinimo, filters.precioMaximo]}
                    onChange={(value) => {
                      const [min, max] = value as number[];
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        precioMinimo: min,
                        precioMaximo: max,
                      }));
                    }}
                  />
                  <div className="flex justify-between mt-2">
                    <span>Precio Mínimo: {filters.precioMinimo}</span>
                    <span>Precio Máximo: {filters.precioMaximo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón para Crear Producto */}
          <div className="mb-4 relative">
            <Link
              href="/admin/products/create"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 z-10"
            >
              Crear Producto
            </Link>
          </div>


          {/* Tabla de Productos */}
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Producto</th>
                  <th className="border px-4 py-2">Habilitado</th>
                  <th className="border px-4 py-2">Eliminado</th>
                  <th className="border px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentProductos.map((producto) => (
                  <tr key={producto.productoId}>
                    <td className="border px-4 py-2">
                      <div className="flex items-center space-x-4">
                        {producto.foto && producto.foto !== "" ? (
                          <Image src={`data:image/${producto.extension};base64,${producto.foto}`} alt={producto.nombre} className="w-32 h-32 object-cover rounded" height={80} width={80} priority />
                        ) : (
                          <div className="h-32 w-32 bg-gray-200 mr-4"></div>
                        )}
                        
                        <div>
                          <p className="font-bold text-lg">{producto.nombre}</p>
                          <p className="text-sm text-gray-600">{producto.descripcion}</p>
                          <p className="text-sm font-bold text-gray-800">Precio: ${producto.precio}</p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-600">Stock: {producto.stock}</p>
                        <p className="text-sm text-gray-600">Stock Reservado: {producto.stockReservado}</p>
                        <p className="font-bold text-md text-gray-600">Stock Disponible: {producto.stock - producto.stockReservado}</p>
                        </div>
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <label>
                        <input
                          type="checkbox"
                          checked={producto.habilitado}
                          onChange={() => handleCheckboxChange(producto.productoId, "habilitado", !producto.habilitado)}
                          disabled={producto.eliminado}
                        />
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <label>
                        <input
                          type="checkbox"
                          checked={producto.eliminado}
                          onChange={() => handleCheckboxChange(producto.productoId, "eliminado", !producto.eliminado)}
                          disabled={producto.eliminado}
                        />
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <Link href={`/admin/products/${producto.productoId}`} className="text-blue-500 hover:underline">Editar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-4">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 px-4 py-2 rounded mr-2">Anterior</button>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-gray-300 px-4 py-2 rounded">Siguiente</button>
            <p className="mt-2">Página {currentPage} de {totalPages}</p>
          </div>
        </section>

        {/* Modal de Confirmación */}
        {isModalOpen && <ConfirmationModal />}
      </div>
    </MainLayout>
    )}
    </>
  );
}
