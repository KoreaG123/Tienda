import { motion } from 'framer-motion';
import { Truck, Shield, Star, Heart } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Envío Rápido',
    description: 'Entregas en todo el Perú en 2-5 días hábiles',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Tus datos están protegidos y seguros',
  },
  {
    icon: Star,
    title: 'Calidad Premium',
    description: 'Productos de la más alta calidad',
  },
  {
    icon: Heart,
    title: 'Atención 24/7',
    description: 'Siempre disponibles para ayudarte',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nos dedicamos a ofrecerte la mejor experiencia de compra
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestra Misión
          </h3>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            En HOMBR creemos que la moda es una forma de expresión. Nos dedicamos
            a ofrecerte ropa de calidad que refleje tu estilo único y personalidad.
            Cada prenda es cuidadosamente seleccionada para garantizar comodidad,
            durabilidad y estilo contemporáneo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
