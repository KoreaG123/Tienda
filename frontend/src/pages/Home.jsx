import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductsGrid from '../components/ProductsGrid';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <ProductsGrid />
      <Footer />
    </div>
  );
}
