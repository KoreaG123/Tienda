# 🚀 GUÍA DE INICIO RÁPIDO - HOMBR

## ⚡ Pasos para poner en marcha tu tienda

### 1️⃣ Instalar Node.js (si no lo tienes)
Descarga e instala desde: https://nodejs.org/
- Recomendado: Versión LTS (Long Term Support)

### 2️⃣ Abrir el proyecto
```bash
# Descomprime el archivo descargado
# Abre una terminal/cmd en la carpeta del proyecto
cd hombr-tienda
```

### 3️⃣ Instalar dependencias
```bash
npm install
```
⏱️ Esto tomará 2-3 minutos

### 4️⃣ Agregar tus imágenes y video
Coloca tus archivos en:
- `public/img/` - Las 8 imágenes de productos + portada.jpg
- `public/video/` - El archivo cabecera.mp4

**Ver archivo IMAGENES.md para detalles completos**

### 5️⃣ Configurar WhatsApp
Abre `src/lib/whatsapp.ts` y cambia:
```typescript
const phoneNumber = '51968531996'; // TU NÚMERO AQUÍ
```

### 6️⃣ Configurar contraseña de administrador
Abre `src/lib/store.ts` y cambia:
```typescript
const ADMIN_PASSWORD = 'hombr2024'; // TU CONTRASEÑA AQUÍ
```

### 7️⃣ Ejecutar en modo desarrollo
```bash
npm run dev
```

¡Listo! Abre tu navegador en: http://localhost:5173

## 🎯 Siguientes pasos

### Personalizar productos
Edita `src/data/products.ts` para cambiar:
- Nombres
- Precios
- Descripciones
- Categorías
- Tallas y colores disponibles

### Cambiar colores del sitio
Edita `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Color principal
  }
}
```

### Compilar para producción
Cuando estés listo para publicar:
```bash
npm run build
```

Los archivos estarán en la carpeta `dist/`

## 📤 Subir a Internet

### Opción 1: Vercel (Gratis, Recomendado)
1. Crea cuenta en https://vercel.com
2. Conecta tu repositorio de GitHub
3. Click en "Deploy"
4. ¡Listo! Tendrás una URL como: https://tu-tienda.vercel.app

### Opción 2: Netlify (Gratis)
1. Crea cuenta en https://netlify.com
2. Arrastra la carpeta `dist/` al navegador
3. ¡Listo!

### Opción 3: GitHub Pages (Gratis)
1. Sube el código a GitHub
2. Habilita GitHub Pages
3. Usa la carpeta `dist/`

## ❓ Preguntas Frecuentes

### ¿Cómo agrego más productos?
Edita `src/data/products.ts` y agrega nuevos objetos al array

### ¿Cómo cambio el número de WhatsApp?
En 2 archivos:
- `src/lib/whatsapp.ts` (para envío de pedidos)
- `src/components/WhatsAppFloat.tsx` (para botón flotante)

### ¿Los datos se guardan?
Sí, en el navegador local. Para guardar en servidor necesitarás un backend.

### ¿Puedo procesar pagos reales?
Esta versión solo envía a WhatsApp. Para pagos reales necesitas:
- Stripe, PayPal o MercadoPago
- Un backend (Node.js, PHP, etc.)

### ¿Funciona en móviles?
¡Sí! Es completamente responsive.

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### El video no se reproduce
- Verifica que el archivo esté en `public/video/cabecera.mp4`
- Asegúrate que sea formato MP4
- Comprueba que el peso sea menor a 10MB

### Las imágenes no aparecen
- Verifica que estén en `public/img/`
- Los nombres deben coincidir exactamente
- No uses espacios en nombres de archivo

### Error al compilar TypeScript
```bash
npm run build -- --force
```

## 📞 Contacto y Soporte

¿Necesitas ayuda?
- WhatsApp: +51 968 531 996
- Email: contacto@hombr.com

## ✅ Checklist Final

Antes de publicar, verifica:
- [ ] Todas las imágenes están cargadas
- [ ] El video se reproduce correctamente
- [ ] El número de WhatsApp es correcto
- [ ] La contraseña de admin está cambiada
- [ ] Los productos tienen información correcta
- [ ] Probaste el carrito de compras
- [ ] Probaste el envío a WhatsApp
- [ ] El sitio se ve bien en móvil
- [ ] No hay errores en la consola del navegador

¡Éxito con tu tienda HOMBR! 🎉
