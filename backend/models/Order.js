const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
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
  captura: { type: String }, // filename of uploaded screenshot
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado', 'entregado'],
    default: 'pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
