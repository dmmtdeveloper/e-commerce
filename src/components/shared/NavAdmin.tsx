import Link from "next/link";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";

interface NavAdminProps {
  className?: string; // Aceptar la prop className
}

const NavAdmin: React.FC<NavAdminProps> = ({ className }) => {
  return (
    <section className={className}>
      {" "}
      <div className="flex flex-col gap-10">
        <div className="flex gap-10">
          <div className="hover:text-blue-500 cursor-pointer">
            <Link
              href={"/admin/products"}
              className="cursor-pointer flex flex-col items-center"
            >
              <BsBoxSeam className="text-2xl" />
              Productos
            </Link>
          </div>

          <div className="hover:text-blue-500 cursor-pointer">
            <Link
              href={"/admin/users"}
              className="flex flex-col items-center justify-center"
            >
              <FaUser className="text-2xl" />
              Usuarios
            </Link>
          </div>
          <div className="hover:text-blue-500 cursor-pointer">
            <Link
              href={"/admin/orders"}
              className="flex flex-col items-center justify-center"
            >
              <FaBagShopping className="text-2xl" />
              Pedidos
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center hover:text-blue-500 cursor-pointer">
            <Link href={"/orders"} className="flex flex-col items-center">
              <CiDeliveryTruck className="text-2xl" />
              Ordenes
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center hover:text-blue-500 cursor-pointer">
            <Link
              href={"/settings"}
              className="cursor-pointer flex flex-col items-center"
            >
              <AiOutlineSetting className="text-2xl" />
              Configuración
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavAdmin;
