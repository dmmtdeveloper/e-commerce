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
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
        <p>{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={onConfirm} className="bg-blue-500 text-white p-2 rounded">
            Confirmar
          </button>
          <button onClick={onCancel} className="bg-gray-500 text-white p-2 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
