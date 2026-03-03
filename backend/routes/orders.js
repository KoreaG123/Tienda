const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// POST /api/orders - Create new order (public)
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, direccion, ciudad, productos, total, capturaBase64 } = req.body;

    if (!nombre || !telefono || !direccion || !ciudad || !productos || !total) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const order = new Order({
      nombre,
      telefono,
      direccion,
      ciudad,
      productos: typeof productos === 'string' ? JSON.parse(productos) : productos,
      total: parseFloat(total),
      capturaBase64: capturaBase64 || null,
      estado: 'pendiente'
    });

    await order.save();
    res.status(201).json({ message: 'Pedido creado', order });
  } catch (err) {
    console.error('Error creando pedido:', err);
    res.status(500).json({ message: 'Error al crear pedido', error: err.message });
  }
});

// GET /api/orders - Get all orders (protected)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
});

// PUT /api/orders/:id - Update order status (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar pedido' });
  }
});

// DELETE /api/orders/:id - Delete order (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pedido eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar pedido' });
  }
});

module.exports = router;
