# 📦 Guía para Subir tu Proyecto a GitHub

## 🎯 Estructura Final del Repositorio

Tu repositorio en GitHub debe tener esta estructura:

```
hombr-tienda/
├── .gitignore
├── README.md
├── INICIO-RAPIDO.md
├── IMAGENES.md
├── package.json
├── package-lock.json (se genera automáticamente)
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   ├── img/
│   │   ├── portada.jpg
│   │   ├── polo-negro.jpg
│   │   ├── pantalon.jpg
│   │   ├── camisa.jpg
│   │   ├── short.jpg
│   │   ├── polo-rayas.jpg
│   │   ├── jean.jpg
│   │   ├── camisa-cuadros.jpg
│   │   └── gorra.jpg
│   └── video/
│       └── cabecera.mp4
└── src/
    ├── components/
    │   ├── admin/
    │   │   └── AdminPanel.tsx
    │   ├── Header.tsx
    │   ├── Hero.tsx
    │   ├── ProductCard.tsx
    │   ├── ProductsSection.tsx
    │   ├── AboutSection.tsx
    │   ├── ContactSection.tsx
    │   ├── Footer.tsx
    │   ├── CartDrawer.tsx
    │   └── WhatsAppFloat.tsx
    ├── data/
    │   └── products.ts
    ├── lib/
    │   ├── store.ts
    │   └── whatsapp.ts
    ├── types/
    │   └── index.ts
    ├── App.tsx
    ├── main.tsx
    └── index.css
```

## 🚀 Pasos para Subir a GitHub

### 1. Crear Repositorio en GitHub

1. Ve a https://github.com
2. Click en "New repository"
3. Nombre: `hombr-tienda`
4. Descripción: "Tienda de ropa masculina online con carrito y WhatsApp"
5. **NO** marques "Initialize with README"
6. Click en "Create repository"

### 2. Inicializar Git en tu proyecto

Abre una terminal en la carpeta del proyecto:

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: HOMBR tienda completa"

# Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/hombr-tienda.git

# Subir código
git branch -M main
git push -u origin main
```

### 3. Verificar que todo esté subido

Ve a tu repositorio en GitHub y verifica que todos los archivos estén ahí.

## ⚠️ IMPORTANTE: Archivos Grandes

GitHub tiene un límite de 100MB por archivo. Si tu video es muy grande:

### Opción 1: Comprimir el video
```bash
# Usando FFmpeg
ffmpeg -i cabecera.mp4 -vcodec h264 -b:v 2M cabecera-compressed.mp4
```

### Opción 2: Usar Git LFS (Large File Storage)
```bash
# Instalar Git LFS
git lfs install

# Rastrear archivos de video
git lfs track "*.mp4"

# Agregar y subir
git add .gitattributes
git add public/video/cabecera.mp4
git commit -m "Add video with LFS"
git push
```

### Opción 3: Hostear el video externamente
Sube el video a:
- YouTube (privado o no listado)
- Vimeo
- Cloudinary
- AWS S3

Y usa la URL en el componente Hero.

## 📝 README.md para GitHub

El archivo README.md ya está creado e incluye:
- ✅ Descripción del proyecto
- ✅ Características
- ✅ Instrucciones de instalación
- ✅ Guía de uso
- ✅ Personalización
- ✅ Despliegue

## 🎨 Agregar Imagen de Portada al README

1. Sube `portada.jpg` a GitHub
2. Edita el README.md y agrega al inicio:

```markdown
![HOMBR](./public/img/portada.jpg)
```

## 🔒 Seguridad

### ⚠️ NUNCA subas a GitHub:
- Contraseñas reales de admin
- Claves de API
- Tokens de pago
- Información sensible

### ✅ Para producción:
Usa variables de entorno (.env):

```bash
# .env (este archivo está en .gitignore)
VITE_ADMIN_PASSWORD=tu_contraseña_segura
VITE_WHATSAPP_NUMBER=51968531996
```

Y accede así:
```typescript
const password = import.meta.env.VITE_ADMIN_PASSWORD;
```

## 🌟 Hacer tu README Atractivo

Agrega badges al inicio del README:

```markdown
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue)
![License](https://img.shields.io/badge/License-MIT-green)
```

## 📤 Comandos Git Útiles

```bash
# Ver estado de archivos
git status

# Agregar archivos específicos
git add src/components/Header.tsx

# Hacer commit
git commit -m "Descripción del cambio"

# Subir cambios
git push

# Descargar cambios
git pull

# Ver historial
git log

# Crear rama nueva
git checkout -b nueva-funcionalidad

# Cambiar de rama
git checkout main

# Fusionar ramas
git merge nueva-funcionalidad
```

## 🔄 Workflow Recomendado

1. **Desarrollo Local**
   ```bash
   npm run dev
   ```

2. **Hacer cambios** en el código

3. **Probar** que todo funcione

4. **Commit y Push**
   ```bash
   git add .
   git commit -m "Descripción clara del cambio"
   git push
   ```

5. **Deploy automático** (si usas Vercel/Netlify)

## 📊 GitHub Pages (Hosting Gratis)

Para publicar en GitHub Pages:

1. Instala el paquete:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Agrega a `package.json`:
   ```json
   {
     "homepage": "https://TU-USUARIO.github.io/hombr-tienda",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Despliega:
   ```bash
   npm run deploy
   ```

4. Habilita GitHub Pages en Settings del repo

## 🎓 Recursos Adicionales

- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **GitHub Docs**: https://docs.github.com
- **Markdown Guide**: https://www.markdownguide.org

## ✅ Checklist antes de hacer público

- [ ] Todas las contraseñas están en variables de entorno
- [ ] El README está completo
- [ ] Las imágenes están optimizadas
- [ ] El código está comentado
- [ ] No hay console.log innecesarios
- [ ] La licencia está definida
- [ ] El .gitignore incluye node_modules y .env

¡Tu proyecto está listo para GitHub! 🎉
