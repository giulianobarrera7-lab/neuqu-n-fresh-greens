import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import WhyHydroponic from "@/components/WhyHydroponic";
import ClientZone from "@/components/ClientZone";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProductCatalog />
      <WhyHydroponic />
      <ClientZone />
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
