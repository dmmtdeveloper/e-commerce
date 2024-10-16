"use client";
import { registerUser } from "../../utils/authHelpers";
import { Title } from "@/components/title/Title";
import { useRouter } from "next/navigation"; // Correcto para la carpeta 'app'

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "../../components/layouts/MainLayout";
import registerImage from "@/public/assets/img/register.jpg";
import { Reveal } from "@/components/animation/Reveal";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, userRegisterSchema } from "@/validations/userSchema";

import InputComponentAuth from "@/components/input/inputComponenAuth";
import SubmitButton from "@/components/buttons-components/AuthButton";
import PasswordInputAuth from "@/components/input/PasswordIInputAuth";

export default function RegisterPage() {
  const {
    register, // Registrar los campos del formulario
    handleSubmit, // Manejar el envío del formulario
    formState: { errors, isSubmitting }, // Manejar los errores de validación
    reset,
  } = useForm<SignUpSchema>({ resolver: zodResolver(userRegisterSchema) });

  const router = useRouter();

  const handleRegister = async (data: SignUpSchema) => {
    try {
      await registerUser(data.nombre, data.correo, data.clave);
      // alert("Usuario registrado con éxito");
      reset();

      router.push("/login"); // Redirige a la página de login
    } catch (error: any) {
      const errorResponse = error.response?.data?.errors;

      if (errorResponse) {
        if (errorResponse.Nombre) {
          alert(`Error en el nombre: ${errorResponse.Nombre.join(", ")}`);
        }
        if (errorResponse.Correo) {
          alert(`Error en el correo: ${errorResponse.Correo.join(", ")}`);
        }
        if (errorResponse.Clave) {
          alert(`Error en la clave: ${errorResponse.Clave.join(", ")}`);
        }
      } else {
        console.error("Error al registrar usuario:", error.message);
        alert("Error en el registro");
      }
    }
  };

  return (
    <MainLayout>
      <section
        className={clsx(
          "min-h-screen flex items-center justify-center bg-slate-100"
        )}
      >
        <article className="2xl:w-[60rem] mt-40 2xl:mt-0 p-4 grid grid-cols-1 2xl:grid-cols-2 flex-col-reverse">
          {/* Imagen */}

          <Reveal>
            <div className="flex justify-center items-center">
              <Image
                className="h-[30rem] 2xl:w-[24rem] w-full shadow-xl rounded-3xl"
                width={800}
                height={1500}
                alt="register"
                src={registerImage}
                priority
              />
            </div>
          </Reveal>

          {/* Formulario */}
          <Reveal>
            <div className="flex flex-col  gap-10 bg-slate-100 2xl:pt-0 2xl:px-20 2xl:py-10 p-4 w-full mt-8 2xl:mb-0">
              <Title className="text-center" text="Registro" />

              <form
                onSubmit={handleSubmit(handleRegister)}
                className="flex flex-col gap-4"
              >
                {/* nombre */}

                <InputComponentAuth
                  name="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  register={register("nombre")}
                  error={errors.nombre}
                />

                {/* correo */}
                <InputComponentAuth
                  name="correo"
                  type="email"
                  placeholder="Ingresa tu correo"
                  register={register("correo")}
                  error={errors.correo}
                />

                {/* Input de contraseña */}
                <PasswordInputAuth
                  type="password"
                  name="clave"
                  placeholder="Ingresa tu contraseña"
                  register={register("clave")}
                  error={errors.clave}
                />

                {/* Input para confirmar contraseña */}
                <PasswordInputAuth
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  register={register("confirmPassword")}
                  error={errors.confirmPassword}
                />

                <SubmitButton
                  text="Registrate"
                  type="submit"
                  isSubmitting={isSubmitting}
                />
                {/* <button disabled={isSubmitting} type="submit">
                  registro
                </button> */}
              </form>
              <div className="flex gap-4">
                <p className="text-sm">¿Ya tienes una cuenta?</p>
                <Link
                  className="text-blue-500 hover:underline text-sm"
                  href="/login"
                >
                  Inicia sesión
                </Link>
              </div>
            </div>
          </Reveal>
        </article>
      </section>
    </MainLayout>
  );
}
