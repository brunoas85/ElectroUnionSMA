import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import TurnosPage from "./pages/TurnosPage";
import BusquedaPage from "./pages/BusquedaPage";
import HistorialPage from "./pages/HistorialPage";

/** Define las rutas de la app dentro del layout común (nav + footer). */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/turnos" element={<TurnosPage />} />
        <Route path="/historial" element={<BusquedaPage />} />
        <Route path="/historial/:patente" element={<HistorialPage />} />
      </Route>
    </Routes>
  );
}
