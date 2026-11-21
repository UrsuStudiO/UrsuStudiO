# UrsuStudiO

Sitio web de UrsuStudiO, estudio de diseño de páginas web y landing pages en Bolivia.

En la web se presenta el estudio y su forma de trabajar, y se muestran sus proyectos funcionando en vivo. Está disponible en español (`/`) y en inglés (`/en/`), con modo claro y oscuro.

## Qué incluye

- **Portada** con dos proyectos destacados en laptop y celular.
- **Galería** de proyectos en distintos formatos: PC, tablet y celular.
- **Nosotros**: quiénes somos y qué ofrecemos.
- **Proyectos** con el buscador "¿Qué negocio tienes?": la persona escribe su rubro y la web le recomienda el proyecto más parecido. Si todavía no hay uno de su rubro, la invita a cotizar el suyo. Cada proyecto se puede ver en PC, tablet o celular.
- **Cómo trabajamos**: el proceso paso a paso y lo que garantizamos.
- **Paquetes**, **preguntas frecuentes** y **contacto**, con un formulario de cotización.

## Cómo verlo en tu computadora

```bash
npm install
npm run dev
```

Para generar la versión final:

```bash
npm run build
```

## Dónde se edita cada cosa

| Qué | Dónde |
|---|---|
| Proyectos del portafolio (nombre, rubro, enlace y palabras para el buscador) | `src/data/projects.js` |
| WhatsApp, nombre y foto de la persona del estudio | `src/data/studio.js` |
| Textos de la web en español e inglés | `src/i18n.js` |
| Capturas de cada proyecto | `public/projects/shots/` |

### Agregar un proyecto nuevo

1. Agrega el proyecto en `src/data/projects.js`.
2. Guarda sus capturas en `public/projects/shots/` con el nombre del proyecto en minúsculas y con guiones. Por ejemplo, para "Nova Run":
   - `nova-run-desktop.webp`: portada en PC
   - `nova-run-tablet.webp`: portada en tablet
   - `nova-run-mobile.webp`: portada en celular
   - `nova-run-scroll.webp`: página completa, para el recorrido de la laptop

Los datos que queden vacíos en `src/data/studio.js` no se muestran en la web.
