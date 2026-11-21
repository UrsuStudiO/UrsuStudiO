// Datos del estudio que dan confianza. Completa estos campos y aparecerán solos en la web:
//
// whatsapp -> código de país + número, sin "+" ni espacios. Ej.: "59170000000"
//             Si queda vacío, el botón de WhatsApp no se muestra.
// founder  -> la persona detrás del estudio. Si "name" queda vacío, el bloque no se muestra.
//             photo: pon tu foto en /public/equipo/ y escribe aquí la ruta, ej. "/equipo/foto.webp"
export const STUDIO = {
  whatsapp: "",
  whatsappText: {
    es: "Hola UrsuStudiO, quiero una página web para mi negocio.",
    en: "Hi UrsuStudiO, I'd like a website for my business.",
  },
  founder: {
    name: "",
    photo: "",
    role: { es: "Fundador y diseñador web", en: "Founder & web designer" },
    quote: {
      es: "Diseño cada página como si fuera para mi propio negocio: rápida, clara y hecha para vender.",
      en: "I design every page as if it were for my own business: fast, clear and built to sell.",
    },
  },
};

export const waLink = (lang) =>
  STUDIO.whatsapp ? `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(STUDIO.whatsappText[lang])}` : "";
