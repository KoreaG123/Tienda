import { Link } from 'react-router-dom';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">¡Pedido confirmado!</h1>
        <p className="text-zinc-400 mb-2">Tu pedido ha sido recibido correctamente.</p>
        <p className="text-zinc-500 text-sm mb-8">
          Hemos abierto WhatsApp para que puedas enviar tu captura de pago. 
          Nos pondremos en contacto contigo pronto.
        </p>
        <div className="w-px h-12 bg-gold-500 mx-auto mb-8" />
        <Link to="/" className="btn-gold inline-block">
          Volver al inicio
        </Link>
        <div className="mt-6">
          <a
            href="https://wa.me/51968531996"
            target="_blank"
            rel="noreferrer"
            className="text-green-400 text-sm hover:text-green-300 transition-colors"
          >
            📱 Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
