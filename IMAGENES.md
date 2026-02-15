# 📸 Guía de Imágenes para HOMBR

## Ubicación de Archivos

Todos los archivos multimedia deben colocarse en la carpeta `public/`:

```
public/
├── img/
│   ├── portada.jpg        # Para meta tags/redes sociales
│   ├── polo-negro.jpg     # Producto 1
│   ├── pantalon.jpg       # Producto 2
│   ├── camisa.jpg         # Producto 3
│   ├── short.jpg          # Producto 4
│   ├── polo-rayas.jpg     # Producto 5
│   ├── jean.jpg           # Producto 6
│   ├── camisa-cuadros.jpg # Producto 7
│   └── gorra.jpg          # Producto 8
└── video/
    └── cabecera.mp4       # Video de la sección hero
```

## 📐 Especificaciones de Imágenes

### Imagen de Portada (portada.jpg)
- **Dimensiones**: 1200x630 píxeles
- **Formato**: JPG
- **Peso**: Máximo 500KB
- **Uso**: Meta tags para redes sociales (Facebook, Twitter, WhatsApp)
- **Contenido sugerido**: Logo de HOMBR o imagen representativa de la marca

### Imágenes de Productos
- **Dimensiones**: 800x800 píxeles (cuadradas)
- **Formato**: JPG o PNG
- **Peso**: Máximo 300KB por imagen
- **Fondo**: Blanco o neutro (recomendado)
- **Calidad**: Alta resolución pero optimizada para web

### Productos Necesarios:

1. **polo-negro.jpg**
   - Polo Negro Premium
   - Fondo blanco
   - Vista frontal del producto

2. **pantalon.jpg**
   - Pantalón Casual Beige
   - Vista completa o detalle

3. **camisa.jpg**
   - Camisa Blanca Formal
   - Vista frontal o en maniquí

4. **short.jpg**
   - Short Deportivo
   - Vista frontal

5. **polo-rayas.jpg**
   - Polo a Rayas Azul
   - Mostrar el diseño de rayas claramente

6. **jean.jpg**
   - Pantalón Jean Clásico
   - Vista frontal o lateral

7. **camisa-cuadros.jpg**
   - Camisa Casual de Cuadros
   - Mostrar el patrón de cuadros

8. **gorra.jpg**
   - Gorra Snapback
   - Vista frontal o en ángulo 3/4

## 🎬 Especificaciones del Video

### cabecera.mp4
- **Duración**: 10-30 segundos (loop)
- **Dimensiones**: 1920x1080 píxeles (Full HD) o 1280x720 (HD)
- **Formato**: MP4 (H.264)
- **Peso**: Máximo 10MB
- **FPS**: 30fps
- **Audio**: Opcional (se reproduce en mute)
- **Contenido sugerido**: 
  - Ropa en movimiento
  - Personas modelando la ropa
  - Detalles de telas y texturas
  - Ambiente urbano/lifestyle

## 🔧 Herramientas de Optimización

### Para Imágenes:
1. **TinyPNG** (https://tinypng.com/)
   - Comprime imágenes sin perder calidad

2. **Squoosh** (https://squoosh.app/)
   - Optimizador de imágenes avanzado

3. **GIMP** o **Photoshop**
   - Para redimensionar y ajustar

### Para Video:
1. **HandBrake** (https://handbrake.fr/)
   - Comprimir video manteniendo calidad

2. **FFmpeg** (comando):
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -acodec mp3 -vf scale=1920:1080 -b:v 2M cabecera.mp4
   ```

## 📥 Cómo Agregar las Imágenes

### Opción 1: Manual
1. Crea las carpetas si no existen:
   ```bash
   mkdir -p public/img
   mkdir -p public/video
   ```

2. Copia tus archivos a estas carpetas

3. Asegúrate de que los nombres coincidan exactamente

### Opción 2: Durante el desarrollo
1. Si no tienes las imágenes aún, puedes usar placeholders de:
   - https://placeholder.com/
   - https://via.placeholder.com/
   - https://picsum.photos/

Ejemplo en el código:
```typescript
image: 'https://via.placeholder.com/800x800/333/fff?text=Polo+Negro'
```

## ✅ Checklist de Imágenes

- [ ] portada.jpg (1200x630px) - Para redes sociales
- [ ] polo-negro.jpg (800x800px)
- [ ] pantalon.jpg (800x800px)
- [ ] camisa.jpg (800x800px)
- [ ] short.jpg (800x800px)
- [ ] polo-rayas.jpg (800x800px)
- [ ] jean.jpg (800x800px)
- [ ] camisa-cuadros.jpg (800x800px)
- [ ] gorra.jpg (800x800px)
- [ ] cabecera.mp4 (1920x1080px, <10MB)

## 💡 Consejos

1. **Consistencia**: Usa el mismo fondo para todas las fotos de productos
2. **Iluminación**: Asegúrate de que todas tengan buena iluminación
3. **Ángulo**: Usa el mismo ángulo para productos similares
4. **Calidad**: Prefiere calidad sobre cantidad
5. **Optimización**: Siempre optimiza antes de subir
6. **Nombres**: No uses espacios ni caracteres especiales en nombres de archivo

## 🎨 Recursos Gratuitos (si no tienes imágenes propias)

### Fotos de Stock:
- **Unsplash** (https://unsplash.com/) - Fotos gratis de alta calidad
- **Pexels** (https://www.pexels.com/) - Videos y fotos gratis
- **Pixabay** (https://pixabay.com/) - Imágenes y videos libres

### Videos de Stock:
- **Pexels Videos** (https://www.pexels.com/videos/)
- **Coverr** (https://coverr.co/)
- **Mixkit** (https://mixkit.co/)

Busca términos como:
- "mens fashion"
- "clothing store"
- "menswear"
- "fashion retail"

---

¿Necesitas ayuda para editar o crear las imágenes? ¡Contáctame!
