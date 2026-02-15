import { Order } from '@/types';

export const sendOrderToWhatsApp = (order: Order) => {
  const phoneNumber = '51968531996'; // Número de WhatsApp (código país + número)
  
  // Construir mensaje
  let message = `🛍️ *NUEVO PEDIDO - HOMBR*\n\n`;
  message += `📋 *Pedido #${order.id}*\n`;
  message += `📅 Fecha: ${new Date(order.date).toLocaleDateString('es-PE')}\n\n`;
  
  message += `👤 *DATOS DEL CLIENTE*\n`;
  message += `Nombre: ${order.customer.name}\n`;
  message += `Teléfono: ${order.customer.phone}\n`;
  message += `Email: ${order.customer.email}\n`;
  message += `Dirección: ${order.customer.address}\n`;
  message += `Ciudad: ${order.customer.city}\n`;
  if (order.customer.notes) {
    message += `Notas: ${order.customer.notes}\n`;
  }
  
  message += `\n🛒 *PRODUCTOS*\n`;
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.product.name}\n`;
    message += `   Talla: ${item.selectedSize} | Color: ${item.selectedColor}\n`;
    message += `   Cantidad: ${item.quantity} x S/ ${item.product.price.toFixed(2)}\n`;
    message += `   Subtotal: S/ ${(item.product.price * item.quantity).toFixed(2)}\n\n`;
  });
  
  message += `💰 *TOTAL: S/ ${order.total.toFixed(2)}*\n`;
  message += `💳 Método de pago: ${order.paymentMethod.toUpperCase()}\n`;
  
  // Codificar mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Construir URL de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank');
};

export const formatWhatsAppNumber = (number: string): string => {
  // Remover caracteres no numéricos
  const cleaned = number.replace(/\D/g, '');
  
  // Si no tiene código de país, agregar +51 (Perú)
  if (cleaned.length === 9) {
    return `51${cleaned}`;
  }
  
  return cleaned;
};
