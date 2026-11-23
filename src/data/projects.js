// Edita aquí tus webs. Por proyecto:
//
// name      -> nombre de la marca demo
// category  -> rubro en español e inglés
// url       -> link a la demo en Vercel
// keywords  -> palabras que la gente escribe en "¿Qué negocio tienes?" (sin tildes, en minúsculas)
//
// Las capturas se toman solas de /public/projects/shots/<slug>-{desktop,tablet,mobile,scroll}.webp
// (slug = nombre en minúsculas con guiones, ej. "Nova Run" -> nova-run).
const projects = [
  {
    name: "Altavista",
    highlight: { es: "Selector de tipologías que arma la visita privada", en: "Unit picker that books the private viewing" },
    category: { es: "Bienes raíces", en: "Real estate" },
    url: "https://altavista.pages.dev/",
    keywords: ["inmobiliaria", "bienes raices", "departamentos", "departamento", "casas", "casa", "constructora", "arquitectura", "arquitecto", "condominio", "terrenos", "edificio", "alquiler", "anticretico", "real estate", "apartments", "construction", "architecture", "property", "realtor"],
  },
  {
    name: "Bloque",
    highlight: { es: "Drop con carrito y aviso del próximo envío", en: "Drop with cart and next-release alerts" },
    category: { es: "Moda", en: "Fashion" },
    url: "https://bloque.pages.dev/",
    keywords: ["ropa", "moda", "tienda de ropa", "marca de ropa", "streetwear", "poleras", "boutique", "chamarras", "polerones", "tienda online", "emprendimiento", "clothing", "fashion", "apparel", "store", "brand"],
  },
  {
    name: "Nova Run",
    highlight: { es: "Escenas con scroll y selector de talla", en: "Scroll-driven scenes and a size picker" },
    category: { es: "Deporte", en: "Sports" },
    url: "https://nova-run.pages.dev/",
    keywords: ["zapatillas", "zapatos", "calzado", "deporte", "deportes", "running", "gimnasio", "gym", "fitness", "tienda deportiva", "crossfit", "lanzamiento", "producto", "sneakers", "shoes", "sports", "product launch"],
  },
  {
    name: "Terra Crema",
    highlight: { es: "Test de piel, pack de las tres y pedido por WhatsApp", en: "Skin quiz, three-pack and WhatsApp orders" },
    category: { es: "Belleza", en: "Beauty" },
    url: "https://terracrema.pages.dev/",
    keywords: ["cosmetica", "belleza", "cremas", "crema facial", "cuidado de la piel", "skincare", "spa", "salon de belleza", "peluqueria", "barberia", "estetica", "maquillaje", "unas", "farmacia", "productos naturales", "dermatologia", "beauty", "cosmetics", "salon", "nails"],
  },
  {
    name: "Cafe Ritual",
    highlight: { es: "Tienda de café con bolsa, suscripción y pedido por WhatsApp", en: "Coffee shop with a bag, subscription and WhatsApp orders" },
    category: { es: "Gastronomía", en: "Food & drink" },
    url: "https://caferitual.pages.dev/",
    keywords: ["cafe", "cafeteria", "tostaduria", "cafe en grano", "cafe de especialidad", "restaurante", "restaurant", "bar", "panaderia", "pasteleria", "reposteria", "comida", "heladeria", "bistro", "pizzeria", "hamburguesas", "salteñas", "food truck", "coffee", "bakery", "food", "drinks"],
  },
  {
    name: "Salon Imperia",
    highlight: { es: "Maqueta 3D donde el cliente arma su evento", en: "3D model where clients plan their event" },
    category: { es: "Eventos", en: "Events" },
    url: "https://salonimperia.pages.dev/",
    keywords: ["eventos", "salon de eventos", "bodas", "boda", "fiestas", "quinceanero", "quince", "xv", "banquetes", "catering", "hotel", "convenciones", "centro de eventos", "discoteca", "decoracion", "events", "wedding", "venue", "party"],
  },
];

// Medido con Lighthouse (el motor de Google PageSpeed), perfil PC. perf = puntaje 0-100, lcp = segundos
// hasta ver el contenido principal. Se actualiza con el script de medición; si un proyecto no tiene datos, no se muestra nada.
const METRICS = {
  // Lighthouse 12, perfil PC, builds de producción (20 nov 2026). perf/a11y/seo: 0-100; lcp: segundos.
  altavista: { perf: 99, a11y: 100, seo: 100, lcp: 0.5 },
  bloque: { perf: 98, a11y: 100, seo: 100, lcp: 0.8 },
  "cafe-ritual": { perf: 96, a11y: 100, seo: 100, lcp: 1.1 }, // remedido 23 nov 2026 (rediseño)
  "terra-crema": { perf: 94, a11y: 100, seo: 100, lcp: 1.4 }, // remedido 23 nov 2026 (rediseño)
  "nova-run": { perf: 87, a11y: 96, seo: 100, lcp: 0.8 },
  "salon-imperia": { perf: 59, a11y: 96, seo: 100, lcp: 0.9 },
};

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/\s+/g, "-");

// Proyectos con el rubro en el idioma pedido ("es" o "en") y capturas resueltas.
export function getProjects(lang) {
  return projects.map((p, i) => {
    const s = slug(p.name);
    const shot = (v) => `/projects/shots/${s}-${v}.webp`;
    return {
      id: String(i + 1).padStart(2, "0"),
      slug: s,
      title: p.name,
      category: p.category[lang],
      image: `/projects/${s}.webp`,
      shots: { desktop: shot("desktop"), tablet: shot("tablet"), mobile: shot("mobile"), scroll: shot("scroll") },
      alt: `${p.name} · landing page ${p.category[lang]}`,
      demo: p.url,
      keywords: p.keywords.map(norm),
      highlight: p.highlight[lang],
      metrics: METRICS[s] || null,
    };
  });
}

// Texto sin tildes y en minúsculas, para comparar lo que escribe la persona con las palabras clave.
export const norm = (s) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/\s+/g, " ").trim();

// Qué demos encajan con lo que escribió la persona.
export function matchProjects(projects, query) {
  const q = norm(query);
  if (q.length < 3) return null;
  const hits = projects.filter((p) =>
    p.keywords.some((k) => k.startsWith(q) || k.includes(" " + q) || (k.length >= 4 && q.includes(k)) || norm(p.title).startsWith(q)),
  );
  return hits;
}
