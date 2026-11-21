import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../gsapSetup";

// Decorative gallery: phones, tablets and desktops mixed, and no image is ever shown twice.
// Each column holds three different webs; a web that appears twice does so in another format.
const FORMATS = ["mobile", "desktop", "tablet"];

function buildColumns(projects) {
  const order = [...projects].sort(() => Math.random() - 0.5);
  const n = order.length;
  return [0, 1, 2].map((c) =>
    [0, 1, 2].map((r) => ({ p: order[(c * 2 + r) % n], format: FORMATS[(c + r) % 3] })),
  );
}

function Tile({ p, format }) {
  if (format === "desktop")
    return (
      <div className="gx-desk">
        <div className="gx-bar" aria-hidden="true"><i /><i /><i /></div>
        <img src={p.shots.desktop} alt="" loading="lazy" />
      </div>
    );
  return (
    <div className={format === "mobile" ? "gx-phone" : "gx-tablet"}>
      <img src={p.shots[format]} alt="" loading="lazy" />
    </div>
  );
}

export default function ProjectsParallax({ projects }) {
  const sectionRef = useRef(null);
  const colRefs = useRef([]);
  const cols = useMemo(() => (projects?.length ? buildColumns(projects) : []), [projects]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const directions = [-1, 0.5, -1];
      colRefs.current.forEach((col, i) => {
        if (!col) return;
        gsap.to(col, {
          yPercent: 12 * directions[i],
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="relative z-10 bg-[var(--bg-soft)] shadow-[0_0_40px_rgba(0,0,0,0.16)] px-3 md:px-6 py-20 md:py-28 min-h-[100svh] flex items-center overflow-hidden"
    >
      <div className="grid grid-cols-3 gap-3 md:gap-8 w-full items-start">
        {cols.map((col, i) => (
          <div key={i} ref={(el) => (colRefs.current[i] = el)} className={`flex flex-col gap-4 md:gap-10 ${i === 1 ? "mt-16 md:mt-32" : ""}`}>
            {col.map((tile, j) => (
              <div key={`${tile.p.id}-${tile.format}`} className={`gx-tile gx-w-${tile.format}${(i + j) % 2 ? "gx-right" : "gx-left"}`}>
                <Tile {...tile} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
