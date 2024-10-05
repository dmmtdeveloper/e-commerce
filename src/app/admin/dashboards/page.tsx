"use client";
import { useEffect, useState } from 'react';
import ReporteChartExistencias from '@/components/dashboard/ReporteChartExistencias';
import ReporteChartPedidos from '@/components/dashboard/ReporteChartPedidos';
import ResumenCardExistencias from '@/components/dashboard/ResumenCardExistencias';
import ResumenCardPedidos from '@/components/dashboard/ResumenCardPedidos';
import { VmReporteExistencias, VmReportePedidos } from '@/types/types';

const Reportes: React.FC = () => {
  const [dataExistencias, setDataExistencias] = useState<VmReporteExistencias[]>([]);
  const [dataPedidos, setDataPedidos] = useState<VmReportePedidos[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseExistencias = await fetch('http://localhost:5239/api/Reporte/ReporteExistencias');
        const existencias = await responseExistencias.json();
        setDataExistencias(existencias);

        const responsePedidos = await fetch('http://localhost:5239/api/Reporte/ReportePedidos');
        const pedidos = await responsePedidos.json();
        setDataPedidos(pedidos);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Reportes de Productos y Pedidos</h1>
      
      {/* <h2>Resumen de Existencias</h2>
      <ResumenCardExistencias data={dataExistencias} /> */}
      
      <h2>Gráfico de Existencias</h2>
        
        <ReporteChartExistencias data={dataExistencias} />
   

      {/* <h2>Resumen de Pedidos</h2>
      <ResumenCardPedidos data={dataPedidos} /> */}
      
      <h2>Gráfico de Pedidos</h2>
      
        <ReporteChartPedidos data={dataPedidos} />

    </div>
  );
};

export default Reportes;
