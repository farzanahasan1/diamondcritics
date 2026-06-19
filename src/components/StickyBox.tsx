"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function StickyBox({ children, top = 96 }: { children: ReactNode; top?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"natural" | "fixed" | "pinned">("natural");
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

      // Boundary = the article-grid container (grandparent: aside → grid)
      const grid = el!.parentElement?.parentElement;
      const gridBottom = grid
        ? grid.getBoundingClientRect().bottom + scrollY
        : Infinity;

      const pastStart   = scrollY + top >= pageY;
      const hitBottom   = scrollY + top + height >= gridBottom - 24; // 24px breathing room

      if (!pastStart) {
        setMode("natural");
      } else if (hitBottom) {
        setMode("pinned"); // stays at bottom of article, scrolls away naturally
      } else {
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

  // "pinned" = absolutely positioned at the bottom of the grid so it
  // sits flush with the article end and scrolls away with the page.
  const innerStyle: React.CSSProperties =
    mode === "fixed"
      ? { position: "fixed", top, left, width }
      : mode === "pinned"
      ? { position: "absolute", bottom: 0, left: 0, width: "100%" }
      : {};

  return (
    // Use position:relative so "pinned" absolute child anchors correctly
    <div ref={ref}
      style={{
        height: mode === "fixed" ? height : undefined,
        position: "relative",
        // Make the wrapper fill the aside (= full grid row height)
        alignSelf: "stretch",
      }}
    >
      <div style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
