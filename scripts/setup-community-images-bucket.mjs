import { createClient } from "@supabase/supabase-js";

const URL  = "https://jfknkkemecwvohxaeqpl.supabase.co";
const KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma25ra2VtZWN3dm9oeGFlcXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM1NjM2MCwiZXhwIjoyMDk3OTMyMzYwfQ.sUUeQOnOwejSFKF-6hfVZOOtdS_yrHAfztwjkDB0FZI";

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

// Check if bucket already exists
const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) {
  console.error("❌ Could not list buckets:", listError.message);
  process.exit(1);
}

const exists = buckets?.find(b => b.name === "community-images");
if (exists) {
  console.log("ℹ️  Bucket 'community-images' already exists — nothing to do.");
  process.exit(0);
}

const { error } = await supabase.storage.createBucket("community-images", {
  public: true,
  fileSizeLimit: 1048576, // 1 MB
  allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
});

if (error) {
  console.error("❌ Failed to create bucket:", error.message);
  process.exit(1);
}

console.log("✅ Bucket 'community-images' created (public, 1MB limit, JPEG/PNG/WEBP/GIF only).");
