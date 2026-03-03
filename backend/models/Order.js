const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  productos: [{
    nombre: String,
    precio: Number,
    cantidad: Number,
    talla: String,
    color: String,
    imagen: String
  }],
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'pagado', 'enviado', 'entregado'], default: 'pendiente' },
  capturaBase64: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
