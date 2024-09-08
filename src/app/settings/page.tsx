"use client";
import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { NavSetting } from "@/components/shared/NavSetting";
import Image from "next/image";
import avatar from "@/public/assets/img/james.png";
export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <MainLayout>
      <section className="p-4 mt-32 gap-10 flex flex-col">
        <NavSetting />

        <div>
          <h1 className="font-semibold text-4xl">Tu Configuración</h1>
          <p>actualizar la configuración de tu cuenta</p>
        </div>

        {/* <div className="pb-10">
          <p>Avatar</p>
          <div className="flex gap-2">
            <Image
              className="rounded-full"
              src={avatar}
              width={60}
              height={60}
              alt="avatar"
              priority
            />
            <button className=" rounded-lg px-3 bg-purple-700 text-white text-sm">
              Cambiar avatar
            </button>
          </div>
        </div> */}

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">
            Guardar cambios
          </button>
        </form>
      </section>
    </MainLayout>
  );
}
