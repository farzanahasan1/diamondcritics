"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";

// ── Setup: go to formspree.io → New Form → copy the ID here ──────────────
const FORMSPREE_ID = "mbdendep";
// ─────────────────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 2rem",
};

const subjects = [
  "Purchase Review — Evaluate a specific stone",
  "GIA Report Audit — Analyse a grading report",
  "Lab-Grown vs Natural — Get a comparison",
  "Retailer Question — Is this a good deal?",
  "Media / Press Inquiry",
  "General Question",
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const input: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #e0e0e0",
    background: "#fff",
    fontFamily: "var(--body)",
    fontSize: "0.9rem",
    color: "#111",
    outline: "none",
    transition: "border-color 0.2s",
    borderRadius: 0,
    appearance: "none",
  };

  return (
    <>
      <div style={{ fontFamily: "var(--body)" }}>

        {/* ── Dark hero ── */}
        <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
          <div style={wrap}>
            <nav style={{ display: "flex", gap: "8px", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "2rem", alignItems: "center" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link>
              <span>/</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Contact</span>
            </nav>

            <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
              Direct Inquiry
            </p>
            <h1 style={{
              fontFamily: "var(--heading)", fontWeight: 300, color: "#fff",
              fontSize: "clamp(2.2rem, 5vw, 3.75rem)", lineHeight: 1.08,
              letterSpacing: "-0.025em", maxWidth: "700px", marginBottom: "1.25rem",
            }}>
              Speak with Farzana Hasan.
            </h1>
            <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: "520px", lineHeight: 1.75 }}>
              Independent, GIA-backed analysis. Whether you&apos;re vetting a purchase or need a full technical audit, get the clarity you need before you spend.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ background: "#fff", padding: "5rem 0 6rem" }}>
          <div style={wrap}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "5rem", alignItems: "start" }} className="contact-grid">

              {/* Left — what you get */}
              <div>
                <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.5rem" }}>
                  What to Expect
                </p>

                {[
                  { title: "Purchase Review", desc: "Send the diamond details or Blue Nile / James Allen link. Get a straight answer on whether it's worth the price." },
                  { title: "GIA Report Audit", desc: "Upload the report number. Farzana evaluates cut proportions, fluorescence risk, and eye-clean probability." },
                  { title: "Lab vs Natural", desc: "Not sure which is right for your budget? Get a side-by-side technical comparison tailored to your specs." },
                ].map((item) => (
                  <div key={item.title} style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #f0f0f0" }}>
                    <h3 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontSize: "1.15rem", color: "#111", marginBottom: "0.5rem" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "0.88rem", color: "#777", lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                ))}

                <div style={{ background: "var(--cream)", padding: "1.5rem" }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.5rem" }}>
                    Response Time
                  </p>
                  <p style={{ fontFamily: "var(--heading)", fontWeight: 300, fontSize: "1.1rem", color: "#111", marginBottom: "0.25rem" }}>
                    Within 48 hours
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#999", lineHeight: 1.6 }}>
                    Monday – Friday. Technical queries may take longer if a full proportion analysis is required.
                  </p>
                </div>
              </div>

              {/* Right — form */}
              <div>
                {status === "sent" ? (
                  <div style={{ padding: "3rem", border: "1px solid #f0f0f0", textAlign: "center" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>Message Received</p>
                    <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontSize: "1.75rem", color: "#111", marginBottom: "1rem" }}>
                      Thank you.
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "#777", lineHeight: 1.7, marginBottom: "2rem" }}>
                      Farzana will review your inquiry and respond within 48 hours.
                    </p>
                    <button onClick={() => setStatus("idle")}
                      style={{ background: "#141414", color: "#fff", border: "none", padding: "13px 32px", fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
                      Send Another →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "6px" }}>
                          Name *
                        </label>
                        <input name="name" type="text" required placeholder="Your name" style={input} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "6px" }}>
                          Email *
                        </label>
                        <input name="email" type="email" required placeholder="your@email.com" style={input} />
                      </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "6px" }}>
                        Subject *
                      </label>
                      <select name="subject" required style={{ ...input, background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E") no-repeat right 16px center / 12px`, paddingRight: "40px" }}>
                        <option value="">Select a topic…</option>
                        {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "6px" }}>
                        Message *
                      </label>
                      <textarea name="message" required rows={6} placeholder="Include diamond specs, carat weight, certificate number, or any specific questions…"
                        style={{ ...input, resize: "vertical", lineHeight: 1.65 }} />
                    </div>

                    {status === "error" && (
                      <p style={{ fontSize: "0.82rem", color: "#c0392b", marginBottom: "1rem" }}>
                        Something went wrong. Please email directly at farzana@diamondcritics.com
                      </p>
                    )}

                    <button type="submit" disabled={status === "sending"}
                      style={{
                        width: "100%", background: status === "sending" ? "#888" : "#141414",
                        color: "#fff", border: "none", padding: "16px",
                        fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600,
                        letterSpacing: "0.16em", textTransform: "uppercase", cursor: status === "sending" ? "default" : "pointer",
                        transition: "background 0.2s",
                      }}>
                      {status === "sending" ? "Sending…" : "Send Inquiry →"}
                    </button>

                    <p style={{ fontSize: "0.72rem", color: "#bbb", textAlign: "center", marginTop: "1rem" }}>
                      No spam, no sharing. Replies from Farzana directly.
                    </p>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}
