import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import ServiciosSection from "../components/ServiciosSection";
import QuienesSomosSection from "../components/QuienesSomosSection";
import ContactoSection from "../components/ContactoSection";

/** Página de inicio: presentación del taller, servicios, quiénes somos y contacto. */
export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const elemento = document.getElementById(location.hash.slice(1));
    elemento?.scrollIntoView({ behavior: "smooth" });
  }, [location.hash]);

  return (
    <div className="mx-auto max-w-5xl">
      <HeroSection />
      <ServiciosSection />
      <QuienesSomosSection />
      <ContactoSection />
    </div>
  );
}
