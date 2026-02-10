# 🛍️ BARCALM - Tienda de Ropa Online Profesional

## 📋 Descripción

BARCALM es una tienda de ropa online profesional, moderna y completamente responsive. Cuenta con todas las funcionalidades necesarias para operar como un e-commerce real.

## ✨ Características Principales

### 🎨 Diseño Profesional
- ✅ Diseño moderno y animado
- ✅ 100% Responsive (móvil, tablet, desktop)
- ✅ Animaciones suaves y profesionales
- ✅ Imágenes con efectos flotantes
- ✅ Meta tags para redes sociales (Open Graph)
- ✅ SEO optimizado

### 🛒 Funcionalidades de Tienda
- ✅ Catálogo de productos completo
- ✅ Filtros por categoría, precio, talla
- ✅ Sistema de carrito de compras
- ✅ Productos destacados
- ✅ Promociones y descuentos
- ✅ Búsqueda de productos
- ✅ Ordenamiento de productos

### 📱 Páginas Incluidas
1. **Inicio (index.html)** - Hero slider, categorías, productos destacados
2. **Tienda (tienda.html)** - Catálogo completo con filtros
3. **Contacto (contacto.html)** - Formulario y mapa
4. **Carrito (carrito.html)** - Gestión de compras
5. **Checkout (checkout.html)** - Proceso de pago
6. **Sobre Nosotros** - Historia de la marca

### 🎯 Características Técnicas
- JavaScript puro (sin frameworks)
- LocalStorage para persistencia
- Animaciones CSS avanzadas
- Intersection Observer para scroll animations
- Touch events para móvil
- Modal system
- Notificaciones toast

## 📁 Estructura del Proyecto

```
barcalm-store/
│
├── frontend/
│   ├── index.html              # Página principal
│   ├── tienda.html             # Catálogo de productos
│   ├── contacto.html           # Página de contacto
│   ├── carrito.html            # Carrito de compras
│   ├── checkout.html           # Proceso de pago
│   ├── sobre-nosotros.html     # Acerca de
│   │
│   ├── css/
│   │   ├── estilos.css         # Estilos principales
│   │   └── responsive.css      # Estilos responsive
│   │
│   ├── js/
│   │   ├── main.js             # JavaScript principal
│   │   ├── productos.js        # Gestión de productos
│   │   ├── tienda.js           # Lógica de tienda
│   │   └── carrito.js          # Gestión del carrito
│   │
│   └── img/
│       ├── productos/          # Imágenes de productos
│       ├── banners/            # Banners principales
│       ├── categorias/         # Imágenes de categorías
│       └── logo/               # Logo de la marca
│
├── backend/
│   ├── app.py                  # Backend Python (opcional)
│   ├── models/                 # Modelos de datos
│   ├── routes/                 # Rutas API
│   └── database/               # Base de datos
│
└── README.md
```

## 🚀 Instalación y Uso

### Opción 1: Uso Directo (Sin Servidor)
1. Abre `index.html` en tu navegador
2. ¡Listo! La tienda funcionará localmente

### Opción 2: Con Servidor Local (Recomendado)

#### Usando Python:
```bash
# Python 3
python -m http.server 8000

# Luego visita: http://localhost:8000
```

#### Usando Node.js:
```bash
# Instala http-server globalmente
npm install -g http-server

# Ejecuta
http-server

# Visita: http://localhost:8080
```

#### Usando VS Code:
1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🎨 Personalización

### Colores de Marca
Edita las variables CSS en `css/estilos.css`:

```css
:root {
    --primary-color: #1a1a1a;      /* Color principal */
    --secondary-color: #f5f5f5;    /* Color secundario */
    --accent-color: #d4af37;       /* Color de acento (dorado) */
    --text-color: #333;            /* Color de texto */
}
```

### Agregar Productos
Edita el archivo `js/productos.js`:

```javascript
const PRODUCTOS = [
    {
        id: 1,
        nombre: 'Tu Producto',
        categoria: 'Categoría',
        precio: 99.90,
        imagen: 'img/productos/tu-imagen.jpg',
        // ...más propiedades
    }
];
```

### Modificar WhatsApp
Cambia el número en:
- `index.html` (botón flotante)
- `js/main.js` (CONFIG.whatsappNumber)

## 📱 Características Responsive

La tienda se adapta perfectamente a:
- 📱 Móviles (320px - 480px)
- 📱 Tablets (481px - 768px)
- 💻 Laptops (769px - 1024px)
- 🖥️ Desktops (1025px+)

## 🔧 Funcionalidades Implementadas

### Sistema de Carrito
- Agregar productos
- Modificar cantidades
- Eliminar productos
- Persistencia con LocalStorage
- Contador de productos en header

### Filtros de Productos
- Por categoría
- Por rango de precio
- Por talla
- Por color
- Ordenamiento múltiple

### Animaciones
- Scroll animations
- Hover effects
- Loading states
- Transitions suaves
- Hero slider automático

### SEO y Redes Sociales
- Meta tags optimizados
- Open Graph tags
- Descripción y keywords
- Imágenes de preview

## 🌐 Integración con Backend (Futuro)

El proyecto está preparado para integrar con un backend:

### Base de Datos Sugerida:
- **Productos**: id, nombre, precio, stock, imagen, categoría
- **Usuarios**: id, nombre, email, contraseña, teléfono
- **Pedidos**: id, id_usuario, total, estado, fecha
- **Detalle_Pedido**: id, id_pedido, id_producto, cantidad

### APIs a Implementar:
```
GET  /api/productos          - Listar productos
GET  /api/productos/:id      - Detalle de producto
POST /api/pedidos            - Crear pedido
GET  /api/pedidos/:id        - Ver pedido
POST /api/usuarios/registro  - Registro
POST /api/usuarios/login     - Login
```

## 💳 Métodos de Pago a Integrar

1. **Yape** - API de Yape
2. **Plin** - API de Plin
3. **Tarjetas** - Pasarela de pagos (MercadoPago, Culqi)
4. **Transferencia** - Manual

## 📧 Notificaciones

Configurar:
- Email al cliente (confirmación de pedido)
- WhatsApp al dueño (nuevo pedido)
- SMS de confirmación

## 🔒 Seguridad

Para producción, implementar:
- ✅ Certificado SSL (HTTPS)
- ✅ Encriptación de contraseñas
- ✅ Validación de formularios
- ✅ Protección CSRF
- ✅ Rate limiting
- ✅ Backup automático

## 📊 Panel de Administración (Próximamente)

Funcionalidades planeadas:
- Dashboard de ventas
- Gestión de productos (CRUD)
- Gestión de pedidos
- Gestión de clientes
- Reportes y estadísticas

## 🎯 Próximas Mejoras

- [ ] Panel de administración
- [ ] Sistema de usuarios completo
- [ ] Wishlist / Lista de deseos
- [ ] Comparador de productos
- [ ] Reviews y calificaciones
- [ ] Cupones de descuento
- [ ] Sistema de puntos
- [ ] Envío de emails automáticos
- [ ] Integración con redes sociales
- [ ] Blog de moda

## 🤝 Soporte

Para ayuda o consultas:
- 📧 Email: info@barcalm.com
- 💬 WhatsApp: +51 999 999 999

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y comerciales.

---

**BARCALM** - Tu tienda de moda online 🛍️

Hecho con ❤️ y mucho ☕
