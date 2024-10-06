"use client";

import { useEffect, useState } from 'react';
import ReporteChartExistencias from '@/components/dashboard/ReporteChartExistencias';
import ReporteChartPedidos from '@/components/dashboard/ReporteChartPedidos';
import { VmReporteExistencias, VmReportePedidos } from '@/types/types';
import MainLayout from '@/components/layouts/MainLayout';
import LayoutSectionComponent from '@/components/layouts/layout-section-component';
import LayoutDivComponent from '@/components/layouts/layout-div-component';
import NavAdmin from '@/components/shared/navbar-admin-component/NavAdmin';
import { Title } from '@/components/title/Title';

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
    <MainLayout>
          <LayoutSectionComponent>
            <LayoutDivComponent>
              <NavAdmin />
              <div>
                <Title className="text-left" text="Dashboard" />
                <p className="text-gray-500">Reportes de Productos y Pedidos</p>
              </div>

              <div className="text-left">
              {/* Alinear Total Existencias y Unidades en Stock a la izquierda */}
              <div className="mb-6 flex space-x-4"> {/* Cambié justify-between por space-x-4 para controlar el espacio */}
                  <p className="text-xl">Total Existencias: 
                      <span className="font-semibold"> {dataExistencias
                          .reduce((total, item) => total + item.stockValorado, 0)
                          .toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}</span>
                  </p>
                  <p className="text-xl">Unidades en Stock: 
                      <span className="font-semibold"> {dataExistencias.reduce((total, item) => total + item.stockDisponible, 0)}</span>
                  </p>
              </div>
              <hr className="my-8 border-gray-300" /> {/* Agrega un divisor entre los gráficos */}
              
              <div className="mb-12">
                  <div className="w-full mx-auto"> {/* Cambia de md:w-3/4 lg:w-1/2 a w-full */}
                      <ReporteChartExistencias data={dataExistencias} />
                  </div>
              </div>
              
              <hr className="my-8 border-gray-300" /> {/* Agrega un divisor entre los gráficos */}

              <div className="mb-12">
                  <div className="w-full mx-auto">
                      <ReporteChartPedidos data={dataPedidos} />
                  </div>
              </div>
          </div>
          </LayoutDivComponent>
      </LayoutSectionComponent>
</MainLayout>
);

};

export default Reportes;
