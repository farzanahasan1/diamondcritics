"use client";
import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string };

export default function TocWidget({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <div style={{ border: "1px solid #f0f0f0", padding: "1.5rem", marginBottom: "1.5rem" }}>
      <p style={{
        fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em",
        textTransform: "uppercase", color: "#aaa", marginBottom: "1rem",
      }}>
        In This Article
      </p>
      <nav style={{ maxHeight: "300px", overflowY: "auto" }}>
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                display: "block",
                fontFamily: "var(--body)",
                fontSize: "0.8rem",
                lineHeight: 1.45,
                color: isActive ? "#111" : "#888",
                fontWeight: isActive ? 500 : 400,
                borderLeft: `2px solid ${isActive ? "var(--gold)" : "#f0f0f0"}`,
                paddingLeft: "10px",
                paddingTop: "6px",
                paddingBottom: "6px",
                textDecoration: "none",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
