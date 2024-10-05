import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2'; 
import { VmReportePedidos } from '@/types/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ReporteChartPedidosProps {
  data: VmReportePedidos[];
}

interface VmReportePedidosAgrupados {
  nombreProducto: string;
  valorTotal: number; // Total de ventas para este producto
  cantidad: number; // Total de unidades vendidas para este producto
}

const ReporteChartPedidos: React.FC<ReporteChartPedidosProps> = ({ data }) => {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [estadoPedido, setEstadoPedido] = useState('Completado');
  const [topProductos, setTopProductos] = useState(10);
  const [filtroProducto, setFiltroProducto] = useState(''); // Filtro por nombre de producto
  const [filteredData, setFilteredData] = useState<VmReportePedidosAgrupados[]>([]);
  const [filteredData2, setFilteredData2] = useState<VmReportePedidosAgrupados[]>([]);

  useEffect(() => {
    const filtered = data.filter(item => {
      const fechaPedido = new Date(item.fecha);
      const desde = fechaDesde ? new Date(fechaDesde) : null;
      const hasta = fechaHasta ? new Date(fechaHasta) : null;
      const estadoValido = estadoPedido === 'Todos' || item.estadoPedido === estadoPedido;
      const productoValido = item.nombreProducto.toLowerCase().includes(filtroProducto.toLowerCase());

      return (
        (!desde || fechaPedido >= desde) &&
        (!hasta || fechaPedido <= hasta) &&
        estadoValido &&
        productoValido
      );
    });

    // Agrupar por producto
    const groupedData = filtered.reduce((acc: { [key: string]: VmReportePedidosAgrupados }, item) => {
      const { nombreProducto, valorTotal, cantidad } = item;
      
      if (!acc[nombreProducto]) {
        acc[nombreProducto] = { nombreProducto, valorTotal: 0, cantidad: 0 };
      }

      acc[nombreProducto].valorTotal += valorTotal;
      acc[nombreProducto].cantidad += cantidad;

      return acc;
    }, {});

    // Convertir el objeto agrupado a un array
    const groupedArray = Object.values(groupedData);
    
    // Ordenar los datos agrupados
    const sorted = groupedArray.sort((a, b) => b.valorTotal - a.valorTotal).slice(0, topProductos);
    const sorted2 = groupedArray.sort((a, b) => b.cantidad - a.cantidad).slice(0, topProductos);
    
    setFilteredData(sorted);
    setFilteredData2(sorted2);
  }, [fechaDesde, fechaHasta, estadoPedido, filtroProducto, topProductos, data]);

  // Agrupar las ventas por día
  const groupedByDay = data.reduce((acc: { [key: string]: number }, item) => {
    const fecha = new Date(item.fecha).toLocaleDateString('es-CL');
    const productoValido = item.nombreProducto.toLowerCase().includes(filtroProducto.toLowerCase()); // Filtro por producto
  
    if ((estadoPedido === 'Todos' || item.estadoPedido === estadoPedido) && productoValido) {
      if (!acc[fecha]) {
        acc[fecha] = 0;
      }
      acc[fecha] += item.valorTotal;
    }
  
    return acc;
  }, {});

  // Agrupar las cantidades vendidas por día
  const groupedQuantitiesByDay = data.reduce((acc: { [key: string]: number }, item) => {
    const fecha = new Date(item.fecha).toLocaleDateString('es-CL');
    const productoValido = item.nombreProducto.toLowerCase().includes(filtroProducto.toLowerCase()); // Filtro por producto
  
    if ((estadoPedido === 'Todos' || item.estadoPedido === estadoPedido) && productoValido) {
      if (!acc[fecha]) {
        acc[fecha] = 0;
      }
      acc[fecha] += item.cantidad; // Sumar las cantidades
    }
  
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(groupedByDay),
    datasets: [
      {
        label: 'Ventas por Día',
        data: Object.values(groupedByDay),
        borderColor: 'rgba(54, 162, 235, 0.6)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  const quantityLineChartData = {
    labels: Object.keys(groupedQuantitiesByDay),
    datasets: [
      {
        label: 'Unidades Vendidas por Día',
        data: Object.values(groupedQuantitiesByDay),
        borderColor: 'rgba(255, 99, 132, 0.6)', // Color del gráfico de líneas de cantidades
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color de fondo
        fill: true,
      },
    ],
  };

  const chartData = {
    labels: filteredData.map(item => item.nombreProducto),
    datasets: [
      {
        label: 'Valor Total',
        data: filteredData.map(item => item.valorTotal),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };
  
  const chartData2 = {
    labels: filteredData2.map(item => item.nombreProducto),
    datasets: [
      {
        label: 'Cantidad',
        data: filteredData2.map(item => item.cantidad),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options1 = {
    plugins: {
      title: {
        display: true,
        text: 'Ventas Totales por Producto',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Producto',
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor Total (CLP)',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const options2 = {
    plugins: {
      title: {
        display: true,
        text: 'Unidades Vendidas por Producto',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Producto',
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const lineChartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Venta Total por Día',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor Total (CLP)',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const quantityLineChartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Unidades Vendidas por Día',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad Vendida',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="flex">
      {/* Filtros */}
      <div className="w-1/5 p-4 border-r"> {/* Aquí se establece el ancho para la columna de filtros */}
        <h2 className="text-2xl font-semibold mb-4">Gráfico de Pedidos</h2>
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="mb-4 space-y-4">
          <label className="block">
            Desde: <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} className="border px-2 py-1 w-full" />
          </label>
          <label className="block">
            Hasta: <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} className="border px-2 py-1 w-full" />
          </label>
          <label className="block">
            Estado: 
            <select value={estadoPedido} onChange={e => setEstadoPedido(e.target.value)} className="border px-2 py-1 w-full">
              <option value="Completado">Completado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Todos">Todos</option>
            </select>
          </label>
          <label className="block">
            Nombre Producto:
            <input type="text" value={filtroProducto} onChange={e => setFiltroProducto(e.target.value)} className="border px-2 py-1 w-full" />
          </label>
          <label className="block">
            Top Productos:
            <input type="number" value={topProductos} onChange={e => setTopProductos(Number(e.target.value))} className="border px-2 py-1 w-full" min="1" />
          </label>
        </div>
      </div>

      {/* Gráficos */}
      <div className="w-4/5 p-4"> {/* Aquí se establece el ancho para la columna de gráficos */}
        <div className="mb-8">
          <Bar data={chartData} options={options1} />
        </div>
        <div className="mb-8">
          <Bar data={chartData2} options={options2} />
        </div>
        <div className="mb-8">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
        <div>
          <Line data={quantityLineChartData} options={quantityLineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ReporteChartPedidos;
