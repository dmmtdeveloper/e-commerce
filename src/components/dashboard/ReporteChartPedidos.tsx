import { Bar } from 'react-chartjs-2';
import { VmReportePedidos } from '@/types/types';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReporteChartPedidosProps {
  data: VmReportePedidos[];
}

const ReporteChartPedidos: React.FC<ReporteChartPedidosProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.nombreProducto),
    datasets: [
      {
        label: 'Valor Total',
        data: data.map(item => item.valorTotal),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartData2 = {
    labels: data.map(item => item.nombreProducto),
    datasets: [

      {
        label: 'Cantidad',
        data: data.map(item => item.cantidad),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };


  return (
    <>
      <div style={{ width: '1200px', height: '800px', marginBottom: '20px' }}> 
        <Bar data={chartData} />
      </div>
  
      <div style={{ width: '1200px', height: '800px' }}> 
        <Bar data={chartData2} />
      </div>
    </>
  );
};

export default ReporteChartPedidos;
