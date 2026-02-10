// ========== BARCALM Store - Carrito JavaScript ==========

const ENVIO_GRATIS = 100;
const COSTO_ENVIO = 15;
const CUPONES = {
    'BIENVENIDO': 10,
    'DESCUENTO20': 20,
    'VERANO2026': 15
};

let cuponAplicado = null;

// ========== Inicialización ==========
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    cargarProductosRelacionados();
});

// ========== Cargar Carrito ==========
function cargarCarrito() {
    const cart = window.BARCALM.getCart();
    
    if (cart.length === 0) {
        mostrarCarritoVacio();
    } else {
        mostrarCarritoConProductos(cart);
    }
}

// ========== Mostrar Carrito Vacío ==========
function mostrarCarritoVacio() {
    document.getElementById('carritoVacio').style.display = 'block';
    document.getElementById('carritoProductos').style.display = 'none';
}

// ========== Mostrar Carrito con Productos ==========
function mostrarCarritoConProductos(cart) {
    document.getElementById('carritoVacio').style.display = 'none';
    document.getElementById('carritoProductos').style.display = 'block';
    
    renderProductosCarrito(cart);
    calcularTotales(cart);
}

// ========== Renderizar Productos del Carrito ==========
function renderProductosCarrito(cart) {
    const container = document.getElementById('listaProductos');
    
    container.innerHTML = cart.map(item => `
        <div class="carrito-item" data-id="${item.id}">
            <div class="item-imagen">
                <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='img/placeholder.jpg'">
            </div>
            
            <div class="item-detalles">
                <h3 class="item-nombre">${item.nombre}</h3>
                <p class="item-categoria">${item.categoria}</p>
                <div class="item-opciones">
                    ${item.talla ? `
                        <div class="item-opcion">
                            <i class="fas fa-ruler"></i>
                            <span>Talla: ${item.talla}</span>
                        </div>
                    ` : ''}
                    ${item.color ? `
                        <div class="item-opcion">
                            <i class="fas fa-palette"></i>
                            <span>Color: ${item.color}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="item-acciones">
                <p class="item-precio">S/${(item.precio * item.quantity).toFixed(2)}</p>
                
                <div class="item-cantidad">
                    <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cantidad-valor">${item.quantity}</span>
                    <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <button class="btn-eliminar" onclick="eliminarProducto(${item.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ========== Cambiar Cantidad ==========
function cambiarCantidad(productId, cambio) {
    const cart = window.BARCALM.getCart();
    const item = cart.find(p => p.id === productId);
    
    if (!item) return;
    
    item.quantity += cambio;
    
    if (item.quantity <= 0) {
        eliminarProducto(productId);
        return;
    }
    
    window.BARCALM.saveCart(cart);
    cargarCarrito();
    
    // Animación
    const itemElement = document.querySelector(`[data-id="${productId}"]`);
    itemElement?.classList.add('animate-pulse');
    setTimeout(() => itemElement?.classList.remove('animate-pulse'), 300);
}

// ========== Eliminar Producto ==========
function eliminarProducto(productId) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        const cart = window.BARCALM.getCart();
        const newCart = cart.filter(item => item.id !== productId);
        
        window.BARCALM.saveCart(newCart);
        
        window.BARCALM.showNotification('Producto eliminado del carrito', 'success');
        
        cargarCarrito();
    }
}

// ========== Vaciar Carrito ==========
function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
        window.BARCALM.saveCart([]);
        cuponAplicado = null;
        
        window.BARCALM.showNotification('Carrito vaciado', 'success');
        
        cargarCarrito();
    }
}

// ========== Calcular Totales ==========
function calcularTotales(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    
    // Calcular envío
    const envio = subtotal >= ENVIO_GRATIS ? 0 : COSTO_ENVIO;
    
    // Calcular descuento
    let descuento = 0;
    if (cuponAplicado) {
        descuento = subtotal * (cuponAplicado / 100);
    }
    
    const total = subtotal + envio - descuento;
    
    // Actualizar UI
    document.getElementById('subtotal').textContent = `S/${subtotal.toFixed(2)}`;
    
    const envioElement = document.getElementById('envio');
    if (envio === 0) {
        envioElement.textContent = 'GRATIS';
        envioElement.style.color = 'var(--success-color)';
        envioElement.style.fontWeight = '700';
    } else {
        envioElement.textContent = `S/${envio.toFixed(2)}`;
        envioElement.style.color = '';
        envioElement.style.fontWeight = '';
    }
    
    if (descuento > 0) {
        document.getElementById('descuentoItem').style.display = 'flex';
        document.getElementById('descuento').textContent = `-S/${descuento.toFixed(2)}`;
    } else {
        document.getElementById('descuentoItem').style.display = 'none';
    }
    
    document.getElementById('total').textContent = `S/${total.toFixed(2)}`;
    
    // Mensaje de envío gratis
    if (subtotal < ENVIO_GRATIS && envio > 0) {
        const faltante = ENVIO_GRATIS - subtotal;
        mostrarMensajeEnvio(`¡Agrega S/${faltante.toFixed(2)} más para envío gratis!`);
    }
}

// ========== Mensaje de Envío ==========
function mostrarMensajeEnvio(mensaje) {
    let mensajeElement = document.getElementById('mensajeEnvio');
    
    if (!mensajeElement) {
        mensajeElement = document.createElement('div');
        mensajeElement.id = 'mensajeEnvio';
        mensajeElement.style.cssText = `
            background: #fff3cd;
            color: #856404;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            text-align: center;
            border: 1px solid #ffeaa7;
        `;
        
        const resumen = document.querySelector('.carrito-resumen');
        resumen.insertBefore(mensajeElement, resumen.querySelector('h3').nextSibling);
    }
    
    mensajeElement.innerHTML = `<i class="fas fa-truck"></i> ${mensaje}`;
}

// ========== Aplicar Cupón ==========
function aplicarCupon() {
    const input = document.getElementById('cuponInput');
    const codigo = input.value.trim().toUpperCase();
    
    if (!codigo) {
        window.BARCALM.showNotification('Ingresa un código de cupón', 'error');
        return;
    }
    
    if (CUPONES[codigo]) {
        cuponAplicado = CUPONES[codigo];
        window.BARCALM.showNotification(`¡Cupón aplicado! ${cuponAplicado}% de descuento`, 'success');
        input.value = '';
        input.disabled = true;
        
        const cart = window.BARCALM.getCart();
        calcularTotales(cart);
    } else {
        window.BARCALM.showNotification('Cupón inválido', 'error');
    }
}

// ========== Proceder al Checkout ==========
function procederCheckout() {
    const cart = window.BARCALM.getCart();
    
    if (cart.length === 0) {
        window.BARCALM.showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    // Guardar datos del resumen para el checkout
    const resumen = {
        subtotal: document.getElementById('subtotal').textContent,
        envio: document.getElementById('envio').textContent,
        descuento: cuponAplicado ? document.getElementById('descuento').textContent : null,
        total: document.getElementById('total').textContent,
        cupon: cuponAplicado
    };
    
    localStorage.setItem('checkoutResumen', JSON.stringify(resumen));
    
    // Redirigir al checkout
    window.location.href = 'checkout.html';
}

// ========== Cargar Productos Relacionados ==========
function cargarProductosRelacionados() {
    const productosRelacionados = window.ProductosModule.PRODUCTOS
        .filter(p => p.destacado)
        .slice(0, 4);
    
    const container = document.getElementById('productosRelacionados');
    
    container.innerHTML = productosRelacionados.map(producto => `
        <div class="producto-card">
            <div class="producto-imagen">
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}"
                     onerror="this.src='img/placeholder.jpg'">
                ${producto.nuevo ? '<span class="producto-badge">Nuevo</span>' : ''}
            </div>
            <div class="producto-info">
                <p class="producto-categoria">${producto.categoria}</p>
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-precio">
                    S/${producto.precio.toFixed(2)}
                </p>
                <button class="btn-agregar" onclick="agregarDesdeRelacionados(${producto.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar
                </button>
            </div>
        </div>
    `).join('');
}

// ========== Agregar desde Relacionados ==========
function agregarDesdeRelacionados(productoId) {
    window.ProductosModule.agregarAlCarrito(productoId);
    cargarCarrito();
}

// ========== Animación Pulse ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    .animate-pulse {
        animation: pulse 0.3s ease;
    }
`;
document.head.appendChild(style);

// ========== Exportar Funciones ==========
window.CarritoModule = {
    cambiarCantidad,
    eliminarProducto,
    vaciarCarrito,
    aplicarCupon,
    procederCheckout
};
