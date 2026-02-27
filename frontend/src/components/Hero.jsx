export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <p className="text-gold-400 uppercase tracking-[0.4em] text-sm font-light mb-4">
          Nueva Colección 2025
        </p>
        <h1 className="text-7xl md:text-9xl font-black tracking-tight text-white mb-6 leading-none">
          HombR
        </h1>
        <p className="text-zinc-300 text-lg md:text-xl font-light tracking-wide mb-10 max-w-md mx-auto">
          Moda masculina premium. Estilo sin límites.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#productos" className="btn-gold">
            Explorar colección
          </a>
          <a href="#productos" className="btn-outline">
            Ver todo
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
