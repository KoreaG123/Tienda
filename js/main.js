// ========== BARCALM Store - Main JavaScript ==========

// Configuración Global
const CONFIG = {
    apiUrl: '/api',
    whatsappNumber: '51999999999',
    currency: 'S/',
    heroSlideInterval: 5000
};

// ========== Inicialización ==========
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroSlider();
    initScrollAnimations();
    initModals();
    initNewsletter();
    updateCartCount();
});

// ========== Navegación ==========
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;

    // Toggle menú móvil
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un enlace
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!navMenu?.contains(e.target) && !hamburger?.contains(e.target)) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Navbar sticky con efecto
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ========== Hero Slider ==========
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.hero-dots');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    
    if (!slides.length) return;

    let currentSlide = 0;
    let slideInterval;

    // Crear dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer?.appendChild(dot);
    });

    const dots = document.querySelectorAll('.hero-dot');

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, CONFIG.heroSlideInterval);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Event Listeners
    prevBtn?.addEventListener('click', () => {
        prevSlide();
        stopSlideshow();
        startSlideshow();
    });

    nextBtn?.addEventListener('click', () => {
        nextSlide();
        stopSlideshow();
        startSlideshow();
    });

    // Touch events para móvil
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector('.hero')?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.querySelector('.hero')?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        }
    }

    // Iniciar slideshow
    startSlideshow();

    // Pausar en hover
    document.querySelector('.hero')?.addEventListener('mouseenter', stopSlideshow);
    document.querySelector('.hero')?.addEventListener('mouseleave', startSlideshow);
}

// ========== Animaciones en Scroll ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos con clase animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ========== Modales ==========
function initModals() {
    const btnUsuario = document.getElementById('btnUsuario');
    const modalLogin = document.getElementById('modalLogin');
    const modalClose = document.querySelectorAll('.modal-close');

    // Abrir modal de login
    btnUsuario?.addEventListener('click', (e) => {
        e.preventDefault();
        modalLogin?.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Cerrar modales
    modalClose.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        });
    });

    // Cerrar al hacer click fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', handleLogin);
}

// ========== Funciones de Carrito ==========
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    showNotification('Producto agregado al carrito', 'success');
    
    // Animación del icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon?.classList.add('bounce');
    setTimeout(() => cartIcon?.classList.remove('bounce'), 500);
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ========== Notificaciones ==========
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            .notification-success { border-left: 4px solid #4caf50; }
            .notification-error { border-left: 4px solid #f44336; }
            .notification i { font-size: 20px; }
            .notification-success i { color: #4caf50; }
            .notification-error i { color: #f44336; }
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== Newsletter ==========
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulación de suscripción
        setTimeout(() => {
            showNotification('¡Gracias por suscribirte!', 'success');
            newsletterForm.reset();
        }, 500);
    });
}

// ========== Login ==========
function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    // Simulación de login
    setTimeout(() => {
        showNotification('Inicio de sesión exitoso', 'success');
        document.getElementById('modalLogin')?.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
    }, 500);
}

// ========== Búsqueda ==========
const btnBuscar = document.getElementById('btnBuscar');
btnBuscar?.addEventListener('click', (e) => {
    e.preventDefault();
    // Crear modal de búsqueda si no existe
    let searchModal = document.getElementById('searchModal');
    
    if (!searchModal) {
        searchModal = document.createElement('div');
        searchModal.id = 'searchModal';
        searchModal.className = 'modal';
        searchModal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>Buscar Productos</h2>
                <form id="searchForm">
                    <div class="form-group">
                        <input type="text" placeholder="¿Qué estás buscando?" id="searchInput">
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Buscar</button>
                </form>
                <div id="searchResults"></div>
            </div>
        `;
        document.body.appendChild(searchModal);

        // Event listeners
        searchModal.querySelector('.modal-close').addEventListener('click', () => {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
});

// ========== Utilidades ==========
function formatPrice(price) {
    return `${CONFIG.currency}${price.toFixed(2)}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ========== Animación del icono del carrito ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    .cart-icon.bounce {
        animation: bounce 0.5s ease;
    }
`;
document.head.appendChild(style);

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========== Performance: Lazy Loading de Imágenes ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== Exportar funciones globales ==========
window.BARCALM = {
    addToCart,
    showNotification,
    formatPrice,
    getCart,
    saveCart
};
