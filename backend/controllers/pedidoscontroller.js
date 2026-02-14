const Pedido = require('../models/Pedido');
const axios = require('axios');

// Crear pedido
exports.crearPedido = async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();

    // Enviar a WhatsApp (ejemplo con WhatsApp Cloud API)
    await axios.post('https://graph.facebook.com/v17.0/TU_NUMERO_ID/messages', {
      messaging_product: "whatsapp",
      to: "968531996",
      type: "text",
      text: { body: `Nuevo pedido de ${pedido.cliente.nombre}: ${pedido.productos.join(", ")} Estado: ${pedido.estado}` }
    }, {
      headers: { Authorization: `Bearer TU_TOKEN_DE_WHATSAPP` }
    });

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ver todos los pedidos
exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estado
exports.actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
