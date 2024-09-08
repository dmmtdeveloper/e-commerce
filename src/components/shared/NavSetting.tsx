import Link from "next/link";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { CiDeliveryTruck } from "react-icons/ci";

export const NavSetting = () => {
  return (
    <section>
      <div className="flex gap-10">
        <div className="flex flex-col items-center justify-center">
          <Link href={"/orders"} className="cursor-pointer text-2xl">
            <CiDeliveryTruck />
          </Link>
          <p>Ordenes</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Link href={"/settings"} className="cursor-pointer text-2xl">
            <AiOutlineSetting />
          </Link>
          <p>Configuración</p>
        </div>
      </div>
    </section>
  );
};
