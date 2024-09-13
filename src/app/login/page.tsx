"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../layouts/MainLayout";
import { login } from "../../utils/authHelpers";
import Image from "next/image";
import loginImage from "@/public/assets/img/Banner_login.jpg";
import { AuthButton } from "@/components/buttons/AuthButton";
import { Input } from "@/components/input/InputPassword";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputComponent } from "@/components/input/InputComponent";
import Link from "next/link";

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
      <section className=" min-h-screen grid grid-cols-2 justify-between">
        <article>
          <Image
            className="h-[54rem] w-[44rem] "
            width={900}
            height={1500}
            alt="login"
            src={loginImage}
          />
        </article>
        <article className="w-[44rem] mt-64 ">
          <div className="flex flex-col shadow-md gap-10 bg-slate-100 px-20 py-20 rounded-3xl">
            <h1 className="text-3xl font-semibold text-center">
              Iniciar Sesión
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <InputComponent
                type="email"
                value={email}
                placeholder="Ingresa tu correo electrónico"
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              />

              <AuthButton text="Iniciar Sesión" />
            </form>
            <div className="flex gap-4">
              <p>¿Eres nuevo?</p>
              <Link className="text-blue-500 underline" href={"/register"}>Regístrate</Link>
            </div>
          </div>
        </article>
      </section>
    </MainLayout>
  );
}
