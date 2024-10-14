"use client";

import { useState } from "react";
import {
  SaveProductoSchema,
  productoSaveSchema,
} from "@/validations/productoSchema";
import { useRouter } from "next/navigation";
import MainLayout from "../../../../components/layouts/MainLayout";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
import { AddProducto } from "@/utils/authHelpers";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputComponent } from "@/components/input/InputComponent";
import SubmitButton from "@/components/buttons-components/AuthButton";
import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import LayoutDivComponent from "@/components/layouts/layout-div-component";
import LabelComponent from "@/components/label-component/label-component";
import { Title } from "@/components/title/Title";

const CrearProducto = () => {
  const router = useRouter();
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: null, // Inicializar en null
    stock: null, // Inicializar en null
    stockReservado: 0,
    habilitado: true,
    eliminado: false,
    foto: "",
    nombreFoto: "",
    extension: "",
  });
  const {
    register, // Registrar los campos del formulario
    handleSubmit, // Manejar el envío del formulario
    formState: { errors, isSubmitting }, // Manejar los errores de validación
    reset,
    setError,
  } = useForm<SaveProductoSchema>({
    resolver: zodResolver(productoSaveSchema),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProducto((prev) => ({
      ...prev,
      [name]:
        name === "precio" || name === "stock"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectedFile(file);
      setFileName(file.name);
      setFileType(file.type);
      convertToBase64(file);
    } else {
      alert("Solo se permiten archivos .png y .jpg");
    }
  };

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(getBase64String(reader.result as string));
    };
  };

  const getBase64String = (base64: string) => {
    return base64.replace(/^data:image\/[a-z]+;base64,/, "");
  };

  const handleSubmitProducto = async (data: SaveProductoSchema) => {
    try {
      const newProduct = {
        ...data,
        foto: imageBase64 ? getBase64String(imageBase64) : "",
        nombreFoto: fileName ? fileName : "",
        extension: fileType ? fileType : "",
        stockReservado: 0, // Asignar valor predeterminado
        habilitado: true, // Asignar valor predeterminado
        eliminado: false, // Asignar valor predeterminado
      };

      // Aquí se llama a la función para agregar el producto
      await AddProducto(
        newProduct.nombre,
        newProduct.descripcion,
        newProduct.precio,
        newProduct.stock,
        newProduct.stockReservado,
        newProduct.habilitado,
        newProduct.eliminado,
        newProduct.foto,
        newProduct.nombreFoto,
        newProduct.extension
      );

      reset(); // Reinicia el formulario
      router.push("/admin/products"); // Redirige después de crear el producto
    } catch (error) {
      console.error("Error al crear el producto:", error);
      alert("Error al crear el producto.");
    }
  };

  const handleLimpiarFoto = () => {
    setImageBase64(null);
    setSelectedFile(null);
    setFileName("");
    setFileType("");
    setIsModalOpen(false);
  };

  const openConfirmationModal = (
    action: () => void,
    message: string = "¿Estás seguro de que quieres realizar esta acción?"
  ) => {
    setConfirmAction(() => action);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const confirmActionHandler = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  return (
    <MainLayout>
      <LayoutSectionComponent>
        <LayoutDivComponent>
        <NavAdmin />
        <Title text="Crear producto"/>
          <form
            onSubmit={handleSubmit(handleSubmitProducto)}
            className=""
          >
            <div className="mb-4">
              <LabelComponent text="Nombre"/>
              <InputComponent
                type="text"
                name="nombre"
                // value={producto.nombre}
                onChange={handleChange}
                register={register("nombre")}
                error={errors.nombre?.message}
                placeholder="Ingresa el nombre del producto"
                />
            </div>
            <div className="mb-4">
              <LabelComponent text="Descripción"/>
              <InputComponent
                type="text"
                name="descripcion"
                // value={producto.descripcion}
                onChange={handleChange}
                register={register("descripcion")}
                error={errors.descripcion?.message}
                placeholder="Ingresa una descripción"
                />
            </div>
            <div className="mb-4">
              <LabelComponent text="Precio"/>
              <InputComponent
                type="number"
                name="precio"
                onChange={handleChange}
                register={register("precio")}
                error={errors.precio?.message}
                placeholder="Ingresa un precio"
                />
            </div>
            <div className="mb-4">
              <LabelComponent text="Stock"/>
              <InputComponent
                type="number"
                name="stock"
                onChange={handleChange}
                register={register("stock")}
                error={errors.stock?.message}
                placeholder="Ingresa el stock disponible en bodega"
                />
            </div>
            <div className="mb-4">
              <LabelComponent text="Foto (selecciona archivo):"/>
          
              {imageBase64 ? (
                <div className="flex items-center mb-4">
                  <Image
                    src={`data:image/${fileType};base64,${imageBase64}`}
                    alt="Imagen cargada"
                    width={60}
                    height={60}
                    className="h-60 w-60 object-cover mr-4"
                    priority
                  />

                  <div>
                    <p>
                      Archivo: {fileName} <br />
                      Extension: {fileType}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        openConfirmationModal(
                          handleLimpiarFoto,
                          "¿Estás seguro de que quieres eliminar la foto?"
                        )
                      }
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                    >
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
              <ButtonCtaComponent
                text="Crear Producto"
                type="submit"
                isSubmitting={isSubmitting}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              />

              <Link href="/admin/products">
                <ButtonCtaComponent
                  text="Cancelar"
                  type="button"
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                />
              </Link>
            </div>
          </form>
        </LayoutDivComponent>

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
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </LayoutSectionComponent>
    </MainLayout>
  );
};

export default CrearProducto;
