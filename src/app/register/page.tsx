"use client"; 

import { AuthButton } from "@/components/buttons/AuthButton";
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
import MainLayout from "../layouts/MainLayout";
import registerImage from "@/public/assets/img/register.jpg";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    correo: "",
    clave: "",
    nombre: "",
  });

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
      await register(correo, clave, nombre);
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
          "min-h-screen mt-32 2xl:mt-0",
          "2xl:grid 2xl:grid-cols-2",
          "md:flex md:flex-col-reverse",
          "flex flex-col-reverse",
          "items-center justify-center"
        )}
      >
        <Image
          className="2xl:h-[54rem] 2xl:w-[44rem] w-full"
          width={900}
          height={1500}
          alt="register"
          src={registerImage}
          priority
        />

        <article className="2xl:w-[44rem] mt-40 2xl:mt-0 w-[20rem]">
          <div className="flex flex-col shadow-md gap-10 bg-slate-100 2xl:px-20 py-20 rounded-3xl px-4">
            <Title text="Registro" />

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <InputComponent
                type="text"
                value={nombre}
                placeholder="Ingresa tu Nombre"
                onChange={handleChange}
                name="nombre"
              />
              <InputComponent
                type="email"
                value={correo}
                placeholder="Ingresa tu correo electrónico"
                onChange={handleChange}
                name="correo"
              />

              <Input
                type={showPassword ? "text" : "password"}
                name="clave"
                placeholder="Ingrese contraseña"
                value={clave}
                onChange={handleChange}
                icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              />

              <AuthButton text="Registrate" />
            </form>
            <div className="flex gap-4">
              <p>¿Ya tienes una cuenta?</p>
              <Link className="text-blue-500 underline" href="/login">
                Inicia sesión
              </Link>
            </div>
          </div>
        </article>
      </section>
    </MainLayout>
  );
}
