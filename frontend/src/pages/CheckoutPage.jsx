import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '', ciudad: '' });
  const [captura, setCaptura] = useState(null);
  const [capturaPreview, setCapturaPreview] = useState(null);
  const [capturaBase64, setCapturaBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Nombre requerido';
    if (!form.telefono.trim() || form.telefono.length < 9) e.telefono = 'Teléfono válido requerido';
    if (!form.direccion.trim()) e.direccion = 'Dirección requerida';
    if (!form.ciudad.trim()) e.ciudad = 'Ciudad requerida';
    if (!captura) e.captura = 'Sube la captura de tu pago Yape';
    return e;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCaptura(file);
      const previewUrl = URL.createObjectURL(file);
      setCapturaPreview(previewUrl);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturaBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const buildWhatsAppMessage = () => {
    const productList = cart.map(p => `• ${p.nombre} (${p.talla}, ${p.color}) x${p.cantidad} = S/ ${(p.precio * p.cantidad).toFixed(2)}`).join('\n');
    return encodeURIComponent(
      `🛍️ *NUEVO PEDIDO - HombR*\n\n` +
      `👤 *Cliente:* ${form.nombre}\n` +
      `📱 *Teléfono:* ${form.telefono}\n` +
      `📍 *Dirección:* ${form.direccion}, ${form.ciudad}\n\n` +
      `*PRODUCTOS:*\n${productList}\n\n` +
      `💰 *TOTAL: S/ ${total.toFixed(2)}*\n\n` +
      `✅ Pago realizado por Yape. Captura enviada.`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const orderData = {
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
        ciudad: form.ciudad,
        productos: cart.map(i => ({
          nombre: i.nombre,
          precio: i.precio,
          cantidad: i.cantidad,
          talla: i.talla,
          color: i.color,
          imagen: i.imagen
        })),
        total: total,
        capturaBase64: capturaBase64
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData, {
        headers: { 'Content-Type': 'application/json' }
      });

      clearCart();

      // Open WhatsApp
      const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '51968531996';
      const msg = buildWhatsAppMessage();
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');

      navigate('/success');
    } catch (err) {
      console.error(err);
      alert('Error al enviar el pedido. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-black text-white uppercase tracking-wide mb-10">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Form */}
            <div className="space-y-6">
              {/* Datos */}
              <div className="bg-zinc-900 p-6">
                <h2 className="text-white font-bold uppercase tracking-wide mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold-500 text-black text-xs font-black flex items-center justify-center">1</span>
                  Tus datos
                </h2>
                <div className="space-y-4">
                  {[
                    { key: 'nombre', label: 'Nombre completo', placeholder: 'Juan Pérez', type: 'text' },
                    { key: 'telefono', label: 'Teléfono', placeholder: '987654321', type: 'tel' },
                    { key: 'direccion', label: 'Dirección', placeholder: 'Av. Principal 123', type: 'text' },
                    { key: 'ciudad', label: 'Ciudad', placeholder: 'Lima', type: 'text' },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label className="text-zinc-400 text-xs uppercase tracking-widest block mb-1">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })); }}
                        className={`input-dark ${errors[key] ? 'border-red-500' : ''}`}
                      />
                      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pago Yape */}
              <div className="bg-zinc-900 p-6">
                <h2 className="text-white font-bold uppercase tracking-wide mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold-500 text-black text-xs font-black flex items-center justify-center">2</span>
                  Pago con Yape
                </h2>
                <div className="flex flex-col items-center mb-6">
                  <img
                    src="/images/qr-yape.png"
                    alt="QR Yape"
                    className="w-48 h-48 object-contain border border-zinc-700 p-2 bg-white mb-3"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <p className="text-zinc-400 text-sm text-center">
                    Escanea el QR con Yape y realiza el pago de <span className="text-gold-400 font-bold">S/ {total.toFixed(2)}</span>
                  </p>
                </div>
                <div>
                  <label className="text-zinc-400 text-xs uppercase tracking-widest block mb-2">
                    Sube la captura de tu pago *
                  </label>
                  <div
                    onClick={() => document.getElementById('captura-input').click()}
                    className={`border-2 border-dashed cursor-pointer p-6 text-center transition-colors ${
                      errors.captura ? 'border-red-500' : 'border-zinc-700 hover:border-gold-500'
                    }`}
                  >
                    {capturaPreview ? (
                      <img src={capturaPreview} alt="Captura" className="max-h-32 mx-auto object-contain" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-zinc-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-zinc-500 text-sm">Haz clic para subir la captura</p>
                      </>
                    )}
                  </div>
                  <input
                    id="captura-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {errors.captura && <p className="text-red-400 text-xs mt-1">{errors.captura}</p>}
                </div>
              </div>
            </div>

            {/* Right - Order summary */}
            <div>
              <div className="bg-zinc-900 p-6 sticky top-24">
                <h2 className="text-white font-bold uppercase tracking-wide mb-6">Tu pedido</h2>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.key} className="flex justify-between text-sm border-b border-zinc-800 pb-3">
                      <div>
                        <p className="text-white font-medium">{item.nombre}</p>
                        <p className="text-zinc-500 text-xs">{item.talla} · {item.color} · x{item.cantidad}</p>
                      </div>
                      <span className="text-white font-semibold">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-800 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold uppercase">Total</span>
                    <span className="text-gold-400 font-black text-2xl">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      Confirmar pedido
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-zinc-600 text-xs text-center mt-3">
                  Al confirmar, se abrirá WhatsApp para completar tu pedido
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
