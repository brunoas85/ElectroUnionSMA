import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

/** Estructura común de página: navegación arriba, contenido de la ruta activa, footer abajo. */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <Nav />
      <main className="relative flex-1 overflow-x-hidden">
        <img
          src="/logoElectro.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-[calc(50%+100px)] -translate-x-1/2 -translate-y-1/2 select-none rounded-full object-cover opacity-20 z-0"
          style={{ width: "min(700px, 90vw)", height: "min(700px, 90vw)" }}
        />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
