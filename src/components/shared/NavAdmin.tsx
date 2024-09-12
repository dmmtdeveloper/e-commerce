import Link from "next/link";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { CiDeliveryTruck } from "react-icons/ci";

interface NavAdminProps {
  className?: string; // Aceptar la prop className
}

const NavAdmin: React.FC<NavAdminProps> = ({ className }) => {
  return (
    <section className={className}> {/* Aplicar className al contenedor principal */}
      <div className="flex flex-col gap-10">
        {/* Admin section */}
        <div>
          <h3 className="text-lg font-semibold">Admin</h3>
          <div className="flex gap-10">
            <div className="flex flex-col items-center justify-center">
              <Link href={"/admin/products"} className="cursor-pointer text-xl">
                Productos
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Link href={"/admin/users"} className="cursor-pointer text-xl">
                Usuarios
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Link href={"/admin/orders"} className="cursor-pointer text-xl">
                Pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavAdmin;
