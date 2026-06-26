import { createContext, useContext, useEffect, useState } from "react";

type Tema = "oscuro" | "industrial";

interface TemaContextValue {
  tema: Tema;
  toggleTema: () => void;
}

const TemaContext = createContext<TemaContextValue>({
  tema: "oscuro",
  toggleTema: () => {},
});

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => {
    return (localStorage.getItem("tema") as Tema) ?? "oscuro";
  });

  useEffect(() => {
    if (tema === "industrial") {
      document.documentElement.dataset.tema = "industrial";
    } else {
      delete document.documentElement.dataset.tema;
    }
    localStorage.setItem("tema", tema);
  }, [tema]);

  function toggleTema() {
    setTema((t) => (t === "oscuro" ? "industrial" : "oscuro"));
  }

  return (
    <TemaContext.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}
