import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATIC_COLORS = ['Negro', 'Blanco', 'Gris', 'Azul', 'Rojo', 'Verde', 'Beige'];
const TALLAS = ['S', 'M', 'L', 'XL'];

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', precio: '', imagen: '', colores: [], tallas: ['S','M','L','XL'], descripcion: '' });

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleCheck = (arr, val, field) => {
    const next = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
    setForm(p => ({ ...p, [field]: next }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/products`,
        { ...form, precio: parseFloat(form.precio) },
        { headers }
      );
      setShowForm(false);
      setForm({ nombre: '', precio: '', imagen: '', colores: [], tallas: ['S','M','L','XL'], descripcion: '' });
      load();
    } catch { alert('Error al crear producto'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Desactivar este producto?')) return;
    try { await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, { headers }); load(); }
    catch { alert('Error'); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Productos</h2>
          <p className="text-zinc-500 text-sm mt-1">{products.length} producto(s)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-4 py-2 text-sm uppercase tracking-widest transition-colors">
          {showForm ? 'X Cancelar' : '+ Nuevo producto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 mb-6">
          <h3 className="text-white font-bold mb-4">Nuevo producto</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-500 text-xs uppercase tracking-wide block mb-1">Nombre</label>
              <input required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-gold-500 text-white px-3 py-2 outline-none text-sm" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs uppercase tracking-wide block mb-1">Precio (S/)</label>
              <input required type="number" step="0.01" value={form.precio}
                onChange={e => setForm(p => ({ ...p, precio: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-gold-500 text-white px-3 py-2 outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="text-zinc-500 text-xs uppercase tracking-wide block mb-1">URL Imagen</label>
              <input required value={form.imagen} onChange={e => setForm(p => ({ ...p, imagen: e.target.value }))}
                placeholder="/images/producto1.jpg"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-gold-500 text-white px-3 py-2 outline-none text-sm" />
            </div>
            <div>
              <label className="text-zinc-500 text-xs uppercase tracking-wide block mb-2">Colores</label>
              <div className="flex flex-wrap gap-2">
                {STATIC_COLORS.map(c => (
                  <button type="button" key={c} onClick={() => toggleCheck(form.colores, c, 'colores')}
                    className={`px-2 py-1 text-xs border transition-all ${form.colores.includes(c) ? 'bg-gold-500 text-black border-gold-500' : 'border-zinc-700 text-zinc-400'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 text-xs uppercase tracking-wide block mb-2">Tallas</label>
              <div className="flex gap-2">
                {TALLAS.map(t => (
                  <button type="button" key={t} onClick={() => toggleCheck(form.tallas, t, 'tallas')}
                    className={`w-9 h-9 text-xs border transition-all ${form.tallas.includes(t) ? 'bg-gold-500 text-black border-gold-500' : 'border-zinc-700 text-zinc-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-6 py-2 text-sm uppercase tracking-widest">
                Crear producto
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map(p => {
            const imgSrc = p.imagen?.startsWith('/uploads') ? `${API_URL}${p.imagen}` : p.imagen;
            return (
              <div key={p._id} className="bg-zinc-900 border border-zinc-800 overflow-hidden group">
                <div className="aspect-video overflow-hidden bg-zinc-800">
                  <img src={imgSrc} alt={p.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = `https://via.placeholder.com/300x200/111/D4AF37?text=${encodeURIComponent(p.nombre)}`; }} />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-semibold text-sm">{p.nombre}</h4>
                    <p className="text-gold-400 font-bold">S/ {p.precio.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-1 flex-wrap mb-3">
                    {p.tallas?.map(t => <span key={t} className="text-xs text-zinc-500 border border-zinc-800 px-1">{t}</span>)}
                  </div>
                  <button onClick={() => handleDelete(p._id)} className="text-xs text-zinc-600 hover:text-red-400 transition-colors">
                    Desactivar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
