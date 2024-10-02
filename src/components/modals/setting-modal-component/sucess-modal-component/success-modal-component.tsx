import React from "react";

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
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Éxito</h2>
        <p>{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={onClose} className="bg-blue-500 text-white p-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
