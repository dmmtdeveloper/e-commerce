import Lottie from "lottie-react";
import sucessAnimation from "@/public/assets/animation/Animation-success.json";
import React from "react";
import ButtonModalClose from "../../button-modal/button-modal-close";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-3xl">
        <div className="flex items-center justify-center">
          <Lottie className="w-52" animationData={sucessAnimation} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Éxito</h2>
        <p className="text-sm">{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <ButtonModalClose onClick={onClose} text="Cerrar" />
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
