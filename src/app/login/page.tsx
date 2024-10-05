"use client";

import { login } from "../../utils/authHelpers";
import { LoginUpSchema, userLoginSchema } from "@/validations/userSchema";
import { Reveal } from "@/components/animation/Reveal";
import { Title } from "@/components/title/Title";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import clsx from "clsx";
import Image from "next/image";
import InputComponentAuth from "@/components/input/inputComponenAuth";
import Link from "next/link";
import loginImage from "@/public/assets/img/Banner_login.jpg";
import MainLayout from "../../components/layouts/MainLayout";
import PasswordInputAuth from "@/components/input/PasswordIInputAuth";
import SubmitButton from "@/components/buttons-components/AuthButton";

export default function LoginPage() {
  const {
    register, // Registrar los campos del formulario
    handleSubmit, // Manejar el envío del formulario
    formState: { errors, isSubmitting }, // Manejar los errores de validación
    reset,
  } = useForm<LoginUpSchema>({ resolver: zodResolver(userLoginSchema) });

  const router = useRouter();

  const handleLogin = async (data: LoginUpSchema) => {
    try {
      // Cambiar la llamada a `login` para pasar un solo argumento
      await login({
        email: data.email,
        password: data.password,
      });
      reset();
      // alert("Login exitoso");
      router.push("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // alert("Error en el login");
    }
  };

  return (
    <MainLayout>
      <Reveal>
        <section
          className={clsx(
            "min-h-screen flex items-center justify-center bg-slate-100"
          )}
        >
          <article className="2xl:w-[60rem] mt-40 2xl:mt-0 p-4 grid grid-cols-1 2xl:grid-cols-2 flex-col-reverse">
            {/* Imagen */}
            <div className="flex justify-center items-center">
              <Image
                className="h-[30rem] 2xl:w-[24rem] w-full shadow-xl rounded-3xl mb-8"
                width={800}
                height={1500}
                alt="login"
                src={loginImage}
                priority
              />
            </div>

            {/* Formulario */}
            <div className="flex flex-col gap-10 bg-slate-100 2xl:px-20 2xl:py-10 p-4 w-full mt-8 2xl:mb-0">
              <Title className="text-center" text="Iniciar Sesión" />

              <form
                onSubmit={handleSubmit(handleLogin)}
                className="flex flex-col gap-4"
              >
                {/* correo */}
                <InputComponentAuth
                  name="email"
                  type="email"
                  placeholder="Ingresa tu correo"
                  register={register("email")}
                  error={errors.email}
                />

                {/* Input de contraseña */}
                <PasswordInputAuth
                  type="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  register={register("password")}
                  error={errors.password}
                />

                <SubmitButton
                  text="Iniciar sesión"
                  type="submit"
                  isSubmitting={isSubmitting}
                />
              </form>
              <div className="flex gap-4">
                <p className="text-sm">¿Eres nuevo?</p>
                <Link
                  className="text-blue-500 hover:underline text-sm"
                  href="/register"
                >
                  Regístrate
                </Link>
              </div>
            </div>
          </article>
        </section>
      </Reveal>
    </MainLayout>
  );
}

