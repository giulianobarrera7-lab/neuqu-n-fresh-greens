import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5492994000000";

const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Quiero consultar por lechugas hidropónicas")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(142,70%,40%)] text-primary-foreground shadow-lg hover:scale-110 transition-transform"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;
