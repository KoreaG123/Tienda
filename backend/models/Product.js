const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String, required: true },
  colores: [{ type: String }],
  tallas: [{ type: String }],
  descripcion: { type: String },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
