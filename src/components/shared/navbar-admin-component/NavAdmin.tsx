import Link from "next/link";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { FaBagShopping, FaUsers } from "react-icons/fa6";
import { AiFillProduct} from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";

interface NavAdminProps {
  className?: string; // Aceptar la prop className
}

const NavAdmin: React.FC<NavAdminProps> = ({ className }) => {
  return (
    <section  className={`hidden md:block 2xl:block ${className}`}>
      {" "}
      <div className="flex flex-col gap-10">
        <div className="flex gap-10">
          <div className="hover:text-blue-500 cursor-pointer">
            <Link
              href={"/admin/products"}
              className="cursor-pointer flex flex-col items-center"
            >
              <AiFillProduct className="text-2xl" />
              <p className="text-sm">Productos</p>
            </Link>
          </div>

          <div className="hover:text-blue-500 cursor-pointer">
            <Link
              href={"/admin/users"}
              className="flex flex-col items-center justify-center"
            >
              <FaUsers className="text-2xl" />
              <p className="text-sm">Usuarios</p>

            </Link>
          </div>
          <div className="hover:text-blue-500 cursor-pointer">
            <Link
              href={"/admin/orders"}
              className="flex flex-col items-center justify-center"
            >
              <FaBagShopping className="text-2xl" />
              <p className="text-sm">Pedidos</p>

            </Link>
          </div>

          <div className="flex flex-col items-center justify-center hover:text-blue-500 cursor-pointer">
            <Link href={"/orders"} className="flex flex-col items-center">
              <TbTruckDelivery className="text-2xl" />
              <p className="text-sm">Ordenes</p>

            </Link>
          </div>

          <div className="flex flex-col items-center justify-center hover:text-blue-500 cursor-pointer">
            <Link
              href={"/settings"}
              className="cursor-pointer flex flex-col items-center"
            >
              <AiOutlineSetting className="text-2xl" />
              <p className="text-sm">Configuración</p>

            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavAdmin;
