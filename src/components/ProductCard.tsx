import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Por favor selecciona talla y color');
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    toast.success('¡Producto agregado al carrito!');

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.stock < 10 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ¡Últimas unidades!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        {/* Price */}
        <div className="text-3xl font-bold text-blue-600 mb-4">
          S/ {product.price.toFixed(2)}
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Talla:
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  selectedSize === size
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Color:
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  selectedColor === color
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cantidad:
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 font-bold transition-colors"
            >
              -
            </button>
            <span className="text-xl font-bold w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isAdded
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              Agregado
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Agregar al Carrito
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
