import React from "react";
import { IoClose } from "react-icons/io5";

interface CloseMenuButton {
  onClick: () => void;
}

const ClouseMenuButton: React.FC<CloseMenuButton> = ({ onClick }) => {
  return (
    <button
      className="absolute right-4 text-black hover:text-red-500"
      onClick={onClick}
      aria-label="Cerrar menú"
    >
      <IoClose className="2xl:block hidden text-1xl w-8" />
    </button>
  );
};

export default ClouseMenuButton;
