"use client";
import { useEffect, useRef, type ReactNode } from "react";

export default function StickyBox({ children, topOffset = 96 }: { children: ReactNode; topOffset?: number }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    const outer = inner?.parentElement; // the <aside> grid item
    if (!inner || !outer) return;

    function update() {
      if (!inner || !outer) return;
      const outerRect = outer.getBoundingClientRect();
      const innerH = inner.offsetHeight;
      if (outerRect.top < topOffset) {
        const max = Math.max(0, outerRect.height - innerH);
        const y = Math.min(Math.max(0, topOffset - outerRect.top), max);
        inner.style.transform = `translateY(${y}px)`;
      } else {
        inner.style.transform = "translateY(0)";
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [topOffset]);

  return <div ref={innerRef}>{children}</div>;
}
