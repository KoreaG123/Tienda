import { useState } from 'react';
import { useCart } from '../context/CartContext';

const TALLAS = ['S', 'M', 'L', 'XL'];

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [talla, setTalla] = useState('');
  const [color, setColor] = useState(product.colores?.[0] || '');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!talla) return alert('Por favor selecciona una talla');
    addToCart(product, talla, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const imgSrc = product.imagen?.startsWith('/uploads')
    ? `${API_URL}${product.imagen}`
    : product.imagen;

  return (
    <div className="group bg-zinc-900 overflow-hidden hover:bg-zinc-800 transition-all duration-300 animate-slide-up">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-zinc-800">
        <img
          src={imgSrc}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x533/111/D4AF37?text=${encodeURIComponent(product.nombre)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm uppercase tracking-wide mb-1">{product.nombre}</h3>
        <p className="text-gold-400 font-bold text-lg mb-4">
          S/ {product.precio.toFixed(2)}
        </p>

        {/* Tallas */}
        <div className="mb-3">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Talla</p>
          <div className="flex gap-2">
            {TALLAS.map(t => (
              <button
                key={t}
                onClick={() => setTalla(t)}
                className={`w-9 h-9 text-xs font-semibold border transition-all duration-200 ${
                  talla === t
                    ? 'bg-gold-500 border-gold-500 text-black'
                    : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Colores */}
        {product.colores && product.colores.length > 0 && (
          <div className="mb-4">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Color</p>
            <div className="flex gap-2">
              {product.colores.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={c}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === c ? 'border-gold-400 scale-110' : 'border-zinc-700'
                  }`}
                  style={{
                    backgroundColor:
                      c === 'Negro' ? '#000' :
                      c === 'Blanco' ? '#fff' :
                      c === 'Gris' ? '#888' :
                      c === 'Azul' ? '#1a56db' :
                      c === 'Rojo' ? '#e02424' :
                      c === 'Verde' ? '#057a55' :
                      c === 'Beige' ? '#d4c5a9' : '#888'
                  }}
                />
              ))}
            </div>
            <p className="text-zinc-500 text-xs mt-1">{color}</p>
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleAdd}
          className={`w-full py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-white text-black hover:bg-gold-500 hover:text-black'
          }`}
        >
          {added ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
