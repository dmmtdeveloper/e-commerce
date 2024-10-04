import Link from "next/link";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { FaBagShopping, FaUsers } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { usePathname } from "next/navigation"; // Importar el hook para obtener la ruta actual

interface NavAdminProps {
  className?: string; // Aceptar la prop className
}

const NavAdmin: React.FC<NavAdminProps> = ({ className }) => {
  const pathname = usePathname(); // Obtener la ruta actual

  return (
    <section
      className={`hidden md:block md:pt-10 2xl:pt-0 lg:pt-10 2xl:block ${className}`}
    >
      <div className="flex flex-col gap-10">
        <div className="flex gap-10">
          <div
            className={`hover:text-blue-500 cursor-pointer ${
              pathname === "/admin/products"
                ? "active text-blue-500 font-medium"
                : ""
            }`}
          >
            <Link
              href="/admin/products"
              className="cursor-pointer flex flex-col items-center"
            >
              <AiFillProduct className="text-2xl" />
              <p className="text-sm">Productos</p>
            </Link>
          </div>

          <div
            className={`hover:text-blue-500 cursor-pointer ${
              pathname === "/admin/users"
                ? "active text-blue-500 font-medium"
                : ""
            }`}
          >
            <Link
              href="/admin/users"
              className="flex flex-col items-center justify-center"
            >
              <FaUsers className="text-2xl" />
              <p className="text-sm">Usuarios</p>
            </Link>
          </div>

          <div
            className={`hover:text-blue-500 cursor-pointer ${
              pathname === "/admin/orders"
                ? "active text-blue-500 font-medium"
                : ""
            }`}
          >
            <Link
              href="/admin/orders"
              className="flex flex-col items-center justify-center"
            >
              <FaBagShopping className="text-2xl" />
              <p className="text-sm">Pedidos</p>
            </Link>
          </div>

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
              pathname === "/settings" ? "active text-blue-500 font-medium" : ""
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

export default NavAdmin;
