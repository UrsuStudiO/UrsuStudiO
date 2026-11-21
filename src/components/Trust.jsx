import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { LANG, t } from "../i18n";
import { STUDIO, waLink } from "../data/studio";

// Why a business can trust the studio: the process, the guarantees and the person behind it.
// The founder block and the WhatsApp button only appear once STUDIO (data/studio.js) is filled in.
export default function Trust() {
  const ref = useRef(null);
  const wa = waLink(LANG);
  const f = STUDIO.founder;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-step]", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: "[data-steps]", start: "top 80%" },
      });
      gsap.fromTo("[data-line]", { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: "[data-steps]", start: "top 75%", end: "bottom 55%", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="px-3 md:px-6 py-16 md:py-24 border-t border-[var(--border)]">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">{t.trust.kicker}</p>
      <h2 className="font-display font-semibold text-[clamp(2.2rem,6vw,5.5rem)] leading-[0.95] tracking-tight mt-3 max-w-[18ch]">{t.trust.title}</h2>

      <div data-steps className="relative mt-12 md:mt-16">
        <div className="hidden md:block absolute left-0 right-0 top-[1.15rem] h-px bg-[var(--border)]" aria-hidden="true">
          <div data-line className="h-full bg-[var(--accent)] origin-left" />
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 list-none p-0 m-0">
          {t.trust.steps.map((s, i) => (
            <li key={s.t} data-step className="relative">
              <span className="relative z-10 inline-grid place-items-center w-9 h-9 rounded-full bg-[var(--bg)] border border-[var(--accent)] text-[var(--accent)] font-display font-semibold text-sm">{i + 1}</span>
              <h3 className="font-display font-semibold text-xl md:text-2xl mt-4">{s.t}</h3>
              <p className="text-[var(--fg)]/70 leading-relaxed mt-2">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={`grid gap-6 md:gap-10 mt-14 md:mt-20 ${f.name ? "md:grid-cols-[1.3fr_1fr]" : ""}`}>
        <div className="border border-[var(--border)] p-6 md:p-8">
          <h3 className="font-display font-semibold text-xl md:text-2xl">{t.trust.promisesTitle}</h3>
          <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3 list-none p-0">
            {t.trust.promises.map((p) => (
              <li key={p} className="flex gap-3 leading-snug"><span className="text-[var(--accent)] font-bold" aria-hidden="true">✓</span>{p}</li>
            ))}
          </ul>
          {wa && (
            <a href={wa} target="_blank" rel="noreferrer" className="wa-btn mt-7">
              <WaIcon />{t.trust.whatsapp}
            </a>
          )}
        </div>
        {f.name && (
          <figure className="border border-[var(--border)] p-6 md:p-8 m-0 flex gap-5 items-start">
            {f.photo && <img src={f.photo} alt={f.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shrink-0" loading="lazy" />}
            <div>
              <blockquote className="m-0 font-display text-lg md:text-xl leading-snug">“{f.quote[LANG]}”</blockquote>
              <figcaption className="mt-4 text-sm"><b>{f.name}</b><span className="text-[var(--fg)]/60"> · {f.role[LANG]}</span></figcaption>
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}

export function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

// Floating WhatsApp button, bottom right, on every screen size.
export function WaFloat() {
  const wa = waLink(LANG);
  if (!wa) return null;
  return (
    <a href={wa} target="_blank" rel="noreferrer" className="wa-float" aria-label={t.trust.whatsapp}>
      <WaIcon />
    </a>
  );
}
