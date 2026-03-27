import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import WhyHydroponic from "@/components/WhyHydroponic";
import ClientZone from "@/components/ClientZone";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";

const Index = () => {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <HeroSection />
      <ProductCatalog />
      <WhyHydroponic />
      <ClientZone />
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </CartProvider>
  );
};

export default Index;
