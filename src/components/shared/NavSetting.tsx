import Link from "next/link";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { CiDeliveryTruck } from "react-icons/ci";

export const NavSetting = () => {
  return (
    <section>
      <div className="flex gap-10">
        <div className="flex flex-col items-center justify-center hover:text-blue-500 cursor-pointer">
          <Link href="/orders" className="flex flex-col items-center">
            <CiDeliveryTruck className="text-2xl" />
            Ordenes
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center hover:text-blue-500 cursor-pointer">
          <Link
            href="/settings"
            className="cursor-pointer flex flex-col items-center"
          >
            <AiOutlineSetting className="text-2xl" />
            Configuración
          </Link>
        </div>
      </div>
    </section>
  );
};
