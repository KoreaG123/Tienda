import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

// Static fallback products
const STATIC_PRODUCTS = [
  { _id: '1', nombre: 'Polo Premium Black', precio: 89.90, imagen: '/images/producto1.jpg', colores: ['Negro', 'Blanco'], tallas: ['S', 'M', 'L', 'XL'] },
  { _id: '2', nombre: 'Camisa Slim Fit', precio: 129.90, imagen: '/images/producto2.jpg', colores: ['Blanco', 'Azul', 'Gris'], tallas: ['S', 'M', 'L', 'XL'] },
  { _id: '3', nombre: 'Pantalón Urban', precio: 159.90, imagen: '/images/producto3.jpg', colores: ['Negro', 'Gris', 'Beige'], tallas: ['S', 'M', 'L', 'XL'] },
  { _id: '4', nombre: 'Chaqueta Minimal', precio: 249.90, imagen: '/images/producto4.jpg', colores: ['Negro'], tallas: ['S', 'M', 'L', 'XL'] },
  { _id: '5', nombre: 'Hoodie Signature', precio: 189.90, imagen: '/images/producto5.jpg', colores: ['Negro', 'Gris'], tallas: ['S', 'M', 'L', 'XL'] },
  { _id: '6', nombre: 'Short Athletic', precio: 79.90, imagen: '/images/producto6.jpg', colores: ['Negro', 'Blanco', 'Azul'], tallas: ['S', 'M', 'L', 'XL'] },
];

export default function ProductsGrid() {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        if (data && data.length > 0) setProducts(data);
      } catch {
        // Use static products as fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section id="productos" className="bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold-400 text-xs uppercase tracking-[0.4em] mb-3">Colección 2025</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Nueva colección
          </h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-6" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
