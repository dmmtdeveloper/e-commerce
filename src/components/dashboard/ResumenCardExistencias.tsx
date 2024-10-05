
import React from 'react';
import { VmReporteExistencias } from '@/types/types';


interface ResumenCardExistenciasProps {
  data: VmReporteExistencias[];
}

const ResumenCardExistencias: React.FC<ResumenCardExistenciasProps> = ({ data }) => {
  return (
    <div>
      {data.map((item) => (
        <div key={item.productoId }>
          <h3>{item.nombre}</h3>
          <p>Precio: {item.precio}</p>
          <p>Stock Disponible: {item.stockDisponible}</p>
          <p>Valor Total: {item.stockValorado}</p>
          <p>{item.habilitado ? 'Habilitado' : 'No Habilitado'}</p>
        </div>
      ))}
    </div>
  );
};

export default ResumenCardExistencias;