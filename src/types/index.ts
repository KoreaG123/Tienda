export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'polo' | 'pantalon' | 'camisa' | 'short' | 'accesorio';
  sizes: string[];
  colors: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  status: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';
  paymentMethod: 'transferencia' | 'yape' | 'plin' | 'efectivo';
}
