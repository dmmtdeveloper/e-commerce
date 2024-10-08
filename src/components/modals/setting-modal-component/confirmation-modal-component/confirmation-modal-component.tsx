import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-3xl">
        <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
        <p className="text-sm">{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <ButtonCtaComponent onClick={onConfirm} className="bg-red-500 hover:bg-red-600 transition-all duration-300" text="Confirmar"/>
          <ButtonCtaComponent onClick={onCancel} text="Cancelar"/>
      
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
