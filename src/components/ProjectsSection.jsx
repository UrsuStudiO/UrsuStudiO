import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "../gsapSetup";
import { splitToChars } from "../utils/splitChars";
import { t } from "../i18n";
import { useFitText } from "../hooks/useFitText";
import { matchProjects } from "../data/projects";
import { useQuote } from "../context/QuoteContext";

const VIEWS = ["desktop", "tablet", "mobile"];

// Placeholder that types business examples one after another while the box is empty.
function useTypedExample(examples, active) {
  const [text, setText] = useState(examples[0]);
  useEffect(() => {
    if (!active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0, n = 0, dir = 1, timer;
    const step = () => {
      const word = examples[i];
      n += dir;
      setText(word.slice(0, n));
      let wait = dir > 0 ? 70 : 35;
      if (dir > 0 && n >= word.length) { dir = -1; wait = 1500; }
      else if (dir < 0 && n <= 0) { dir = 1; i = (i + 1) % examples.length; wait = 250; }
      timer = setTimeout(step, wait);
    };
    timer = setTimeout(step, 1200);
    return () => clearTimeout(timer);
  }, [examples, active]);
  return text;
}

// Real scores; performance only when it is a strong number, otherwise the measured load time.
function Metrics({ m }) {
  const fmt = (n) => n.toLocaleString(document.documentElement.lang === "en" ? "en" : "es");
  const items = [
    m.perf >= 85 ? [t.metrics.perf, m.perf] : [t.metrics.lcp(fmt(m.lcp)), null],
    [t.metrics.a11y, m.a11y],
    [t.metrics.seo, m.seo],
  ];
  return (
    <ul className="mx-chips" aria-label={t.metrics.note} title={t.metrics.note}>
      {items.map(([label, v]) => (
        <li key={label}>{v === null ? label : <>{label} <b>{v}</b></>}</li>
      ))}
    </ul>
  );
}

// One web shown on a laptop with its phone beside it; or on a tablet, or on a phone alone.
// On the laptop, hovering scrolls the screen through the whole page.
function DeviceCard({ p, ideal }) {
  const [view, setView] = useState("desktop");
  const ref = useRef(null);
  // Touch screens have no hover: the laptop screen scrolls by itself while the card is in view.
  useEffect(() => {
    if (!matchMedia("(hover: none)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("play", e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <article ref={ref} data-card className={`dv-card group ${ideal ? "dv-ideal" : ""}`}>
      <div className="dv-stage">
        {ideal && <span className="dv-badge">{t.ideal}</span>}
        <a href={p.demo} target="_blank" rel="noreferrer" aria-label={`${t.viewDemo}: ${p.title}`} className="dv-link" key={view}>
          {view === "desktop" && (
            <div className="dv-desk">
              <div className="dv-laptop">
                <div className="dv-screen"><img src={p.shots.scroll} alt={p.alt} loading="lazy" /></div>
                <div className="dv-base" aria-hidden="true" />
              </div>
              <div className="dv-phone dv-side" aria-hidden="true"><img src={p.shots.mobile} alt="" loading="lazy" /></div>
            </div>
          )}
          {view === "tablet" && <div className="dv-tablet"><img src={p.shots.tablet} alt={p.alt} loading="lazy" /></div>}
          {view === "mobile" && <div className="dv-phone dv-solo"><img src={p.shots.mobile} alt={p.alt} loading="lazy" /></div>}
        </a>
      </div>
      <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
        <div className="min-w-0">
          <h3 className="font-display font-medium text-lg leading-tight">
            <a href={p.demo} target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">{p.title} ↗</a>
          </h3>
          <span className="text-xs text-[var(--fg)]/55">{p.category}</span>
          {p.metrics && <Metrics m={p.metrics} />}
        </div>
        <div role="group" aria-label={`${t.views.label} (${p.title})`} className="dv-seg">
          {VIEWS.map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>{t.views[v]}</button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection({ projects }) {
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const [category, setCategory] = useState(t.all);
  const [query, setQuery] = useState("");
  const { openQuote } = useQuote();
  const firstFilter = useRef(true);
  useFitText(titleRef);
  const example = useTypedExample(t.search.examples, query === "");

  const categories = useMemo(() => [t.all, ...new Set(projects.map((p) => p.category))], [projects]);
  const hits = useMemo(() => matchProjects(projects, query), [projects, query]);
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (hits && hits.length) return hits;
    if (hits) return projects; // nothing matched: show everything as inspiration
    return category === t.all ? projects : projects.filter((p) => p.category === category);
  }, [hits, projects, category]);
  const idealIds = new Set(hits && hits.length ? hits.map((p) => p.id) : []);
  const listKey = filtered.map((p) => p.id).join();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = splitToChars(titleRef.current);
      gsap.set(chars, { yPercent: 130, rotateX: 70, transformOrigin: "50% 100%", opacity: 0 });
      gsap.to(chars, {
        yPercent: 0, rotateX: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "power4.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const cards = gridRef.current.querySelectorAll("[data-card]");
    if (firstFilter.current) {
      firstFilter.current = false;
      cards.forEach((card) => {
        gsap.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 90%" } });
      });
      return;
    }
    gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: "power3.out" });
  }, [listKey]);

  const names = hits && hits.length ? hits.map((p) => p.title) : [];
  const namesText = names.length > 1 ? names.slice(0, -1).join(", ") + t.search.and + names[names.length - 1] : names[0];

  return (
    <section id={t.ids.projects} className="px-3 md:px-6 py-16 md:py-24 border-t border-[var(--border)]">
      <h2 ref={titleRef} className="font-display font-semibold leading-[0.9] text-[var(--fg)] text-center uppercase mb-8 md:mb-10">
        {t.projectsTitle}
      </h2>

      <p className="w-full mt-6 md:mt-8 text-[var(--fg)]/70 leading-relaxed">{t.projectsIntro}</p>

      <div className="mt-12 md:mt-16">
        <label htmlFor="biz" className="block font-display font-semibold text-[clamp(1.8rem,5vw,4rem)] leading-[1] tracking-tight">
          {t.search.label}
        </label>
        <div className="sx-box mt-4">
          <span className="sx-icon" aria-hidden="true">⌕</span>
          <input
            id="biz"
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCategory(t.all); }}
            placeholder={example}
            autoComplete="off"
            enterKeyHint="search"
            className="sx-input"
          />
          {query && (
            <button type="button" className="sx-clear" onClick={() => setQuery("")} aria-label={t.search.clear}>×</button>
          )}
        </div>
        <div aria-live="polite" className="min-h-[1.5rem] mt-4">
          {hits && hits.length > 0 && <p className="sx-msg">{t.search.match(q, namesText)}</p>}
          {hits && hits.length === 0 && (
            <div className="sx-none">
              <p className="font-display text-xl md:text-2xl leading-snug">{t.search.noneTitle(q)}</p>
              <button type="button" className="sx-cta" onClick={() => openQuote("", t.search.noneMsg(q))}>{t.search.noneCta} →</button>
              <p className="text-sm text-[var(--fg)]/60 mt-5">{t.search.meanwhile}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 border-b border-[var(--border)] pb-6">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--fg)]/50 mr-2">{t.search.filters}</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => { setCategory(c); setQuery(""); }}
            className={`text-sm md:text-base font-display transition-opacity cursor-pointer ${
              category === c && !hits ? "opacity-100 border-b border-[var(--fg)]" : "opacity-45 hover:opacity-80"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="text-xs text-[var(--fg)]/50 mt-6">{t.metrics.note}</p>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-8 md:gap-y-14 mt-12 md:mt-14">
        {filtered.map((p) => <DeviceCard key={p.id} p={p} ideal={idealIds.has(p.id)} />)}
      </div>
    </section>
  );
}
