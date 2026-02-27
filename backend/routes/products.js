const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ activo: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// POST /api/products (admin)
router.post('/', auth, upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, precio, colores, tallas, descripcion } = req.body;
    const product = await Product.create({
      nombre,
      precio: parseFloat(precio),
      imagen: req.file ? `/uploads/${req.file.filename}` : req.body.imagen,
      colores: typeof colores === 'string' ? JSON.parse(colores) : colores,
      tallas: typeof tallas === 'string' ? JSON.parse(tallas) : tallas,
      descripcion
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;
