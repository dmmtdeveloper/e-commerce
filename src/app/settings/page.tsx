"use client";
import { useState, useEffect, useRef } from "react";
import { Title } from "@/components/title/Title";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { NavSetting } from "@/components/shared/NavSetting";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateEliminadoUsuario } from "@/utils/authHelpers";
import MainLayout from "@/components/layouts/MainLayout";
import LayoutDivComponent from "@/components/layouts/layout-div-component";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
import Image from "next/image";
import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import InputComponentAuth from "@/components/input/inputComponenAuth";
import PasswordInputAuth from "@/components/input/PasswordIInputAuth";
import ConfirmationModal from "@/components/modals/setting-modal-component/confirmation-modal-component/confirmation-modal-component";
import SuccessModal from "@/components/modals/setting-modal-component/sucess-modal-component/success-modal-component";
import ErrorModal from "@/components/modals/setting-modal-component/error-modal-component/error-modal-component";
import user from "@/public/assets/img/user.png";

import { useAuthStore } from "@/store/useAuthStore";
import {
  GetUsuarioByToken,
  UpdateNombreUsuario,
  UpdateClaveUsuario,
  UpdateLimpiaFotoUsuario,
  UpdateFotoUsuario,
  UpdateCorreoUsuario,
  Usuario,
} from "@/utils/authHelpers";
import { uploadImage, deleteImage } from "@/utils/firebase";
import { SaveUserSchema, userSaveSchema } from "@/validations/userSchema";

export default function SettingsPage() {
  // Estados del componente
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const { logout, isAdmin } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SaveUserSchema>({
    resolver: zodResolver(userSaveSchema),
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      GetUsuarioByToken(token)
        .then((usuario: Usuario) => {
          console.log("Datos del usuario:", usuario);
          setUsuario(usuario); // Guarda el usuario en el estado
          setAvatar(usuario.foto || null); // Establece el avatar
          reset({
            // Establece los valores del formulario
            nombre: usuario.nombre,
            correo: usuario.correo,
            clave: usuario.clave,
          });
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

    if (!file || !id) return;

    try {
      const filePath = `avatars/usuarioId${id}-${file.name}`;
      const imageUrl = await uploadImage(file, filePath);
      setAvatar(imageUrl);
      sessionStorage.setItem("avatar", imageUrl);
      await UpdateFotoUsuario(id, imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      openErrorModal("Error subiendo la imagen.");
    }
  };

  const handleUpdateLimpiarYCambiarFoto = async () => {
    const id = usuario?.usuarioId;

    if (id && avatar) {
      try {
        await UpdateLimpiaFotoUsuario(id);
        await deleteImage(avatar);
        setAvatar(null);
        sessionStorage.removeItem("avatar");
        fileInputRef.current?.click();
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
        openErrorModal("Error al eliminar la foto.");
      }
    } else {
      fileInputRef.current?.click();
      console.warn("No se puede eliminar el avatar, valor nulo.");
    }
  };

  const handleDeleteAccount = async () => {
    const token = sessionStorage.getItem("token");
    const id = usuario?.usuarioId;
  
    if (token && id) {
      try {
        // Llamar a la API para actualizar el estado de eliminado del usuario
        await UpdateEliminadoUsuario(id, true);
  
        openConfirmation("Cuenta eliminada con éxito");
  
        // Mostrar modal de éxito después de 3 segundos
        setTimeout(() => {
          // openSuccessModal("Cuenta eliminada con éxito.");
  
          // Cerrar el modal después de 3 segundos
          setTimeout(() => {
            closeSuccessModal();
  
            // Cerrar sesión y redirigir al login solo después de que el modal se cierre
            logout();
            router.push("/login");
          }, 1000);
  
        }, 2000); // Aquí estableces el retraso de 3 segundos antes de abrir el modal
      } catch (error) {
        console.error("Error eliminando la cuenta:", error);
        openErrorModal("Error eliminando la cuenta.");
      }
    } else {
      console.warn("Token no encontrado o ID de usuario no existe");
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
    setConfirmAction(null);
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

    if (id) {
      try {
        await UpdateNombreUsuario(id, data.nombre);
        await UpdateClaveUsuario(id, data.clave);
        await UpdateCorreoUsuario(id, data.correo);
        openSuccessModal("Datos actualizados con exito.");
        setTimeout(() => {
  
          // Cerrar el modal después de 3 segundos
          setTimeout(() => {
            closeSuccessModal();
  
            // Cerrar sesión y redirigir al login solo después de que el modal se cierre
            // logout();
            // router.push("/settings");
          }, 1000);
  
        }, 2000); // Aquí estableces el retraso de 3 segundos antes de abrir el modal
      } catch (error) {
        openErrorModal("Error actualizando los datos.");
      }
    } else {
      console.warn("ID de usuario no existe.");
    }
  };

  const openSuccessModal = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const openConfirmation = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const openErrorModal = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };



  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  if (!usuario) {
    return <div>Cargando...</div>;
  }
  return (
    <MainLayout>
      <LayoutSectionComponent>
        <LayoutDivComponent>
          {isAdmin ? <NavAdmin /> : <NavSetting />}
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
                  {!avatar ? (
                    <Image
                      src={user}
                      alt="Avatar Placeholder"
                      className="h-28 w-28 rounded-full object-cover"
                      width={112}
                      height={112}
                    />
                  ) : (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      className="h-28 w-28 rounded-full object-cover"
                      width={112}
                      height={112}
                    />
                  )}
                </div>
                <ButtonCtaComponent
                  onClick={handleUpdateLimpiarYCambiarFoto}
                  text="Cambiar Avatar"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <section>
                <div className="flex flex-col gap-4 w-[30rem]">
                  <InputComponentAuth
                    name="nombre"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    register={register("nombre")}
                    error={errors.nombre}
                  />
                  <InputComponentAuth
                    name="correo"
                    type="email"
                    placeholder="Ingresa tu correo"
                    register={register("correo")}
                    error={errors.correo}
                  />
                  <PasswordInputAuth
                    name="clave"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    register={register("clave")}
                    error={errors.clave}
                  />
                  <div className="flex gap-4">
                    <ButtonCtaComponent
                      text="Guardar los cambios"
                      type="button" // Cambiar el tipo a "button" en lugar de "submit" aquí
                      isSubmitting={isSubmitting}
                      onClick={handleSubmit(handleSaveChanges)} // Cambiar a onClick con handleSubmit
                    />

                    {/* <button type="submit">hola</button> */}
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
              </section>
            </article>
          </div>
        </LayoutDivComponent>

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
