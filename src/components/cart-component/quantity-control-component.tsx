import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { PiTrash } from "react-icons/pi";

interface QuantityControlProps {
  id: string;
  quantity: number;
  handleDecreaseQuantity: (id: string, quantity: number) => void;
  handleIncreaseQuantity: (id: string, quantity: number) => void;
  handleRemove: (id: string) => void;
}
const QuantityControl: React.FC<QuantityControlProps> = ({
  id,
  quantity,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleRemove,
}) => {
  return (
    <div className="flex items-center flex-col gap-5">
      <div className="flex gap-4 items-center">
        <AiOutlineMinus
          className="cursor-pointer"
          onClick={() => handleDecreaseQuantity(id, quantity)}
        />
        <span>{quantity}</span>
        <AiOutlinePlus
          className="cursor-pointer"
          onClick={() => handleIncreaseQuantity(id, quantity)}
        />
      </div>
      <div className="flex gap-2 items-center cursor-pointer">
        <PiTrash className="text-slate-500 cursor-pointer" />
        <button
          onClick={() => handleRemove(id)}
          className="text-sm font-light hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default QuantityControl;
