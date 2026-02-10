// ========== BARCALM Store - Checkout JavaScript ==========

document.addEventListener('DOMContentLoaded', () => {
    cargarResumenCheckout();
    inicializarFormulario();
});

// ========== Cargar Resumen del Checkout ==========
function cargarResumenCheckout() {
    const cart = window.BARCALM.getCart();
    
    if (cart.length === 0) {
        window.location.href = 'carrito.html';
        return;
    }
    
    // Renderizar productos
    renderProductosResumen(cart);
    
    // Cargar totales guardados del carrito
    const resumenGuardado = JSON.parse(localStorage.getItem('checkoutResumen') || '{}');
    
    if (resumenGuardado.subtotal) {
        document.getElementById('subtotal').textContent = resumenGuardado.subtotal;
        document.getElementById('envio').textContent = resumenGuardado.envio;
        document.getElementById('total').textContent = resumenGuardado.total;
        
        if (resumenGuardado.descuento) {
            document.getElementById('descuentoItem').style.display = 'flex';
            document.getElementById('descuento').textContent = resumenGuardado.descuento;
        }
    } else {
        calcularTotales(cart);
    }
}

// ========== Renderizar Productos en el Resumen ==========
function renderProductosResumen(cart) {
    const container = document.getElementById('resumenProductos');
    
    container.innerHTML = cart.map(item => `
        <div class="resumen-producto">
            <div class="resumen-producto-img">
                <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="resumen-producto-info">
                <div class="resumen-producto-nombre">${item.nombre}</div>
                <div class="resumen-producto-detalles">
                    Cantidad: ${item.quantity}
                    ${item.talla ? ` | Talla: ${item.talla}` : ''}
                    ${item.color ? ` | Color: ${item.color}` : ''}
                </div>
            </div>
            <div class="resumen-producto-precio">
                S/${(item.precio * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
}

// ========== Calcular Totales ==========
function calcularTotales(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    const envio = subtotal >= 100 ? 0 : 15;
    const total = subtotal + envio;
    
    document.getElementById('subtotal').textContent = `S/${subtotal.toFixed(2)}`;
    
    if (envio === 0) {
        document.getElementById('envio').textContent = 'GRATIS';
    } else {
        document.getElementById('envio').textContent = `S/${envio.toFixed(2)}`;
    }
    
    document.getElementById('total').textContent = `S/${total.toFixed(2)}`;
}

// ========== Inicializar Formulario ==========
function inicializarFormulario() {
    const form = document.getElementById('formCheckout');
    
    // Evento de cambio en método de entrega
    const radiosEntrega = document.querySelectorAll('input[name="entrega"]');
    radiosEntrega.forEach(radio => {
        radio.addEventListener('change', actualizarEnvio);
    });
    
    // Submit del formulario
    form.addEventListener('submit', procesarPedido);
}

// ========== Actualizar Costo de Envío ==========
function actualizarEnvio() {
    const metodoEntrega = document.querySelector('input[name="entrega"]:checked').value;
    const cart = window.BARCALM.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    
    let envio = 0;
    
    if (metodoEntrega === 'domicilio') {
        envio = subtotal >= 100 ? 0 : 15;
    } else {
        envio = 0; // Recojo en tienda es gratis
    }
    
    const total = subtotal + envio;
    
    if (envio === 0) {
        document.getElementById('envio').textContent = 'GRATIS';
    } else {
        document.getElementById('envio').textContent = `S/${envio.toFixed(2)}`;
    }
    
    document.getElementById('total').textContent = `S/${total.toFixed(2)}`;
}

// ========== Procesar Pedido ==========
function procesarPedido(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData);
    
    // Obtener carrito
    const cart = window.BARCALM.getCart();
    
    // Crear objeto del pedido
    const pedido = {
        numero: generarNumeroPedido(),
        fecha: new Date().toISOString(),
        cliente: {
            nombre: datos.nombre,
            apellidos: datos.apellidos,
            email: datos.email,
            telefono: datos.telefono
        },
        direccion: {
            direccion: datos.direccion,
            distrito: datos.distrito,
            referencia: datos.referencia
        },
        entrega: datos.entrega,
        pago: datos.pago,
        notas: datos.notas,
        productos: cart,
        totales: {
            subtotal: document.getElementById('subtotal').textContent,
            envio: document.getElementById('envio').textContent,
            total: document.getElementById('total').textContent
        },
        estado: 'pendiente'
    };
    
    // Guardar pedido
    guardarPedido(pedido);
    
    // Mostrar modal de confirmación
    mostrarConfirmacion(pedido);
    
    // Limpiar carrito
    window.BARCALM.saveCart([]);
    localStorage.removeItem('checkoutResumen');
    
    // Enviar notificaciones (simulado)
    enviarNotificaciones(pedido);
}

// ========== Generar Número de Pedido ==========
function generarNumeroPedido() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `#${timestamp}${random}`.slice(0, 10);
}

// ========== Guardar Pedido ==========
function guardarPedido(pedido) {
    // Obtener pedidos existentes
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    
    // Agregar nuevo pedido
    pedidos.push(pedido);
    
    // Guardar
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.setItem('ultimoPedido', JSON.stringify(pedido));
}

// ========== Mostrar Confirmación ==========
function mostrarConfirmacion(pedido) {
    document.getElementById('numeroPedido').textContent = pedido.numero;
    document.getElementById('modalConfirmacion').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== Enviar Notificaciones ==========
function enviarNotificaciones(pedido) {
    // En producción, aquí se enviarían las notificaciones reales
    
    console.log('📧 Email enviado al cliente:', pedido.cliente.email);
    console.log('📱 WhatsApp enviado al dueño con el pedido:', pedido.numero);
    
    // Simular envío de email
    setTimeout(() => {
        console.log('✅ Notificaciones enviadas correctamente');
    }, 1000);
    
    // Información del pedido para WhatsApp
    const mensajeWhatsApp = `
🛍️ *NUEVO PEDIDO - ${pedido.numero}*

👤 *Cliente:*
${pedido.cliente.nombre} ${pedido.cliente.apellidos}
📧 ${pedido.cliente.email}
📞 ${pedido.cliente.telefono}

📍 *Dirección:*
${pedido.direccion.direccion}
${pedido.direccion.distrito}
${pedido.direccion.referencia ? `Ref: ${pedido.direccion.referencia}` : ''}

📦 *Productos:*
${pedido.productos.map(p => `- ${p.nombre} x${p.quantity}`).join('\n')}

💰 *Total:* ${pedido.totales.total}
🚚 *Entrega:* ${pedido.entrega === 'domicilio' ? 'A domicilio' : 'Recojo en tienda'}
💳 *Pago:* ${pedido.pago.toUpperCase()}

${pedido.notas ? `📝 *Notas:* ${pedido.notas}` : ''}
    `.trim();
    
    console.log('Mensaje WhatsApp:', mensajeWhatsApp);
}

// ========== Validación de Distrito ==========
document.getElementById('distritoSelect')?.addEventListener('change', function() {
    if (this.value === 'otros') {
        window.BARCALM.showNotification('Envío disponible. El costo puede variar según la zona.', 'info');
    }
});

// ========== Formatear Teléfono ==========
document.querySelector('input[name="telefono"]')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && !value.startsWith('51')) {
        value = '51' + value;
    }
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    e.target.value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
});
