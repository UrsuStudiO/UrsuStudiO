import { createContext, useCallback, useContext, useState } from "react";
import QuoteModal from "../components/QuoteModal";

const QuoteContext = createContext(null);

// Abre el formulario de cotización desde cualquier botón:
// const { openQuote } = useQuote(); openQuote("Dinámica");
export function QuoteProvider({ children }) {
  const [state, setState] = useState({ open: false, plan: "", message: "" });

  const openQuote = useCallback((plan = "", message = "") => setState({ open: true, plan, message }), []);
  const closeQuote = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return (
    <QuoteContext.Provider value={{ openQuote }}>
      {children}
      {state.open && <QuoteModal plan={state.plan} message={state.message} onClose={closeQuote} />}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
