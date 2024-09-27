"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { GetProductoById, UpdateProductoAll, UpdateLimpiaFotoProducto } from '@/utils/authHelpers'; 
import MainLayout from "../../../layouts/MainLayout"; 
import NavAdmin from "@/components/shared/NavAdmin"; 
import Link from 'next/link';
import axios from 'axios';
import Image from "next/image";

interface EditPageProps { 
  params: {
    id: string;
  };
}

const EditarProducto = ({ params }: EditPageProps) => {
  const router = useRouter();
  const [producto, setProducto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Estado para el archivo seleccionado
  const [imageBase64, setImageBase64] = useState<string | null>(null); // Estado para almacenar el base64
  const [fileName, setFileName] = useState<string>(""); // Estado para el nombre del archivo
  const [fileType, setFileType] = useState<string>(""); // Estado para el tipo de archivo
  const productId = parseInt(params.id); 
  const hasFetched = useRef(false); 
  // Estado para manejar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);


  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await GetProductoById(productId);
        setProducto(data);
        if (data.foto) {
          setImageBase64(data.foto); // Si hay foto en el producto, cargarla
          setFileName(data.nombreFoto);
          setFileType(data.extension);
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(productId) && !hasFetched.current) { 
      hasFetched.current = true;
      fetchProducto();
    } else if (isNaN(productId)) {
      setLoading(false);
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducto((prev) => (prev ? {
      ...prev,
      [name]: name === 'precio' || name === 'stock' || name === 'stockReservado'
        ? Number(value)
        : value,
    } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Obtener el archivo seleccionado
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setSelectedFile(file); // Asegurarse de que es un archivo png o jpg
      setFileName(file.name); // Almacenar el nombre del archivo
      setFileType(file.type); // Almacenar el tipo del archivo
      convertToBase64(file); // Convertir el archivo a base64
    } else {
      alert("Solo se permiten archivos .png y .jpg");
    }
  };

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(getBase64String(reader.result as string)); // Almacenar la imagen en base64
    };
  };

  const getBase64String = (base64: string) => {
    return base64.replace(/^data:image\/[a-z]+;base64,/, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (producto) {
      try {
        // Agregar la imagen base64 al producto antes de actualizar
        const updatedProduct = { ...producto, foto: imageBase64 ? getBase64String(imageBase64) : "" };

        await UpdateProductoAll(updatedProduct);

        router.push("/admin/products");
      } catch (error) {
        let errorMessage = "Error desconocido al actualizar el producto.";

        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        alert(errorMessage);
      }
    }
  };

  const handleUpdateLimpiarFoto= async () => {
    if (productId) {
      try {
        await UpdateLimpiaFotoProducto(productId);
        openSuccessModal("Foto eliminada de forma correcta.");
        setImageBase64(null); // Limpiar la imagen base64
        setSelectedFile(null); // Limpiar el archivo seleccionado
        setFileName(""); // Limpiar el nombre del archivo
        setFileType(""); // Limpiar el tipo del archivo
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
        openErrorModal("Error al eliminar la foto.");
      }
    } else {
      console.warn("productId no existe");
    }
  };

  const openSuccessModal = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const openErrorModal = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setConfirmAction(() => null); // Usa una función vacía para evitar el error de tipo
    setModalMessage("");
  };

  const confirmActionHandler = () => {
    if (confirmAction) {
      confirmAction();
      closeConfirmationModal();
    }
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  const openConfirmationModal = (action: () => void, message: string = "¿Estás seguro de que quieres realizar esta acción?") => {
    setConfirmAction(() => action);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!producto) {
    return <div>No se encontró el producto.</div>;
  }

  return (
    <MainLayout>
      <div className="relative mt-20 mb-20">
        <NavAdmin className="pl-8 w-full z-50 bg-white shadow-md" />
        <section className="pt-8 p-4">
          <h1 className="font-semibold text-4xl mb-4">Editar Producto</h1>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
            <div className="mb-4">
              <label className="block mb-1">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Descripción:</label>
              <textarea
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Precio:</label>
              <input
                type="number"
                name="precio"
                value={producto.precio}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Stock:</label>
              <input
                type="number"
                name="stock"
                value={producto.stock}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Foto (selecciona archivo):</label>
              {imageBase64 ? (
                <div className="flex items-center mb-4">
                  <Image src={`data:image/${fileType};base64,${imageBase64}`} alt="Imagen cargada" width={60} height={60} className="h-60 w-60 object-cover mr-4" priority />

                  <div>
                    <p>Archivo: {fileName} <br />
                      Extension: {fileType}</p>
                    <button type="button"onClick={() => openConfirmationModal(() => handleUpdateLimpiarFoto(), "¿Estás seguro de que quieres eliminar la foto?")}
                     className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700">
                      Eliminar Imagen
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="file"
                  accept=".png,.jpg"
                  onChange={handleFileChange}
                  className="border p-2 rounded w-full"
                />
              )}
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                Actualizar Producto
              </button>
              <Link href="/admin/products">
                <button type="button" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </section>
      </div>

      {/* Modal de Confirmación */}
      {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
              <p>{modalMessage}</p>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={confirmActionHandler}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Confirmar
                </button>
                <button
                  onClick={closeConfirmationModal}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Modal de Éxito */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-green-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Éxito</h2>
              <p>{modalMessage}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeSuccessModal}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Modal de Error */}
        {isErrorModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-red-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Error</h2>
              <p>{modalMessage}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeErrorModal}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

    </MainLayout>
  );
};

export default EditarProducto;
