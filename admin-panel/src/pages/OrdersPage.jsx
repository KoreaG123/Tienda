import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado'];

const estadoColor = {
  pendiente: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  pagado: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  enviado: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  entregado: 'bg-green-500/10 text-green-400 border-green-500/30',
};

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, { headers });
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateEstado = async (id, estado) => {
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}`, { estado }, { headers });
      setOrders(prev => prev.map(o => o._id === id ? data : o));
      if (selectedOrder?._id === id) setSelectedOrder(data);
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  const filtered = filter === 'todos' ? orders : orders.filter(o => o.estado === filter);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Pedidos</h2>
          <p className="text-zinc-500 text-sm mt-1">{orders.length} pedido(s) total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['todos', ...ESTADOS].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wide border transition-all ${
                filter === f ? 'bg-gold-500 text-black border-gold-500' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['Cliente', 'Teléfono', 'Total', 'Estado', 'Fecha', 'Acciones'].map(h => (
                    <th key={h} className="text-left text-zinc-500 text-xs uppercase tracking-widest px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors ${selectedOrder?._id === order._id ? 'bg-zinc-800/50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{order.cliente}</p>
                      <p className="text-zinc-500 text-xs">{order.ciudad}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{order.telefono}</td>
                    <td className="px-4 py-3 text-gold-400 font-bold">S/ {order.total?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 border text-xs rounded ${estadoColor[order.estado]}`}>
                        {order.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.estado}
                        onChange={e => { e.stopPropagation(); updateEstado(order._id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 outline-none focus:border-gold-500"
                      >
                        {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-zinc-600">No hay pedidos</div>
            )}
          </div>

          {/* Detail panel */}
          {selectedOrder && (
            <div className="w-80 bg-zinc-900 border border-zinc-800 p-5 overflow-auto shrink-0">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-white font-bold">Detalle pedido</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white">✕</button>
              </div>

              <div className="space-y-3 mb-4">
                <div><p className="text-zinc-500 text-xs">Cliente</p><p className="text-white font-medium">{selectedOrder.cliente}</p></div>
                <div><p className="text-zinc-500 text-xs">Teléfono</p><p className="text-white">{selectedOrder.telefono}</p></div>
                <div><p className="text-zinc-500 text-xs">Dirección</p><p className="text-white">{selectedOrder.direccion}, {selectedOrder.ciudad}</p></div>
              </div>

              <div className="border-t border-zinc-800 pt-4 mb-4">
                <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wide">Productos</p>
                {selectedOrder.productos?.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <div>
                      <p className="text-white">{p.nombre}</p>
                      <p className="text-zinc-500 text-xs">{p.talla} · {p.color} · x{p.cantidad}</p>
                    </div>
                    <p className="text-gold-400">S/ {(p.precio * p.cantidad).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t border-zinc-800 mt-2 pt-2 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-gold-400">S/ {selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.captura && (
                <div className="border-t border-zinc-800 pt-4 mb-4">
                  <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wide">Captura Yape</p>
                  <img
                    src={`${API_URL}/uploads/${selectedOrder.captura}`}
                    alt="Captura de pago"
                    className="w-full rounded border border-zinc-700"
                  />
                </div>
              )}

              <div className="border-t border-zinc-800 pt-4">
                <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wide">Cambiar estado</p>
                <div className="grid grid-cols-2 gap-2">
                  {ESTADOS.map(s => (
                    <button
                      key={s}
                      onClick={() => updateEstado(selectedOrder._id, s)}
                      className={`py-2 text-xs uppercase tracking-wide border transition-all ${
                        selectedOrder.estado === s
                          ? 'bg-gold-500 text-black border-gold-500'
                          : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
