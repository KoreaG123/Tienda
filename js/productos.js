// ========== BARCALM Store - Productos JavaScript ==========

// Base de datos de productos (simulación)
const PRODUCTOS = [
    {
        id: 1,
        nombre: 'Blusa Elegante',
        categoria: 'Mujer',
        precio: 89.90,
        precioAntiguo: 129.90,
        imagen: 'img/productos/blusa-1.jpg',
        colores: ['Blanco', 'Negro', 'Rosa'],
        tallas: ['S', 'M', 'L', 'XL'],
        stock: 15,
        destacado: true,
        nuevo: true,
        descuento: 30,
        rating: 4.5,
        descripcion: 'Blusa elegante perfecta para cualquier ocasión'
    },
    {
        id: 2,
        nombre: 'Vestido Casual',
        categoria: 'Mujer',
        precio: 149.90,
        precioAntiguo: 199.90,
        imagen: 'img/productos/vestido-1.jpg',
        colores: ['Azul', 'Verde', 'Rojo'],
        tallas: ['S', 'M', 'L'],
        stock: 10,
        destacado: true,
        nuevo: false,
        descuento: 25,
        rating: 5,
        descripcion: 'Vestido casual ideal para el día a día'
    },
    {
        id: 3,
        nombre: 'Pantalón Slim Fit',
        categoria: 'Hombre',
        precio: 129.90,
        precioAntiguo: 179.90,
        imagen: 'img/productos/pantalon-1.jpg',
        colores: ['Negro', 'Azul', 'Gris'],
        tallas: ['28', '30', '32', '34', '36'],
        stock: 20,
        destacado: true,
        nuevo: true,
        descuento: 28,
        rating: 4.8,
        descripcion: 'Pantalón slim fit de corte moderno'
    },
    {
        id: 4,
        nombre: 'Camisa Oxford',
        categoria: 'Hombre',
        precio: 99.90,
        precioAntiguo: 139.90,
        imagen: 'img/productos/camisa-1.jpg',
        colores: ['Blanco', 'Celeste', 'Rosa'],
        tallas: ['S', 'M', 'L', 'XL'],
        stock: 18,
        destacado: true,
        nuevo: false,
        descuento: 29,
        rating: 4.3,
        descripcion: 'Camisa oxford clásica y versátil'
    },
    {
        id: 5,
        nombre: 'Zapatillas Deportivas',
        categoria: 'Calzado',
        precio: 179.90,
        precioAntiguo: 249.90,
        imagen: 'img/productos/zapatillas-1.jpg',
        colores: ['Blanco', 'Negro', 'Gris'],
        tallas: ['36', '37', '38', '39', '40', '41', '42'],
        stock: 25,
        destacado: true,
        nuevo: true,
        descuento: 28,
        rating: 4.9,
        descripcion: 'Zapatillas deportivas de alta calidad'
    },
    {
        id: 6,
        nombre: 'Bolso de Mano',
        categoria: 'Accesorios',
        precio: 119.90,
        precioAntiguo: 159.90,
        imagen: 'img/productos/bolso-1.jpg',
        colores: ['Negro', 'Marrón', 'Beige'],
        tallas: ['Único'],
        stock: 12,
        destacado: true,
        nuevo: false,
        descuento: 25,
        rating: 4.6,
        descripcion: 'Bolso elegante para todas tus ocasiones'
    },
    {
        id: 7,
        nombre: 'Chaqueta Denim',
        categoria: 'Mujer',
        precio: 159.90,
        precioAntiguo: 219.90,
        imagen: 'img/productos/chaqueta-1.jpg',
        colores: ['Azul Claro', 'Azul Oscuro', 'Negro'],
        tallas: ['S', 'M', 'L', 'XL'],
        stock: 14,
        destacado: true,
        nuevo: true,
        descuento: 27,
        rating: 4.7,
        descripcion: 'Chaqueta denim versátil y moderna'
    },
    {
        id: 8,
        nombre: 'Polo Deportivo',
        categoria: 'Hombre',
        precio: 69.90,
        precioAntiguo: 99.90,
        imagen: 'img/productos/polo-1.jpg',
        colores: ['Negro', 'Blanco', 'Azul', 'Rojo'],
        tallas: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 30,
        destacado: true,
        nuevo: false,
        descuento: 30,
        rating: 4.4,
        descripcion: 'Polo deportivo cómodo y fresco'
    }
];

// ========== Renderizar Productos Destacados ==========
function renderProductosDestacados() {
    const container = document.getElementById('productosDestacados');
    if (!container) return;

    const productosDestacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);

    container.innerHTML = productosDestacados.map(producto => `
        <div class="producto-card animate-on-scroll">
            <div class="producto-imagen">
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}"
                     onerror="this.src='img/placeholder.jpg'">
                ${producto.nuevo ? '<span class="producto-badge">Nuevo</span>' : ''}
                ${producto.descuento ? `<span class="producto-badge" style="background: #f44336;">-${producto.descuento}%</span>` : ''}
            </div>
            <div class="producto-info">
                <p class="producto-categoria">${producto.categoria}</p>
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="producto-rating">
                    ${renderStars(producto.rating)}
                    <span>(${producto.rating})</span>
                </div>
                <p class="producto-precio">
                    ${formatPrice(producto.precio)}
                    ${producto.precioAntiguo ? `<span class="producto-precio-antiguo">${formatPrice(producto.precioAntiguo)}</span>` : ''}
                </p>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');

    // Reiniciar observer para nuevos elementos
    initScrollAnimations();
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

// ========== Agregar al Carrito ==========
function agregarAlCarrito(productoId) {
    const producto = PRODUCTOS.find(p => p.id === productoId);
    
    if (!producto) {
        window.BARCALM.showNotification('Producto no encontrado', 'error');
        return;
    }

    if (producto.stock <= 0) {
        window.BARCALM.showNotification('Producto sin stock', 'error');
        return;
    }

    // Agregar al carrito
    window.BARCALM.addToCart({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        categoria: producto.categoria
    });
}

// ========== Obtener Producto por ID ==========
function getProductoById(id) {
    return PRODUCTOS.find(p => p.id === parseInt(id));
}

// ========== Filtrar Productos ==========
function filtrarProductos(filtros = {}) {
    let productosFiltrados = [...PRODUCTOS];

    // Filtrar por categoría
    if (filtros.categoria) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.categoria.toLowerCase() === filtros.categoria.toLowerCase()
        );
    }

    // Filtrar por precio
    if (filtros.precioMin) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.precio >= filtros.precioMin
        );
    }

    if (filtros.precioMax) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.precio <= filtros.precioMax
        );
    }

    // Filtrar por talla
    if (filtros.talla) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.tallas.includes(filtros.talla)
        );
    }

    // Filtrar por color
    if (filtros.color) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.colores.includes(filtros.color)
        );
    }

    // Filtrar por búsqueda
    if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        productosFiltrados = productosFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) ||
            p.descripcion.toLowerCase().includes(busqueda) ||
            p.categoria.toLowerCase().includes(busqueda)
        );
    }

    // Ordenar
    if (filtros.ordenar) {
        switch(filtros.ordenar) {
            case 'precio-asc':
                productosFiltrados.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                productosFiltrados.sort((a, b) => b.precio - a.precio);
                break;
            case 'nombre':
                productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'rating':
                productosFiltrados.sort((a, b) => b.rating - a.rating);
                break;
            case 'nuevo':
                productosFiltrados.sort((a, b) => b.nuevo - a.nuevo);
                break;
        }
    }

    return productosFiltrados;
}

// ========== Buscar Productos ==========
function buscarProductos(termino) {
    return filtrarProductos({ busqueda: termino });
}

// ========== Obtener Productos Relacionados ==========
function getProductosRelacionados(productoId, limite = 4) {
    const producto = getProductoById(productoId);
    if (!producto) return [];

    return PRODUCTOS
        .filter(p => p.id !== productoId && p.categoria === producto.categoria)
        .slice(0, limite);
}

// ========== Utilidades ==========
function formatPrice(precio) {
    return `S/${precio.toFixed(2)}`;
}

// ========== Inicialización ==========
document.addEventListener('DOMContentLoaded', () => {
    renderProductosDestacados();
});

// ========== Exportar funciones ==========
window.ProductosModule = {
    PRODUCTOS,
    getProductoById,
    filtrarProductos,
    buscarProductos,
    getProductosRelacionados,
    agregarAlCarrito
};
