import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend, Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const StatCard = ({ label, value, color = 'text-white', icon }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6">
    <div className="flex items-center justify-between mb-3">
      <p className="text-zinc-500 text-xs uppercase tracking-widest">{label}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/orders/stats`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/orders`, { headers })
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const doughnutData = stats ? {
    labels: ['Pendiente', 'Pagado', 'Enviado', 'Entregado'],
    datasets: [{
      data: [stats.pendiente, stats.pagado, stats.enviado, stats.entregado],
      backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'],
      borderColor: ['#1c1917'],
      borderWidth: 2,
    }]
  } : null;

  // Last 7 orders by day
  const barData = {
    labels: orders.slice(0, 7).map(o => new Date(o.createdAt).toLocaleDateString('es', { day: '2-digit', month: 'short' })).reverse(),
    datasets: [{
      label: 'Total (S/)',
      data: orders.slice(0, 7).map(o => o.total).reverse(),
      backgroundColor: '#C9A227',
      borderRadius: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#a1a1aa' } } },
    scales: {
      x: { ticks: { color: '#71717a' }, grid: { color: '#27272a' } },
      y: { ticks: { color: '#71717a' }, grid: { color: '#27272a' } }
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white">Dashboard</h2>
        <p className="text-zinc-500 text-sm mt-1">Resumen general de la tienda</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total pedidos" value={stats.total} icon="📦" />
            <StatCard label="Pendientes" value={stats.pendiente} color="text-amber-400" icon="⏳" />
            <StatCard label="Entregados" value={stats.entregado} color="text-green-400" icon="✅" />
            <StatCard label="Ingresos" value={`S/ ${stats.revenue.toFixed(2)}`} color="text-gold-400" icon="💰" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Últimos 7 pedidos</h3>
              <Bar data={barData} options={chartOptions} />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Estado de pedidos</h3>
              <div className="flex justify-center">
                <div className="w-64">
                  <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#a1a1aa' } } } }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
