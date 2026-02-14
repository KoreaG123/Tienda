const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const pedidosRoutes = require('./routes/pedidos');

const app = express();
app.use(bodyParser.json());

connectDB();
app.use('/api/pedidos', pedidosRoutes);

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
