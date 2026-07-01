/** Sección principal de la landing: identidad de marca del taller. */
export default function HeroSection() {
  return (
    <section className="px-4 py-8 text-center sm:px-6 sm:py-12">
      <h1>
        <span
          className="block text-5xl uppercase sm:text-7xl"
          style={{
            fontFamily: '"Archivo Narrow", "Roboto Condensed", sans-serif',
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: "-1.5px",
            background: "linear-gradient(to bottom, #FFFFFF, #A0A0A0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(2px 3px 5px rgba(0, 0, 0, 0.8))",
          }}
        >
          ELECTROUNIÓN
        </span>
        <span className="mt-3 block text-sm font-semibold tracking-[0.4em] text-neutral-400 uppercase sm:text-base">
          San Martín de los Andes
        </span>
      </h1>
    </section>
  );
}
