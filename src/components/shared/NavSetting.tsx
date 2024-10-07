import Link from "next/link";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { usePathname } from "next/navigation";

// Importar el hook para obtener la ruta actual
export const NavSetting = () => {
  const pathname = usePathname(); // Obtener la ruta actual
  return (
    <section className={`hidden md:block md:pt-10 2xl:pt-10 lg:pt-10 2xl:block`}>
      <div className="flex flex-col gap-10">
        <div className="flex gap-10">
          <div
            className={`flex flex-col items-center justify-center hover:text-blue-500 cursor-pointer ${
              pathname === "/orders" ? "active text-blue-500 font-medium" : ""
            }`}
          >
            <Link href="/orders" className="flex flex-col items-center">
              <TbTruckDelivery className="text-2xl" />
              <p className="text-sm">Mis Compras</p>
            </Link>
          </div>

          <div
            className={`flex flex-col items-center  justify-center hover:text-blue-500 cursor-pointer ${
              pathname === "/settings"
                ? "active text-blue-500 font-medium"
                : ""
            }`}
          >
            <Link
              href="/settings"
              className="cursor-pointer flex flex-col items-center"
            >
              <AiOutlineSetting className="text-2xl" />
              <p className="text-sm">Configuración</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Agregar estilos para el item activo */}
    </section>
  );
};
