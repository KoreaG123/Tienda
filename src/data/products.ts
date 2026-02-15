import { Product } from '@/types';

import poloNegro from '@/assets/polo-negro.jpg';
import pantalon from '@/assets/pantalon.jpg';
import camisa from '@/assets/camisa.jpg';
import short from '@/assets/short.jpg';
import poloRayas from '@/assets/polo-rayas.jpg';
import jean from '@/assets/jean.jpg';
import camisaCuadros from '@/assets/camisa-cuadros.jpg';
import gorra from '@/assets/gorra.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Polo Negro Premium',
    price: 59.90,
    description: 'Polo de algodón 100% premium, corte slim fit, ideal para cualquier ocasión.',
    image: poloNegro,
    category: 'polo',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Blanco', 'Gris'],
    stock: 50,
  },
  {
    id: '2',
    name: 'Pantalón Casual Beige',
    price: 89.90,
    description: 'Pantalón casual de tela suave, perfecto para el día a día.',
    image: pantalon,
    category: 'pantalon',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Beige', 'Negro', 'Azul Marino'],
    stock: 30,
  },
  {
    id: '3',
    name: 'Camisa Blanca Formal',
    price: 79.90,
    description: 'Camisa formal de algodón, perfecta para reuniones y eventos.',
    image: camisa,
    category: 'camisa',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Celeste', 'Negro'],
    stock: 40,
  },
  {
    id: '4',
    name: 'Short Deportivo',
    price: 49.90,
    description: 'Short deportivo de tela ligera y transpirable.',
    image: short,
    category: 'short',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Gris', 'Azul'],
    stock: 35,
  },
  {
    id: '5',
    name: 'Polo Rayas Azul',
    price: 64.90,
    description: 'Polo a rayas de diseño moderno y elegante.',
    image: poloRayas,
    category: 'polo',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Azul/Blanco', 'Negro/Gris'],
    stock: 25,
  },
  {
    id: '6',
    name: 'Pantalón Jean Clásico',
    price: 99.90,
    description: 'Jean de mezclilla resistente, corte clásico.',
    image: jean,
    category: 'pantalon',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Azul', 'Negro'],
    stock: 45,
  },
  {
    id: '7',
    name: 'Camisa Casual Cuadros',
    price: 69.90,
    description: 'Camisa de cuadros casual, perfecta para el fin de semana.',
    image: camisaCuadros,
    category: 'camisa',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Rojo/Negro', 'Azul/Blanco'],
    stock: 20,
  },
  {
    id: '8',
    name: 'Gorra Snapback',
    price: 39.90,
    description: 'Gorra snapback con logo bordado, ajuste universal.',
    image: gorra,
    category: 'accesorio',
    sizes: ['Única'],
    colors: ['Negro', 'Blanco', 'Azul'],
    stock: 60,
  },
];
