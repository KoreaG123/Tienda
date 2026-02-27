export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-3xl font-black text-white tracking-widest mb-2">HombR</h3>
            <p className="text-zinc-500 text-sm">Moda masculina premium.</p>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Inicio</a>
            <a href="#productos" className="hover:text-white transition-colors">Colección</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <div className="text-center">
            <p className="text-zinc-600 text-xs">WhatsApp: <a href="https://wa.me/51968531996" className="text-gold-400 hover:text-gold-300" target="_blank" rel="noreferrer">+51 968 531 996</a></p>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-zinc-600 text-xs">© 2025 HombR. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
