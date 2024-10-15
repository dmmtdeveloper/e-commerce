import React from "react";
import Link from "next/link";
import ButtonCtaComponent from "@/components/buttons-components/button-cta-component"; // Asegúrate de tener este componente
import { TbLockFilled } from "react-icons/tb";
import { GoShieldCheck } from "react-icons/go";
import { FaCarSide } from "react-icons/fa";
import SuccessModal from "../SuccessModal";

interface CartSummaryComponentProps {
  items: {
    price: number;
    quantity: number;
  }[];
  formatCurrency: Intl.NumberFormat;
  handlePedido: (e: React.FormEvent) => Promise<void>; // Ajustamos la firma de handlePedido
 
}

const CartSummaryComponent: React.FC<CartSummaryComponentProps> = ({
  items,
  formatCurrency,
  handlePedido,
  
}) => {
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <div className="border border-gray-300 p-8 2xl:mt-[116px] mt-0">
        <h2 className="text-lg font-semibold mb-8">Resumen de tu compra</h2>
        <div className="mb-2 flex justify-between">
          <span>Total transferencia</span>
          <span className="font-bold">{formatCurrency.format(total)}</span>
        </div>
        <div className="2xl:flex gap-2">
          <FaCarSide className="text-[18px] text-slate-500" />
          <p className="text-sm text-gray-500 mb-4">
            El costo de envío se calculará al añadir la dirección.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Link href="/">
            <ButtonCtaComponent
              className="w-full py-4 font-semibold"
              text="Agregar más productos"
            />
          </Link>

          <form onSubmit={handlePedido}>
            {" "}
            {/* Cambiamos el onClick por un form */}
            <ButtonCtaComponent
              className="bg-green-500 py-4 hover:bg-green-600 w-full font-semibold"
              text="Crear pedido"
              type="submit" // Usamos un botón de tipo submit
              // onClick={() => SuccessModal}
            />
          </form>
          <div className="2xl:flex 2xl:items-center 2xl:gap-8">
            <div className="flex gap-2 items-center">
              <TbLockFilled className="text-[18px] text-slate-500" />
              <p className="text-gray-400 text-sm">Pago 100% seguro</p>
            </div>

            <div className="flex gap-2 items-center">
              <GoShieldCheck className="text-1xl text-slate-500" />
              <p className="text-gray-400 text-sm">Garantía en tus productos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummaryComponent;
