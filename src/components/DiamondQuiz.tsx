"use client";
import { useState } from "react";

interface QuizDiamond {
  id: string;
  image: string;
  imageAvif: string;
  alt: string;
  link: string;
  type: "natural" | "lab";
  price: string;
}

interface DiamondQuizProps {
  diamonds?: QuizDiamond[];
  specs?: string;
  naturalPrice?: string;
  labPrice?: string;
}

const DEFAULT_DIAMONDS: QuizDiamond[] = [
  {
    id: "a",
    image: "/images/1.51-ct-d-color-vvs1-clarity-excellent-cut-lab-diamond.png",
    imageAvif: "/images/1.51-ct-d-color-vvs1-clarity-excellent-cut-lab-diamond.avif",
    alt: "1.51 ct D color VVS1 clarity Excellent cut diamond — Diamond A",
    link: "https://www.bluenile.com/diamond-details/26648713?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational",
    type: "lab",
    price: "$1,970",
  },
  {
    id: "b",
    image: "/images/1.51-ct-d-color-vvs1-clarity-excellent-cut-natural-diamond.png",
    imageAvif: "/images/1.51-ct-d-color-vvs1-clarity-excellent-cut-natural-diamond.avif",
    alt: "1.51 ct D color VVS1 clarity Excellent cut diamond — Diamond B",
    link: "https://www.bluenile.com/diamond-details/28847414?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational",
    type: "natural",
    price: "$16,240",
  },
];

export default function DiamondQuiz({
  diamonds = DEFAULT_DIAMONDS,
  specs = "GIA Certified · 1.51ct · D Color · VVS1 · Ideal Cut",
}: DiamondQuizProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const revealed = picked !== null;
  const pickedDiamond = diamonds.find((d) => d.id === picked);

  return (
    <div style={{
      background: "#141414",
      borderRadius: "4px",
      padding: "clamp(1.5rem, 4vw, 3rem)",
      margin: "3rem 0",
      textAlign: "center",
      fontFamily: "var(--body)",
      width: "100%",
      overflowX: "hidden",
    }}>
      {/* Header */}
      <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>
        Diamond IQ Test
      </p>
      <h3 style={{ fontFamily: "var(--heading)", fontWeight: 300, color: "#fff", fontSize: "clamp(1.4rem, 3vw, 2rem)", lineHeight: 1.15, marginBottom: "0.5rem" }}>
        Natural or Lab-Grown?
      </h3>
      <p style={{ fontFamily: "var(--body)", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
        {specs}
      </p>

      {/* Diamond options */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(1rem, 5vw, 3.5rem)", flexWrap: "wrap", marginBottom: "2rem" }}>
        {diamonds.map((d) => {
          const isSelected = picked === d.id;
          const isCorrect = isSelected && revealed;
          return (
            <div key={d.id} style={{ flex: "0 0 auto", maxWidth: "220px", textAlign: "center" }}>
              <div style={{
                width: "clamp(140px, 30vw, 200px)",
                height: "clamp(140px, 30vw, 200px)",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 1rem",
                border: revealed
                  ? d.type === "natural" ? "3px solid var(--gold)" : "3px solid #00d4d4"
                  : isSelected ? "3px solid #fff" : "3px solid transparent",
                transition: "border-color 0.3s",
                cursor: revealed ? "default" : "pointer",
              }}
                onClick={() => !revealed && setPicked(d.id)}
              >
                <picture>
                  <source srcSet={d.imageAvif} type="image/avif" />
                  <img src={d.image} alt={d.alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </picture>
              </div>

              {/* Before reveal: just a button */}
              {!revealed ? (
                <button onClick={() => setPicked(d.id)}
                  style={{
                    background: "#fff", color: "#111", border: "none", borderRadius: "100px",
                    fontFamily: "var(--body)", fontSize: "0.82rem", fontWeight: 700,
                    padding: "10px 28px", cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "orange"; (e.target as HTMLButtonElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "#fff"; (e.target as HTMLButtonElement).style.color = "#111"; }}
                >
                  Select
                </button>
              ) : (
                /* After reveal: show type + price */
                <div>
                  <p style={{
                    fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: d.type === "natural" ? "var(--gold)" : "#00d4d4",
                    marginBottom: "4px",
                  }}>
                    {d.type === "natural" ? "Natural Diamond" : "Lab-Grown Diamond"}
                  </p>
                  <p style={{ fontFamily: "var(--heading)", fontSize: "1.5rem", fontWeight: 300, color: "#fff" }}>
                    {d.price}
                  </p>
                  <a href={d.link} target="_blank" rel="noopener noreferrer nofollow"
                    style={{ display: "inline-block", marginTop: "8px", fontFamily: "var(--body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.2)" }}>
                    View on Blue Nile →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Description / reveal message */}
      {!revealed ? (
        <p style={{ fontFamily: "var(--body)", fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto" }}>
          Two identical diamonds: both GIA Certified, 1.51ct, D Color, VVS1, Ideal Cut. One is{" "}
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>natural ($16,240)</span>, the other is{" "}
          <span style={{ color: "#00d4d4", fontWeight: 600 }}>lab-grown ($1,970)</span>.
          {" "}Pick the one you prefer — then see which is which.
        </p>
      ) : (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--heading)", fontWeight: 300,
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "#fff", lineHeight: 1.4, marginBottom: "0.75rem",
          }}>
            {pickedDiamond?.type === "natural"
              ? "You picked the Natural Diamond."
              : "You picked the Lab-Grown Diamond."}
          </p>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            {pickedDiamond?.type === "natural"
              ? "A classic investment-grade stone — but at $16,240, you're paying a significant premium over its lab-grown twin. Both are visually identical to the naked eye."
              : "Smart pick. The lab-grown is $14,270 cheaper for an optically identical stone. Perfect for maximum size and quality per dollar."}
          </p>
          <button onClick={() => setPicked(null)}
            style={{ marginTop: "1.5rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 20px", cursor: "pointer", borderRadius: "100px" }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
