
import React from 'react';
import {  VmReportePedidos } from '@/types/types';


interface ResumenCardPedidosProps {
  data: VmReportePedidos[];
}

const ResumenCardPedidos: React.FC<ResumenCardPedidosProps> = ({ data }) => {
  return (
    <div>
      {data.map((item) => (
        <div key={item.pedidoId + "-" + item.pedidoDetalleId}>
          <h3>Pedido ID: {item.pedidoId}</h3>
          <p>Estado: {item.estadoPedido}</p>
          <p>Valor Total: {item.valorTotal}</p>
          <p>Fecha: {item.fecha ? item.fecha.toString() : 'Fecha no disponible'}</p>
        </div>
      ))}
    </div>
  );
};

export default ResumenCardPedidos;