"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface PostSearchItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

const catLabel: Record<string, string> = {
  "diamond-buying-guides": "Guide",
  "diamond-retailer-reviews": "Review",
  "gemstone-guides": "Gemstone",
  "market-value-price-trends": "Market",
};

export default function SearchModal({ posts }: { posts: PostSearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.toLowerCase().trim();
  const results = q.length < 2 ? [] : posts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    (catLabel[p.category] ?? "").toLowerCase().includes(q)
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Search trigger button — fixed bottom-right */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search diamond guides"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "48px",
          height: "48px",
          background: "#141414",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9990,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9991, backdropFilter: "blur(3px)" }}
          />

          {/* Panel */}
          <div style={{
            position: "fixed",
            top: "8vh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(660px, 94vw)",
            background: "#fff",
            zIndex: 9992,
            boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "82vh",
          }}>

            {/* Input row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1.25rem", borderBottom: "1px solid #ebebeb", flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search diamond guides…"
                style={{
                  flex: 1,
                  padding: "1.15rem 0",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--body)",
                  fontSize: "1rem",
                  color: "#111",
                  background: "transparent",
                }}
              />
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "1px solid #eee", cursor: "pointer", padding: "3px 8px", color: "#aaa", fontFamily: "var(--body)", fontSize: "0.7rem", letterSpacing: "0.05em", flexShrink: 0 }}
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {q.length < 2 ? (
                <div style={{ padding: "2rem 1.25rem" }}>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.82rem", color: "#bbb", marginBottom: "1.25rem" }}>
                    Type to search all diamond guides
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {["clarity", "color", "marquise", "blue nile", "lab grown", "vs2"].map(hint => (
                      <button
                        key={hint}
                        onClick={() => setQuery(hint)}
                        style={{ background: "#f5f5f5", border: "none", padding: "5px 12px", fontFamily: "var(--body)", fontSize: "0.78rem", color: "#555", cursor: "pointer" }}
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p style={{ padding: "2rem 1.25rem", fontFamily: "var(--body)", fontSize: "0.85rem", color: "#aaa" }}>
                  No guides found for <strong style={{ color: "#111" }}>"{query}"</strong>
                </p>
              ) : (
                results.map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "block",
                      padding: "1rem 1.25rem",
                      borderBottom: i < results.length - 1 ? "1px solid #f5f5f5" : "none",
                      textDecoration: "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={e => (e.currentTarget.style.background = "")}
                  >
                    <span style={{ fontFamily: "var(--body)", fontSize: "0.63rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)" }}>
                      {catLabel[p.category] ?? p.category}
                    </span>
                    <p style={{ fontFamily: "var(--heading)", fontSize: "1rem", fontWeight: 300, color: "#111", lineHeight: 1.3, margin: "4px 0" }}>
                      {p.title}
                    </p>
                    <p style={{
                      fontFamily: "var(--body)", fontSize: "0.8rem", color: "#999", lineHeight: 1.55,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                    }}>
                      {p.excerpt}
                    </p>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "0.65rem 1.25rem", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--body)", fontSize: "0.7rem", color: "#ccc" }}>
                {q.length >= 2 ? `${results.length} result${results.length !== 1 ? "s" : ""}` : `${posts.length} guides indexed`}
              </span>
              <span style={{ fontFamily: "var(--body)", fontSize: "0.7rem", color: "#ccc" }}>⌘K · ESC</span>
            </div>

          </div>
        </>
      )}
    </>
  );
}
