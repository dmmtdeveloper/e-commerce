"use client";
import { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
import {
  GetProductos,
  UpdateHabilitadoProducto,
  UpdateEliminadoProducto,
} from "@/utils/authHelpers"; //
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import useAdmin from "@/hooks/useAdmin";
import { useAuthStore } from "@/store/useAuthStore";
import { Title } from "@/components/title/Title";
import { InputComponent } from "@/components/input/InputComponent";
import FilterButtonComponent from "@/components/buttons-components/button-product-component/Filter-button-component";
import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import LabelComponent from "@/components/label-component/label-component";
import Pagination from "@/components/pagination-component/pagination-component";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import LayoutDivComponent from "@/components/layouts/layout-div-component";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { BsFillBagDashFill } from "react-icons/bs";
import { ImFilePicture } from "react-icons/im";
import { PiProhibitBold } from "react-icons/pi";
import { CgCheck } from "react-icons/cg";

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
    const {
      nombre,
      descripcion,
      habilitado,
      noEliminado,
      precioMinimo,
      precioMaximo,
    } = filters;
    const filtered = productos.filter((producto) => {
      const matchesNombre = producto.nombre
        .toLowerCase()
        .includes(nombre.toLowerCase());
      const matchesDescripcion = producto.descripcion
        .toLowerCase()
        .includes(descripcion.toLowerCase());
      const matchesHabilitado = habilitado ? producto.habilitado : true; // Si habilitado está desmarcado, no filtra por habilitado
      const matchesNoEliminado = noEliminado ? !producto.eliminado : true; // Si no eliminado está desmarcado, no filtra por eliminado
      const matchesPrecio =
        producto.precio >= precioMinimo && producto.precio <= precioMaximo;

      return (
        matchesNombre &&
        matchesDescripcion &&
        matchesHabilitado &&
        matchesNoEliminado &&
        matchesPrecio
      );
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

  const handleCheckboxChange = (
    productoId: number,
    field: "habilitado" | "eliminado",
    value: boolean
  ) => {
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
            <button
              onClick={handleConfirm}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            >
              Confirmar
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 py-2 px-4 rounded"
            >
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
  const currentProductos = filteredProductos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

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
                <Title className="text-left" text="Productos" />
                <p className="text-gray-500">
                  Explora los productos disponibles
                </p>
              </div>
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
                  <div className="2xl:flex md:flex lg:flex flex flex-col gap-4 2xl:gap-8 md:flex-row">
                    <div className="flex-1 min-w-[200px]">
                      <InputComponent
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={filters.nombre}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <InputComponent
                        type="text"
                        name="descripcion"
                        placeholder="Descripción"
                        value={filters.descripcion}
                        onChange={handleFilterChange}
                      />
                    </div>

                    <div className="2xl:flex md:flex lg:flex flex flex-col gap-4 md:flex-row">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="habilitado"
                          checked={filters.habilitado}
                          onChange={handleFilterChange}
                          className="mr-2"
                        />
                        <LabelComponent text="Habilitado" />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="noEliminado"
                          checked={filters.noEliminado}
                          onChange={handleFilterChange}
                          className="mr-2"
                        />
                        <LabelComponent text="Existentes" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-[300px]">
                      <div className="flex justify-between">
                        <span className="text-sm">
                          Precio Mínimo: {filters.precioMinimo}
                        </span>
                        <span className="text-sm">
                          Precio Máximo: {filters.precioMaximo}
                        </span>
                      </div>
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón para Crear Producto */}

              <Link href={"/admin/products/create"}>
                <ButtonCtaComponent
                  className="bg-green-500 hover:bg-green-600 translate-all duration-300"
                  text="Crear Producto"
                />
              </Link>

              <div className="overflow-x-center">
                <div className="grid grid-cols-4 bg-blue-500 text-gray-50 text-sm font-bold py-2 px-4 justify-items-center">
                  <LabelComponent className="text-[12px] 2xl:text-sm md:text-sm lg:text-sm" text="Producto" />
                  <LabelComponent className="text-[12px] 2xl:text-sm md:text-sm lg:text-sm" text="Habilitar / Deshabilitar" />
                  <LabelComponent className="text-[12px] 2xl:text-sm md:text-sm lg:text-sm" text="Eliminar" />
                  <LabelComponent className="text-[12px] 2xl:text-sm md:text-sm lg:text-sm" text="Editar" />
                </div>
                {currentProductos.map((producto) => (
                  <div
                    key={producto.productoId}
                    className="grid grid-cols-4 items-center border-b py-2 px-4"
                  >
                    {/* Producto */}
                    <div className="flex items-center space-x-4">
                      <div className="w-100 h-100 p-5 rounded-full bg-slate-200">
                        <Link
                          href={!producto.eliminado ? `/admin/products/${producto.productoId}` : `#`}
                          className="text-blue-500 w-200 h-auto hover:underline"
                        >
                          {producto.foto && producto.foto !== "" ? (
                            <Image
                              src={`data:image/${producto.extension};base64,${producto.foto}`}
                              alt={producto.nombre}
                              className="w-200 h-auto"
                              height={50}
                              width={50}
                              priority
                            />
                          ) : (
                            <div className="w-50 p-4 h-auto  rounded-full">
                              <ImFilePicture  />
                            </div>
                          )}
                        </Link>
                      </div>
                      <div className="hidden 2xl:block md:block lg:block">
                        <p className="font-bold text-lg">{producto.nombre}</p>
                        <p className="text-sm text-gray-600">
                          {producto.descripcion}
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          Precio: $
                          {producto.precio !== undefined &&
                          producto.precio !== null
                            ? `${formatCurrency.format(producto.precio)}`
                            : "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Stock: {producto.eliminado ? ("--"): (producto.habilitado? (producto.stock):("--"))}
                        </p>
                        <p className="text-sm text-gray-600">
                          Stock Reservado: {producto.eliminado ? ("--"): (producto.habilitado? (producto.stockReservado):("--"))}
                        </p>

                        {producto.eliminado? (
                          <p className="font-bold text-md text-red-600">
                            Producto Eliminado
                          </p>
                        ):(
                          producto.habilitado? (
                          <p className="font-bold text-md text-gray-600">
                            Stock Disponible:{" "}
                            {producto.stock - producto.stockReservado}
                          </p>):
                          (
                            <p className="font-bold text-md text-gray-600">
                            Producto Deshabilitado
                          </p>
                          )
                          
                        )}

                      </div>
                    </div>

                  {/* Habilitar/Deshabilitar (solo si no está eliminado) */}
                  <div className="flex justify-center">

                    {!producto.eliminado && (
                        <button
                          onClick={() =>
                            handleCheckboxChange(
                              producto.productoId,
                              "habilitado",
                              !producto.habilitado
                            )
                          }
                          title={producto.habilitado ? "Deshabilitar" : "Habilitar"}
                          className="text-green-500 hover:underline"
                        >
                          {producto.habilitado ? (
                            <PiProhibitBold className="text-red-500 text-3xl"  />
                          ) : (
                            <CgCheck className="text-green-500 text-4xl"/>
                          )}
                        </button>
                      )}
                    
                  </div>
                  
                
              
                    {/* Eliminado */}
                    <div className="flex justify-center">
                      {!producto.eliminado ? (
                        <button
                          onClick={() =>
                            handleCheckboxChange(
                              producto.productoId,
                              "eliminado",
                              true
                            )
                          }
                          title="Eliminar"
                        >
                          <FaTrashAlt className="text-2xl hover:scale-110 duration-300 text-red-500" />
                        </button>
                      ):( <FaTrashAlt className="text-2xl text-gray-400" title="Eliminado" />)}
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-center">

                    {!producto.eliminado ? (
                      <Link
                        href={`/admin/products/${producto.productoId}`}
                        className="text-blue-500 hover:underline"
                      >
                        <RiEdit2Fill className="text-3xl hover:scale-110 duration-300 transition-all" />
                      </Link>
                      ):(<RiEdit2Fill className="text-3xl text-gray-400" />)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </LayoutDivComponent>

            {/* Modal de Confirmación */}
            {isModalOpen && <ConfirmationModal />}
          </LayoutSectionComponent>
        </MainLayout>
      )}
    </>
  );
}
