"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function StickyBox({ children, top = 96 }: { children: ReactNode; top?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"natural" | "fixed" | "pinned">("natural");
  const [fixedTop, setFixedTop] = useState(top);
  const nat = useRef({ pageY: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function snap() {
      const r = el!.getBoundingClientRect();
      nat.current = {
        pageY: r.top + window.scrollY,
        left: r.left,
        width: r.width,
        height: r.height,
      };
    }

    function tick() {
      if (!nat.current.width) return;
      const { pageY, height } = nat.current;
      const scrollY = window.scrollY;

      // Article grid = grandparent of this wrapper (wrapper → aside → .article-grid)
      const grid = el!.parentElement?.parentElement;
      // gridBottom in VIEWPORT coordinates (changes as user scrolls)
      const gridBottomVP = grid ? grid.getBoundingClientRect().bottom : Infinity;

      const pastStart = scrollY + top >= pageY;
      // Sidebar bottom (at normal fixed position) would hit the article bottom
      const hitBottom = top + height >= gridBottomVP - 24;

      if (!pastStart) {
        setMode("natural");
        setFixedTop(top);
      } else if (hitBottom) {
        // Track the article bottom: top = articleBottom - sidebarHeight - breathing room
        // As the user scrolls past the article, gridBottomVP shrinks → fixedTop decreases
        // → sidebar slides upward off the viewport (scrolls away with the article)
        setFixedTop(gridBottomVP - height - 24);
        setMode("pinned");
      } else {
        setFixedTop(top);
        setMode("fixed");
      }
    }

    function onResize() {
      setMode("natural");
      requestAnimationFrame(snap);
    }

    requestAnimationFrame(snap);
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", onResize);
    };
  }, [top]);

  const { left, width, height } = nat.current;

  return (
    <div
      ref={ref}
      style={{
        // Placeholder height keeps the aside column from collapsing when fixed
        height: mode !== "natural" ? height : undefined,
        position: "relative",
        alignSelf: "stretch",
      }}
    >
      <div
        style={
          mode !== "natural"
            ? { position: "fixed", top: fixedTop, left, width }
            : {}
        }
      >
        {children}
      </div>
    </div>
  );
}
