"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function StickyBox({ children, top = 96 }: { children: ReactNode; top?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
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
      setIsFixed(window.scrollY + top >= nat.current.pageY);
    }

    function onResize() {
      setIsFixed(false);
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
    <div ref={ref} style={{ height: isFixed ? height : undefined }}>
      <div style={isFixed ? { position: "fixed", top, left, width } : undefined}>
        {children}
      </div>
    </div>
  );
}
