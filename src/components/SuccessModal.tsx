import React, { useState } from 'react';
import SuccessModal from './SuccessModal';

const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Abrir Modal</button>
      
      <SuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        message="Tu pedido ha sido creado con éxito"
      />
    </div>
  );
};

export default ParentComponent;
