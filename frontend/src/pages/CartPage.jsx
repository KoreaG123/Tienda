import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <svg className="w-20 h-20 text-zinc-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
          <p className="text-zinc-500 mb-8">Agrega productos para continuar</p>
          <Link to="/" className="btn-gold">Explorar colección</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-black text-white uppercase tracking-wide mb-10">
          Tu carrito
          <span className="text-zinc-500 text-lg font-normal ml-3">({cart.length} productos)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const imgSrc = item.imagen?.startsWith('/uploads')
                ? `${API_URL}${item.imagen}`
                : item.imagen;
              return (
                <div key={item.key} className="bg-zinc-900 p-4 flex gap-4 items-start">
                  <img
                    src={imgSrc}
                    alt={item.nombre}
                    className="w-20 h-24 object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/80x96/111/D4AF37?text=HombR`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wide">{item.nombre}</h3>
                    <p className="text-zinc-500 text-xs mt-1">Talla: {item.talla} · Color: {item.color}</p>
                    <p className="text-gold-400 font-bold mt-2">S/ {item.precio.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.key, item.cantidad - 1)}
                        className="w-7 h-7 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                      >−</button>
                      <span className="text-white font-semibold w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.key, item.cantidad + 1)}
                        className="w-7 h-7 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                      >+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-zinc-600 hover:text-red-400 text-xs mt-2 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 p-6 sticky top-24">
              <h3 className="text-white font-bold uppercase tracking-wide mb-6">Resumen</h3>
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.key} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{item.nombre} x{item.cantidad}</span>
                    <span className="text-white">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-white font-bold uppercase tracking-wide">Total</span>
                  <span className="text-gold-400 font-black text-xl">S/ {total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-gold w-full text-center"
              >
                Proceder al pago
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full text-center text-zinc-500 hover:text-white text-sm mt-3 py-2 transition-colors"
              >
                ← Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
