# HOMBR - Tienda de Ropa Masculina 👔

Tienda de ropa online moderna y responsive con carrito de compras, panel de administración y envío de pedidos por WhatsApp.

## 🌟 Características

- ✅ **Carrito de Compras Completo**: Selección de talla, color y cantidad
- ✅ **Panel de Administración**: Gestión de pedidos con autenticación
- ✅ **Envío a WhatsApp**: Los pedidos se envían automáticamente a WhatsApp
- ✅ **Diseño Responsive**: Funciona perfectamente en móvil, tablet y desktop
- ✅ **Animaciones Suaves**: Experiencia de usuario fluida con Framer Motion
- ✅ **Video de Cabecera**: Banner con video de fondo
- ✅ **WhatsApp Flotante**: Botón de contacto directo
- ✅ **Persistencia de Datos**: Los pedidos y carrito se guardan localmente

## 📁 Estructura del Proyecto

```
hombr-tienda/
├── public/
│   ├── img/              # Imágenes de productos
│   │   ├── portada.jpg   # Imagen para meta tags
│   │   ├── polo-negro.jpg
│   │   ├── pantalon.jpg
│   │   ├── camisa.jpg
│   │   ├── short.jpg
│   │   ├── polo-rayas.jpg
│   │   ├── jean.jpg
│   │   ├── camisa-cuadros.jpg
│   │   └── gorra.jpg
│   └── video/
│       └── cabecera.mp4  # Video de la cabecera
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminPanel.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductsSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── Footer.tsx
│   │   ├── CartDrawer.tsx
│   │   └── WhatsAppFloat.tsx
│   ├── data/
│   │   └── products.ts   # Datos de productos
│   ├── lib/
│   │   ├── store.ts      # Estado global con Zustand
│   │   └── whatsapp.ts   # Funciones de WhatsApp
│   ├── types/
│   │   └── index.ts      # Tipos TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/hombr-tienda.git
cd hombr-tienda
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Agregar las imágenes y video

Coloca tus archivos en las siguientes carpetas:

```
public/
├── img/
│   ├── portada.jpg       # 1200x630px recomendado para redes sociales
│   ├── polo-negro.jpg    # Imágenes de productos
│   ├── pantalon.jpg
│   ├── camisa.jpg
│   ├── short.jpg
│   ├── polo-rayas.jpg
│   ├── jean.jpg
│   ├── camisa-cuadros.jpg
│   └── gorra.jpg
└── video/
    └── cabecera.mp4      # Video para la sección hero
```

### 4. Configurar WhatsApp

Edita el archivo `src/lib/whatsapp.ts` y cambia el número de WhatsApp:

```typescript
const phoneNumber = '51968531996'; // Tu número con código de país
```

### 5. Configurar contraseña de admin

Edita el archivo `src/lib/store.ts`:

```typescript
const ADMIN_PASSWORD = 'hombr2024'; // Cambia esto por tu contraseña
```

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 7. Compilar para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📱 Funcionalidades Principales

### Carrito de Compras

1. Los clientes pueden agregar productos seleccionando:
   - Talla
   - Color
   - Cantidad

2. El carrito muestra:
   - Productos agregados
   - Subtotales
   - Total general

3. Proceso de checkout:
   - Formulario de datos del cliente
   - Selección de método de pago
   - Envío automático a WhatsApp

### Panel de Administración

**Contraseña por defecto**: `hombr2024`

El panel permite:
- ✅ Ver todos los pedidos recibidos
- ✅ Cambiar el estado de los pedidos:
  - Pendiente
  - Pagado
  - Enviado
  - Entregado
  - Cancelado
- ✅ Ver información completa del cliente
- ✅ Ver detalles de los productos pedidos

### WhatsApp

Los pedidos se envían automáticamente a WhatsApp con:
- Número de pedido
- Datos del cliente
- Lista de productos con tallas y colores
- Total del pedido
- Método de pago

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Color principal
    600: '#0284c7', // Color hover
  }
}
```

### Agregar/Editar Productos

Edita `src/data/products.ts`:

```typescript
{
  id: '9',
  name: 'Nuevo Producto',
  price: 79.90,
  description: 'Descripción del producto',
  image: '/img/nuevo-producto.jpg',
  category: 'polo',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Negro', 'Blanco'],
  stock: 20,
}
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub a Vercel
2. Configura el proyecto:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy

### Netlify

1. Conecta tu repositorio
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

## 📊 Datos Persistentes

Los datos se guardan en el navegador usando **localStorage**:

- **Carrito**: Se mantiene entre sesiones
- **Pedidos**: Solo visibles en el panel de admin
- **Autenticación admin**: Se mantiene mientras no se cierre sesión

## 🔒 Seguridad

- La contraseña de admin se guarda en el código (para producción, considerar backend)
- Los datos se almacenan localmente en el navegador del usuario
- No hay servidor, por lo que no hay base de datos centralizada

## 📝 Próximas Mejoras

Para convertir esto en una tienda completamente funcional:

1. **Backend con Node.js/Express**
2. **Base de datos (PostgreSQL/MongoDB)**
3. **Integración de pagos (Stripe, MercadoPago)**
4. **Sistema de autenticación robusto**
5. **Panel de admin con más funciones**
6. **Gestión de inventario real**
7. **Envío de emails automáticos**

## 📞 Soporte

Para preguntas o soporte:
- WhatsApp: +51 968 531 996
- Email: contacto@hombr.com

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y comerciales.

---

Hecho con ❤️ en Perú
