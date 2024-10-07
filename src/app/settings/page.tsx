"use client";
import { useState, useEffect, useRef } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import {
  GetUsuarioByToken,
  UpdateNombreUsuario,
  UpdateClaveUsuario,
  UpdateLimpiaFotoUsuario,
  UpdateFotoUsuario,
  UpdateCorreoUsuario,
} from "@/utils/authHelpers"; // Asegúrate de ajustar el path correctamente

import { NavSetting } from "@/components/shared/NavSetting";
import { SaveUserSchema, userSaveSchema } from "@/validations/userSchema";
import { Title } from "@/components/title/Title";
import { uploadImage, deleteImage } from "@/utils/firebase"; // Función para subir y eliminar imágenes
import { useAuthStore } from "@/store/useAuthStore";
import { useForm} from 'react-hook-form';
import { useRouter } from "next/navigation";
import { Usuario } from "@/utils/authHelpers"; // Asegúrate de importar la interfaz correctamente
import { zodResolver } from "@hookform/resolvers/zod";

import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import ConfirmationModal from "@/components/ConfirmationModal";
import ErrorModal from "@/components/modals/setting-modal-component/error-modal-component/error-modal-component";
import Image from "next/image";
import InputComponentAuth from "@/components/input/inputComponenAuth";
import LayoutDivComponent from "@/components/layouts/layout-div-component";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
import PasswordInputAuth from "@/components/input/PasswordIInputAuth";
import SuccessModal from "@/components/modals/setting-modal-component/sucess-modal-component/success-modal-component";
import user from "@/public/assets/img/user.png";


export default function SettingsPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
 

  const [habilitado, setHabilitado] = useState<boolean>(false);
  const [eliminado, setEliminado] = useState<boolean>(false);
  const [esAdmin, setEsAdmin] = useState<boolean>(false);

  const { logout, isAdmin } = useAuthStore();

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  // Estado para manejar la visibilidad de los modales
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

  const {
    register, // Registrar los campos del formulario
    handleSubmit, // Manejar el envío del formulario
    formState: { errors, isSubmitting }, // Manejar los errores de validación
    reset,
  } = useForm<SaveUserSchema>({ resolver: zodResolver(userSaveSchema) });



  useEffect(() => {
    setIsClient(true); // Asegura que el hook useRouter solo se use en el cliente
    const token = sessionStorage.getItem("token");
    if (token) {
      GetUsuarioByToken(token)
        .then((usuario) => {
          setUsuario(usuario);
          setNombre(usuario.nombre);
          setCorreo(usuario.correo);
          setClave(usuario.clave);
          setAvatar(usuario.foto);
          setHabilitado(usuario.habilitado);
          setEliminado(usuario.eliminado);
          setEsAdmin(usuario.esAdmin);
        })
        .catch((error) => {
          console.error("Error obteniendo el usuario:", error);
        });
    } else {
      console.warn("Token no encontrado en sessionStorage");
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = usuario?.usuarioId;

    if (!file) return;

    console.log("Selected file:", file);
    console.log("User ID:", id); // Verifica que el ID es correcto

    try {
      const filePath = `avatars/usuarioId${id}-${file.name}`; // Definir una ruta en Firebase Storage
      const imageUrl = await uploadImage(file, filePath);
      console.log("Uploaded image URL:", imageUrl);

      // Establecer el avatar
      setAvatar(imageUrl);
      sessionStorage.setItem("avatar", imageUrl);

      if (imageUrl && id) {
        await UpdateFotoUsuario(id, imageUrl);
        // Avatar actualizado con éxito
      } else {
        console.warn("Error: Avatar no existe.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      openErrorModal("Error subiendo la imagen.");
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleUpdateLimpiarYCambiarFoto = async () => {
    const id = usuario?.usuarioId;

    // Si hay un avatar, elimina la foto primero
    if (id && avatar) {
      try {
        // Eliminar la foto actual de la base de datos y del almacenamiento
        await UpdateLimpiaFotoUsuario(id);
        await deleteImage(avatar); // Eliminar la imagen del almacenamiento
        setAvatar(null); // Quitar el avatar de la UI
        sessionStorage.removeItem("avatar"); // Remover avatar de sessionStorage

        // Redirigir automáticamente al input de archivo para seleccionar una nueva imagen
        if (fileInputRef.current) {
          fileInputRef.current.click(); // Abre el selector de archivos
        }

        // openSuccessModal("Foto eliminada correctamente."); // Opcional: mostrar mensaje de éxito
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
        openErrorModal("Error al eliminar la foto.");
      }
    } else {
      // Si no hay avatar, simplemente abrir el selector de archivos
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      console.warn("No se puede eliminar el avatar, valor nulo.");
    }
  };

  // const handleChangeAvatarClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click(); // Simula un clic en el input de archivo
  //   }
  // };

  const handleDeleteAccount = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        logout();
        router.push("/login");
      } catch (error) {
        console.error("Error eliminando la cuenta:", error);
        openErrorModal("Error eliminando la cuenta.");
      }
    } else {
      console.warn("Token no encontrado en sessionStorage");
    }
  };

  const openConfirmationModal = (
    action: () => void,
    message: string = "¿Estás seguro de que quieres realizar esta acción?"
  ) => {
    setConfirmAction(() => action);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setConfirmAction(() => null);
    setModalMessage("");
  };

  const confirmActionHandler = () => {
    if (confirmAction) {
      confirmAction();
      closeConfirmationModal();
    }
  };

  const handleSaveChanges = async (data: SaveUserSchema) => {
    const id = usuario?.usuarioId;

    // Validación de nombre
    if (!nombre.trim()) {
      openErrorModal("El nombre no puede estar vacío.");
      return;
    }

    // Validación de clave
    if (clave.length < 6) {
      openErrorModal("La clave debe tener al menos 6 caracteres.");
      return;
    }

    // Validación de correo electrónico
    if (!correo.trim()) {
      openErrorModal("El correo no puede estar vacío.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      openErrorModal("Por favor ingresa un correo electrónico válido.");
      return;
    }

    if (id) {
      try {
        await UpdateNombreUsuario(id, data.nombre);
        await UpdateClaveUsuario(id, data.clave);
        await UpdateCorreoUsuario(id, data.correo);
        openSuccessModal("Cambios guardados exitosamente.");
      } catch (error) {
        openErrorModal("Error actualizando los datos.");
      }
    } else {
      console.warn("ID de usuario no existe.");
    }
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  const openSuccessModal = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const openErrorModal = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  return (
    <MainLayout>
      <LayoutSectionComponent>
        <LayoutDivComponent>
          {!isAdmin ? <NavSetting /> : <NavAdmin />}
          <div>
            <Title className="text-left" text="Tu configuración" />
            <p className="text-gray-500">
              Actualizar la configuración de tu cuenta
            </p>
          </div>
          <div>
            <article className="flex flex-col gap-4">
              <div className="flex items-center gap-8">
                <div>
                  {/* Mostrar imagen de placeholder si no hay avatar cargado */}
                  {!avatar && (
                    <Image
                      src={user} // Imagen de placeholder
                      alt="Avatar Placeholder"
                      className="h-28 w-28 rounded-full object-cover"
                      width={112}
                      height={112}
                    />
                  )}

                  {/* Mostrar la imagen cargada si existe avatar */}
                  {avatar && (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      className="h-28 w-28 rounded-full object-cover"
                      width={112}
                      height={112}
                    />
                  )}
                </div>

                {/* Botón para cambiar el avatar y también eliminar el existente si lo hay */}
                <ButtonCtaComponent
                  onClick={handleUpdateLimpiarYCambiarFoto} // Maneja ambas acciones
                  text="Cambiar Avatar"
                />

                {/* Input de archivo oculto */}
                <input
                  ref={fileInputRef} // Referencia para abrir el diálogo del archivo
                  type="file"
                  className="hidden"
                  onChange={handleFileChange} // Maneja el cambio de archivo
                />
              </div>

              <form onSubmit={handleSubmit(handleSaveChanges)}>
                <div className="flex flex-col gap-4 w-[30rem]">
                  <InputComponentAuth
                    name="nombre"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    register={register("nombre")}
                    error={errors.nombre}
                    FieldValue={nombre}
                  
                  />

                  {/* correo */}
                  <InputComponentAuth
                    name="correo"
                    type="email"
                    placeholder="Ingresa tu correo"
                    register={register("correo")}
                    error={errors.correo}
                    FieldValue={correo}
                  />

                  {/* Input de contraseña */}
                  <PasswordInputAuth
                    type="password"
                    name="clave"
                    placeholder="Ingresa tu contraseña"
                    register={register("clave")}
                    error={errors.clave}
                    FieldValue={clave}
                  />
                  <div className="flex gap-4">
                    <ButtonCtaComponent
                      text="Guardar los cambios"
                      type="submit"
                      isSubmitting={isSubmitting}
                    />

                    <ButtonCtaComponent
                      className="bg-red-500 hover:bg-red-600"
                      text="Eliminar Cuenta"
                      onClick={() =>
                        openConfirmationModal(
                          handleDeleteAccount,
                          "¿Estás seguro de que quieres eliminar tu cuenta?"
                        )
                      }
                    />
                  </div>
                </div>
              </form>
            </article>
          </div>
        </LayoutDivComponent>

        {/* Modales */}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onCancel={closeConfirmationModal}
            onConfirm={confirmActionHandler}
            message={modalMessage}
          />
        )}

        {isSuccessModalOpen && (
          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={closeSuccessModal}
            message={modalMessage}
          />
        )}

        {isErrorModalOpen && (
          <ErrorModal
            isOpen={isErrorModalOpen}
            onClose={closeErrorModal}
            message={modalMessage}
          />
        )}
      </LayoutSectionComponent>
    </MainLayout>
  );
}
