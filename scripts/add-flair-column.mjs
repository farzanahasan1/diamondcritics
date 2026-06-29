// Adds flair TEXT column to posts table via Supabase pg-meta API
const PROJECT_REF = "jfknkkemecwvohxaeqpl";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma25ra2VtZWN3dm9oeGFlcXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM1NjM2MCwiZXhwIjoyMDk3OTMyMzYwfQ.sUUeQOnOwejSFKF-6hfVZOOtdS_yrHAfztwjkDB0FZI";

const res = await fetch(
  `https://${PROJECT_REF}.supabase.co/pg-meta/v1/query`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      query: "ALTER TABLE posts ADD COLUMN IF NOT EXISTS flair TEXT;",
    }),
  }
);

const json = await res.json();

if (!res.ok) {
  console.error("❌ Migration failed:", JSON.stringify(json, null, 2));
  console.log("\nRun this manually in the Supabase Dashboard SQL editor:");
  console.log("  ALTER TABLE posts ADD COLUMN IF NOT EXISTS flair TEXT;");
  process.exit(1);
}

console.log("✅ flair column added to posts table.");
