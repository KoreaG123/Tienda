const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  }
});

// POST /api/orders - Create order
router.post('/', upload.single('captura'), async (req, res) => {
  try {
    const { cliente, telefono, direccion, ciudad, productos, total } = req.body;
    if (!cliente || !telefono || !direccion || !ciudad || !total)
      return res.status(400).json({ message: 'Faltan campos requeridos' });

    const parsedProductos = typeof productos === 'string' ? JSON.parse(productos) : productos;

    const order = await Order.create({
      cliente,
      telefono,
      direccion,
      ciudad,
      productos: parsedProductos,
      total: parseFloat(total),
      captura: req.file ? req.file.filename : null
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear pedido' });
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

// GET /api/orders/stats - Dashboard stats (protected)
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const pendiente = await Order.countDocuments({ estado: 'pendiente' });
    const pagado = await Order.countDocuments({ estado: 'pagado' });
    const enviado = await Order.countDocuments({ estado: 'enviado' });
    const entregado = await Order.countDocuments({ estado: 'entregado' });
    const revenue = await Order.aggregate([
      { $match: { estado: { $in: ['pagado', 'enviado', 'entregado'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    res.json({ total, pendiente, pagado, enviado, entregado, revenue: revenue[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// PUT /api/orders/:id - Update order status (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { estado } = req.body;
    const validStates = ['pendiente', 'pagado', 'enviado', 'entregado'];
    if (!validStates.includes(estado))
      return res.status(400).json({ message: 'Estado inválido' });

    const order = await Order.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar pedido' });
  }
});

module.exports = router;
