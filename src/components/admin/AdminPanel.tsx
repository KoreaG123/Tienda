import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Package, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Order } from '@/types';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Package, label: 'Pendiente' },
  pagado: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Pagado' },
  enviado: { color: 'bg-blue-100 text-blue-800', icon: Truck, label: 'Enviado' },
  entregado: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Entregado' },
  cancelado: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelado' },
};

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const isAdminAuthenticated = useStore((state) => state.isAdminAuthenticated);
  const adminLogin = useStore((state) => state.adminLogin);
  const adminLogout = useStore((state) => state.adminLogout);
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setIsAuthenticated(true);
      toast.success('¡Bienvenido al panel de administración!');
      setPassword('');
    } else {
      toast.error('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    onClose();
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success('Estado del pedido actualizado');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lock className="w-6 h-6" />
                Panel de Administración
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {!isAuthenticated || !isAdminAuthenticated ? (
            /* Login Form */
            <div className="flex-1 flex items-center justify-center p-6">
              <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Acceso Restringido
                  </h3>
                  <p className="text-gray-600">
                    Ingresa tu contraseña para continuar
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors"
                    placeholder="Ingresa tu contraseña"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Iniciar Sesión
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Contraseña por defecto: <code className="bg-gray-100 px-2 py-1 rounded">hombr2024</code>
                </p>
              </form>
            </div>
          ) : (
            /* Orders Dashboard */
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Pedidos Recibidos
                  </h3>
                  <p className="text-gray-600">Total: {orders.length} pedidos</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Package className="w-16 h-16 mb-4" />
                  <p className="text-xl">No hay pedidos aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <h4 className="text-lg font-bold text-gray-900">
                                Pedido #{order.id}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                  statusConfig[order.status].color
                                }`}
                              >
                                <StatusIcon className="w-4 h-4" />
                                {statusConfig[order.status].label}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                                <p className="font-semibold">{order.customer.name}</p>
                                <p className="text-sm text-gray-600">{order.customer.phone}</p>
                                <p className="text-sm text-gray-600">{order.customer.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Dirección</p>
                                <p className="font-semibold">{order.customer.address}</p>
                                <p className="text-sm text-gray-600">{order.customer.city}</p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-2">Productos:</p>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-sm">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-semibold">{item.product.name}</p>
                                      <p className="text-gray-600">
                                        {item.selectedSize} - {item.selectedColor} x{item.quantity}
                                      </p>
                                    </div>
                                    <p className="font-semibold">
                                      S/ {(item.product.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  S/ {order.total.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Método de pago</p>
                                <p className="font-semibold">{order.paymentMethod.toUpperCase()}</p>
                              </div>
                            </div>

                            {order.customer.notes && (
                              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                                <p className="text-sm font-semibold text-yellow-800">Notas:</p>
                                <p className="text-sm text-yellow-700">{order.customer.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Status Controls */}
                          <div className="lg:w-48">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Cambiar estado:
                            </p>
                            <div className="space-y-2">
                              {(['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'] as const).map(
                                (status) => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(order.id, status)}
                                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      order.status === status
                                        ? statusConfig[status].color
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                  >
                                    {statusConfig[status].label}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
