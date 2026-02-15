import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CustomerInfo, Order } from '@/types';
import { sendOrderToWhatsApp } from '@/lib/whatsapp';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'yape' | 'plin' | 'efectivo'>('yape');

  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const addOrder = useStore((state) => state.addOrder);

  const total = getCartTotal();

  const handleUpdateQuantity = (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, size, color, newQuantity);
  };

  const handleRemoveItem = (productId: string, size: string, color: string) => {
    removeFromCart(productId, size, color);
    toast.success('Producto eliminado del carrito');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    setStep('checkout');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address || !customerInfo.city) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Crear orden
    const order: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      customer: customerInfo,
      items: cart,
      total: total,
      status: 'pendiente',
      paymentMethod: paymentMethod,
    };

    // Guardar orden
    addOrder(order);

    // Enviar a WhatsApp
    sendOrderToWhatsApp(order);

    // Limpiar carrito
    clearCart();

    // Resetear formulario
    setCustomerInfo({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      notes: '',
    });

    // Volver al carrito
    setStep('cart');

    // Cerrar drawer
    setTimeout(() => {
      onClose();
      toast.success('¡Pedido enviado! Te contactaremos pronto.');
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {step === 'cart' ? 'Carrito de Compras' : 'Datos de Envío'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {step === 'cart' ? (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <ShoppingBag className="w-16 h-16 mb-4" />
                      <p className="text-lg">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item, index) => (
                        <motion.div
                          key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-xl p-4"
                        >
                          <div className="flex gap-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Talla: {item.selectedSize} | Color: {item.selectedColor}
                              </p>
                              <p className="text-blue-600 font-bold mt-1">
                                S/ {item.product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.selectedColor,
                                    item.quantity - 1
                                  )
                                }
                                className="w-8 h-8 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.selectedColor,
                                    item.quantity + 1
                                  )
                                }
                                className="w-8 h-8 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() =>
                                handleRemoveItem(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        S/ {total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Proceder al Pago
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Checkout Form */}
                <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors"
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors"
                        placeholder="999 888 777"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, address: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors"
                        placeholder="Av. Ejemplo 123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.city}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, city: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors"
                        placeholder="Lima"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Método de Pago *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['yape', 'plin', 'transferencia', 'efectivo'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                              paymentMethod === method
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-gray-300 hover:border-blue-500'
                            }`}
                          >
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notas adicionales (opcional)
                      </label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, notes: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors resize-none"
                        placeholder="Instrucciones especiales de entrega..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      Enviar Pedido por WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Volver al Carrito
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
