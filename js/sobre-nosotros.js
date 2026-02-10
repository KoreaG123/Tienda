// ========== BARCALM Store - Sobre Nosotros JavaScript ==========

document.addEventListener('DOMContentLoaded', () => {
    initContadores();
});

// ========== Inicializar Contadores Animados ==========
function initContadores() {
    const contadores = document.querySelectorAll('.stat-numero');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarContador(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    contadores.forEach(contador => observer.observe(contador));
}

// ========== Animar Contador ==========
function animarContador(elemento) {
    const target = parseFloat(elemento.dataset.target);
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const esDecimal = target % 1 !== 0;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (esDecimal) {
            elemento.textContent = current.toFixed(1);
        } else {
            elemento.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ========== Animaciones de Scroll (ya definidas en main.js) ==========
// Solo aseguramos que se inicialicen
if (window.initScrollAnimations) {
    window.initScrollAnimations();
}
