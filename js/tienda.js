// ========== BARCALM Store - Tienda JavaScript ==========

let productosFiltrados = [];
let filtrosActuales = {};

// ========== Cargar Productos ==========
function cargarProductos() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('cat');
    
    if (categoria) {
        filtrosActuales.categoria = categoria;
        marcarFiltroCategoria(categoria);
    }
    
    aplicarFiltros();
}

// ========== Marcar Filtro de Categoría ==========
function marcarFiltroCategoria(categoria) {
    const checkbox = document.querySelector(`input[value="${categoria}"]`);
    if (checkbox) {
        checkbox.checked = true;
    }
}

// ========== Aplicar Filtros ==========
function aplicarFiltros() {
    // Obtener categorías seleccionadas
    const categoriasChecked = Array.from(document.querySelectorAll('[id^="cat-"]:checked'))
        .map(cb => cb.value);
    
    // Obtener tallas seleccionadas
    const tallasChecked = Array.from(document.querySelectorAll('[id^="talla-"]:checked'))
        .map(cb => cb.value);
    
    // Obtener rango de precio
    const precioMin = parseFloat(document.getElementById('precioMin').value) || 0;
    const precioMax = parseFloat(document.getElementById('precioMax').value) || Infinity;
    
    // Construir objeto de filtros
    filtrosActuales = {};
    
    if (categoriasChecked.length > 0) {
        filtrosActuales.categorias = categoriasChecked;
    }
    
    if (tallasChecked.length > 0) {
        filtrosActuales.tallas = tallasChecked;
    }
    
    if (precioMin > 0) {
        filtrosActuales.precioMin = precioMin;
    }
    
    if (precioMax < Infinity) {
        filtrosActuales.precioMax = precioMax;
    }
    
    // Obtener orden actual
    const orden = document.getElementById('ordenarSelect').value;
    if (orden) {
        filtrosActuales.ordenar = orden;
    }
    
    // Filtrar productos
    productosFiltrados = filtrarProductosCompleto(filtrosActuales);
    
    // Renderizar productos
    renderProductos(productosFiltrados);
    
    // Actualizar contador
    document.getElementById('totalProductos').textContent = productosFiltrados.length;
}

// ========== Filtrar Productos Completo ==========
function filtrarProductosCompleto(filtros) {
    let productos = [...window.ProductosModule.PRODUCTOS];
    
    // Filtrar por categorías
    if (filtros.categorias && filtros.categorias.length > 0) {
        productos = productos.filter(p => filtros.categorias.includes(p.categoria));
    }
    
    // Filtrar por tallas
    if (filtros.tallas && filtros.tallas.length > 0) {
        productos = productos.filter(p => 
            p.tallas.some(talla => filtros.tallas.includes(talla))
        );
    }
    
    // Filtrar por precio
    if (filtros.precioMin) {
        productos = productos.filter(p => p.precio >= filtros.precioMin);
    }
    
    if (filtros.precioMax) {
        productos = productos.filter(p => p.precio <= filtros.precioMax);
    }
    
    // Ordenar
    if (filtros.ordenar) {
        switch(filtros.ordenar) {
            case 'precio-asc':
                productos.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                productos.sort((a, b) => b.precio - a.precio);
                break;
            case 'nombre':
                productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'rating':
                productos.sort((a, b) => b.rating - a.rating);
                break;
            case 'nuevo':
                productos.sort((a, b) => b.nuevo - a.nuevo);
                break;
        }
    }
    
    return productos;
}

// ========== Renderizar Productos ==========
function renderProductos(productos) {
    const grid = document.getElementById('productosGrid');
    
    if (productos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 64px; color: #ccc; margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 10px;">No se encontraron productos</h3>
                <p style="color: #666;">Intenta ajustar los filtros</p>
                <button class="btn btn-primary" onclick="limpiarFiltros()" style="margin-top: 20px;">
                    Limpiar Filtros
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productos.map(producto => `
        <div class="producto-card animate-on-scroll">
            <div class="producto-imagen">
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}"
                     onerror="this.src='img/placeholder.jpg'">
                ${producto.nuevo ? '<span class="producto-badge">Nuevo</span>' : ''}
                ${producto.descuento ? `<span class="producto-badge" style="background: #f44336; top: 50px;">-${producto.descuento}%</span>` : ''}
            </div>
            <div class="producto-info">
                <p class="producto-categoria">${producto.categoria}</p>
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="producto-rating">
                    ${renderStars(producto.rating)}
                    <span>(${producto.rating})</span>
                </div>
                <p class="producto-precio">
                    S/${producto.precio.toFixed(2)}
                    ${producto.precioAntiguo ? `<span class="producto-precio-antiguo">S/${producto.precioAntiguo.toFixed(2)}</span>` : ''}
                </p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    ${producto.colores.slice(0, 4).map(color => `
                        <div style="width: 25px; height: 25px; border-radius: 50%; background: ${getColorHex(color)}; border: 2px solid #ddd;" title="${color}"></div>
                    `).join('')}
                </div>
                <button class="btn-agregar" onclick="window.ProductosModule.agregarAlCarrito(${producto.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
    
    // Reiniciar animaciones
    setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
}

// ========== Aplicar Orden ==========
function aplicarOrden() {
    aplicarFiltros();
}

// ========== Limpiar Filtros ==========
function limpiarFiltros() {
    // Limpiar checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Limpiar inputs de precio
    document.getElementById('precioMin').value = '';
    document.getElementById('precioMax').value = '';
    
    // Limpiar select de orden
    document.getElementById('ordenarSelect').value = '';
    
    // Limpiar filtros actuales
    filtrosActuales = {};
    
    // Aplicar filtros (mostrar todos)
    aplicarFiltros();
}

// ========== Renderizar Estrellas ==========
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// ========== Obtener Color Hex ==========
function getColorHex(colorName) {
    const colores = {
        'Blanco': '#ffffff',
        'Negro': '#000000',
        'Rosa': '#ff69b4',
        'Azul': '#0066cc',
        'Verde': '#00cc66',
        'Rojo': '#ff0000',
        'Gris': '#808080',
        'Celeste': '#87ceeb',
        'Azul Claro': '#add8e6',
        'Azul Oscuro': '#00008b',
        'Marrón': '#8b4513',
        'Beige': '#f5f5dc'
    };
    
    return colores[colorName] || '#cccccc';
}

// ========== Inicialización ==========
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    
    // Event listeners para filtros en tiempo real (opcional)
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', aplicarFiltros);
    });
});
