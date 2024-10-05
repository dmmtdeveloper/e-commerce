import { useState } from 'react';
import { VmReporteExistencias } from '@/types/types';
import { Bar } from 'react-chartjs-2';
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

interface ReporteChartExistenciasProps {
  data: VmReporteExistencias[];
}

const ReporteChartExistencias: React.FC<ReporteChartExistenciasProps> = ({ data }) => {
  // Estado para los filtros
  const [topLimit, setTopLimit] = useState<number>(10); // Valores: 3, 5, 10
  const [filterText, setFilterText] = useState<string>(''); // Texto para filtrar por nombre

  // Función para manejar cambios en el filtro de texto
  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  // Función para manejar cambios en el filtro de top productos
  const handleTopLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopLimit(Number(e.target.value));
  };

  // Filtrar y ordenar los datos por nombre y top productos
  const filteredData = data
    .filter(item => item.nombre.toLowerCase().includes(filterText.toLowerCase())) // Filtro por nombre
    .sort((a, b) => b.stockValorado - a.stockValorado) // Ordenar por stock valorado
    .slice(0, topLimit); // Limitar el número de productos

  const filteredData2 = data
    .filter(item => item.nombre.toLowerCase().includes(filterText.toLowerCase())) // Filtro por nombre
    .sort((a, b) => b.stockDisponible - a.stockDisponible) // Ordenar por stock disponible
    .slice(0, topLimit); // Limitar el número de productos

  // Datos para el gráfico de Stock Valorado
  const chartData = {
    labels: filteredData.map(item => item.nombre),
    datasets: [
      {
        label: 'Stock Valorado',
        data: filteredData.map(item => item.stockValorado),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ],
  };

  // Datos para el gráfico de Stock Disponible
  const chartData2 = {
    labels: filteredData2.map(item => item.nombre),
    datasets: [
      {
        label: 'Stock Disponible',
        data: filteredData2.map(item => item.stockDisponible),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Options for the first chart
  const options1 = {
    plugins: {
      title: {
        display: true,
        text: 'Existencia Total por Producto', // Title for the first chart
        font: {
          size: 20, // Adjust the title font size here
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Productos', // Label for the X-axis
          font: {
            size: 14, // Adjust the title font size here
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor Total (CLP)', // Label for the Y-axis
          font: {
            size: 14, // Adjust the title font size here
          },
        },
      },
    },
  };

  // Options for the second chart
  const options2 = {
    plugins: {
      title: {
        display: true,
        text: 'Stock Disponible por Producto', // Title for the second chart
        font: {
          size: 20, // Adjust the title font size here
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Productos', // Label for the X-axis
          font: {
            size: 14, // Adjust the title font size here
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad Disponible', // Label for the Y-axis
          font: {
            size: 14, // Adjust the title font size here
          },
        },
      },
    },
  };

  return (
    <div className="flex">
        {/* Columna de filtros */}
        <div className="w-1/5 p-4"> {/* Ajusta el ancho de la columna según necesites */}
          <h2 className="text-2xl font-semibold mb-4">Existencias</h2>
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>
            {/* Filtro por texto */}
            <div style={{ marginBottom: '20px', marginTop: "20px" }}>
                <span>Filtrar por Producto: </span>
                <input 
                    type="text" 
                    value={filterText}
                    onChange={handleFilterTextChange}
                    placeholder="Buscar por nombre de producto"
                    className="p-2 w-full" // Utiliza clases de Tailwind para el estilo
                />
            </div>

            {/* Filtro por top productos */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="topLimit">Mostrar top: </label>
                <select 
                    id="topLimit" 
                    value={topLimit} 
                    onChange={handleTopLimitChange} 
                    className="p-2 w-full" // Utiliza clases de Tailwind para el estilo
                >
                    <option value={3}>Top 3</option>
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                    <option value={100}>Top 100</option>
                </select>
            </div>
        </div>

        {/* Área de gráficos */}
        <div className="w-4/5 p-4"> {/* Flex-1 para que tome el resto del espacio */}
            {/* Gráfico de Stock Valorado */}
            <div style={{ width: '100%', height: '500px', marginBottom: '20px' }}>
                <Bar data={chartData} options={options1} />
            </div>

            {/* Gráfico de Stock Disponible */}
            <div style={{ width: '100%', height: '500px', marginBottom: '20px' }}>
                <Bar data={chartData2} options={options2} />
            </div>
        </div>
    </div>
);

};

export default ReporteChartExistencias;
