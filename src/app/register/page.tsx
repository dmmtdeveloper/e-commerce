"use client";

import { AuthButton } from "@/components/buttons-components/AuthButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/input/InputPassword";
import { InputComponent } from "@/components/input/InputComponent";
import { register } from "../../utils/authHelpers";
import { Title } from "@/components/title/Title";
import { useRouter } from "next/navigation"; // Correcto para la carpeta 'app'
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "../../components/layouts/MainLayout";
import registerImage from "@/public/assets/img/register.jpg";
import { Reveal } from "@/animation/Reveal";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    correo: "",
    clave: "",
    nombre: "",
  });

  const { register, handleSubmit } = useForm();
  const { correo, clave, nombre } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Mostrar contraseña al mantener presionado
  const handleMouseDown = () => {
    setShowPassword(true);
  };

  // Ocultar contraseña al soltar el botón del mouse
  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(nombre, correo, clave);
      alert("Usuario registrado con éxito");
      router.push("/login"); // Redirige a la página de login
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error en el registro");
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
            <div className="flex flex-col  gap-10 bg-slate-100 2xl:px-20 2xl:py-10 p-4 w-full mt-8 2xl:mb-0">
              <Title className="text-center" text="Registro" />

              <form onSubmit={handleSubmit(data => {console.log(data)})} className="flex flex-col gap-4">
                <InputComponent
                  type="text"
                  value={nombre}
                  placeholder="Ingresa tu Nombre"
                  // onChange={handleChange}
                  
                  {...register("name")}
                  />
                <InputComponent
                  type="email"
                  value={correo}
                  placeholder="Ingresa tu correo electrónico"
                  // onChange={handleChange}
                  // name="correo"
                  {...register("correo")}
                  />

                <Input
                  type={showPassword ? "text" : "password"}
                  // name="clave"
                  placeholder="Ingrese contraseña"
                  value={clave}
                  // onChange={handleChange}
                  icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  {...register("clave")}
                  />

                <AuthButton text="Registrate" />
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
