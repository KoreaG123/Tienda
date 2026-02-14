const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  cliente: { nombre: String, correo: String, telefono: String },
  productos: [String],
  estado: { type: String, default: 'pendiente' },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', PedidoSchema);
