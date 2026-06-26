import { construirLinkWhatsapp } from "../services/whatsappService";

interface Props {
  /** Patente a incluir en el mensaje prearmado, si corresponde. */
  patente?: string;
  /** Texto del botón. Por defecto invita a contactar al taller. */
  texto?: string;
  /** Variante visual: "destacado" para CTA principal, "secundario" para uso discreto. */
  variante?: "destacado" | "secundario";
  className?: string;
}

/**
 * Link de contacto por WhatsApp hacia el taller, con mensaje prearmado.
 * Se abre en una pestaña nueva para no perder el estado de la app.
 */
export default function BotonWhatsapp({
  patente,
  texto = "Contactar por WhatsApp",
  variante = "destacado",
  className = "",
}: Props) {
  const href = construirLinkWhatsapp(patente);

  const estilosBase =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors min-h-[48px] px-5 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";

  const estilosVariante =
    variante === "destacado"
      ? "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600 shadow-sm"
      : "bg-neutral-900 text-emerald-400 border border-emerald-800 hover:bg-neutral-800 focus-visible:ring-emerald-600";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${estilosBase} ${estilosVariante} ${className}`}
      aria-label={`${texto}${patente ? ` sobre el vehículo ${patente}` : ""}`}
    >
      <IconoWhatsapp className="h-5 w-5" />
      {texto}
    </a>
  );
}

function IconoWhatsapp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.25h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.09.81.83-3.01-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.15.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.39.11-.51.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.04-.46-.08-.13-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38-.13-.01-.28-.01-.43-.01-.15 0-.39.06-.6.31-.2.25-.78.76-.78 1.85s.8 2.14.91 2.29c.11.15 1.55 2.37 3.76 3.23 1.87.74 2.25.6 2.66.56.41-.04 1.33-.54 1.51-1.07.19-.52.19-.97.13-1.07-.06-.1-.23-.15-.47-.27Z" />
    </svg>
  );
}
