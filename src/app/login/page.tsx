"use client";
import { AuthButton } from "@/components/buttons/AuthButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/input/InputPassword";
import { InputComponent } from "@/components/input/InputComponent";
import { login } from "../../utils/authHelpers";
import { Title } from "@/components/title/Title";
import { useRouter } from "next/navigation";
import { useState } from "react";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import loginImage from "@/public/assets/img/Banner_login.jpg";
import MainLayout from "../layouts/MainLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Mostrar contraseña al mantener presionado
  const handleMouseDown = () => {
    setShowPassword(true);
  };

  // Ocultar contraseña al soltar el botón del mouse
  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const router = useRouter();
  // const loginStore = login();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });

      alert("Login exitoso");
      // loginStore(email, data.token); // Inicia sesión en el store
      router.push("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error en el login");
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
          alt="login"
          src={loginImage}
          priority
        />

        <article className="2xl:w-[44rem] mt-40 2xl:mt-0 w-[20rem]">
          <div className="flex flex-col shadow-md gap-10 bg-slate-100 2xl:px-20 py-20 rounded-3xl px-4">
            <Title text="Iniciar Sesión" />
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <InputComponent
                type="email"
                value={email}
                placeholder="Ingresa tu correo electrónico"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                name="password"
              />

              <AuthButton text="Iniciar Sesión" />
            </form>
            <div className="flex gap-4">
              <p>¿Eres nuevo?</p>
              <Link className="text-blue-500 underline" href={"/register"}>
                Regístrate
              </Link>
            </div>
          </div>
        </article>
      </section>
    </MainLayout>
  );
}
