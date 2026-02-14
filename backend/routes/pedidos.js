const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const axios = require('axios');

// Crear pedido
router.post('/', async (req, res) => {
  const pedido = new Pedido(req.body);
  await pedido.save();

  // Enviar a WhatsApp
  await axios.post('https://graph.facebook.com/v17.0/TU_NUMERO_ID/messages', {
    messaging_product: "whatsapp",
    to: "968531996",
    type: "text",
    text: { body: `Nuevo pedido: ${pedido.productos.join(", ")} de ${pedido.cliente.nombre}` }
  }, {
    headers: { Authorization: `Bearer TU_TOKEN_DE_WHATSAPP` }
  });

  res.json(pedido);
});

// Ver pedidos
router.get('/', async (req, res) => {
  const pedidos = await Pedido.find();
  res.json(pedidos);
});

// Actualizar estado
router.put('/:id', async (req, res) => {
  const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
  res.json(pedido);
});

module.exports = router;
