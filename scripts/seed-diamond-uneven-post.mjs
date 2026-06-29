import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

const URL  = "https://jfknkkemecwvohxaeqpl.supabase.co";
const KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma25ra2VtZWN3dm9oeGFlcXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM1NjM2MCwiZXhwIjoyMDk3OTMyMzYwfQ.sUUeQOnOwejSFKF-6hfVZOOtdS_yrHAfztwjkDB0FZI";
const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

// ── 1. Upload image to Supabase Storage ──────────────────────────────────────
const imageBuffer = readFileSync("/tmp/diamond-uneven.jpeg");
const storagePath = `seeded/${randomUUID()}.jpeg`;

const { data: uploadData, error: uploadError } = await supabase.storage
  .from("community-images")
  .upload(storagePath, imageBuffer, { contentType: "image/jpeg", upsert: false });

if (uploadError) {
  console.error("❌ Image upload failed:", uploadError.message);
  process.exit(1);
}

const { data: { publicUrl } } = supabase.storage
  .from("community-images")
  .getPublicUrl(uploadData.path);

console.log("✅ Image uploaded:", publicUrl);

// ── 2. Fetch community + user ────────────────────────────────────────────────
const { data: community } = await supabase
  .from("communities")
  .select("id")
  .limit(1)
  .single();

if (!community) { console.error("❌ No community found"); process.exit(1); }

// Use EmmaWatts_UK — fits the story (just got engaged, UK user)
const { data: author } = await supabase
  .from("profiles")
  .select("id")
  .eq("username", "EmmaWatts_UK")
  .maybeSingle();

if (!author) { console.error("❌ User EmmaWatts_UK not found"); process.exit(1); }

// ── 3. Insert post ───────────────────────────────────────────────────────────
const postId = randomUUID();

const { error: postError } = await supabase.from("posts").insert({
  id: postId,
  community_id: community.id,
  author_id: author.id,
  title: "Is my diamond set uneven? It overhangs on one side and won't sit flush 😟",
  body: `I recently got engaged and while I absolutely adore my ring, something has been bothering me.

Looking closely, the diamond seems to overhang more on the right side than the left — and when I tilt it at certain angles, it doesn't sit 100% flush against the gallery rail.

I don't know if I'm being completely insane or if this is just normal human error in the setting process. More importantly — could this affect the integrity of the ring or the security of the stone long-term?

I cross-posted this in r/Diamonds too but wanted to get opinions here as well since you all seem really knowledgeable. Any insight would be so helpful! 🙏`,
  type: "image",
  image_url: publicUrl,
  // flair: "engaged",  -- add after running the SQL migration
  score: 1,
  upvotes: 1,
  downvotes: 0,
  comment_count: 0,
  is_deleted: false,
  is_draft: false,
  is_pinned: false,
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
});

if (postError) {
  console.error("❌ Post insert failed:", postError.message);
  process.exit(1);
}

// Auto-upvote own post
await supabase.from("post_votes").insert({
  post_id: postId,
  user_id: author.id,
  vote: 1,
});

console.log("✅ Post created:", postId);

// ── 4. Seed 3 helpful comments ───────────────────────────────────────────────
const commenters = await supabase
  .from("profiles")
  .select("id, username")
  .in("username", ["Jake_Anderson_DC", "Daniel_Foster", "Marcus_Webb"]);

const users = Object.fromEntries((commenters.data ?? []).map(u => [u.username, u.id]));

const comments = [
  {
    id: randomUUID(),
    author_id: users["Jake_Anderson_DC"],
    body: `You're not being insane at all — this is a legitimate concern. A slightly off-centre setting is actually more common than most people realise, especially with prong settings where the stone is hand-pressed into place.\n\nThat said, there's a difference between "slightly off" and "insecurely set." The test: does the stone move at all if you gently push it side to side with your fingernail? If yes, take it back immediately. If it's rock solid, the overhang is purely cosmetic.\n\nI'd still take it to a jeweller for a free check — most will look at it in 5 minutes at no charge.`,
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: randomUUID(),
    author_id: users["Daniel_Foster"],
    body: `Completely normal to notice this — you just got engaged so you're staring at it under a microscope 😄\n\nSeriously though, minor asymmetry in prong placement is very common with hand-set stones. As long as all prongs are making solid contact with the girdle and the stone has zero wobble, you're fine.\n\nThe "flush to the gallery rail" thing is worth checking. If the stone is sitting slightly high on one side it could mean one of the seat cuts is slightly shallow — not a structural risk but worth mentioning to your jeweller so they can adjust the bearing if needed.`,
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
  {
    id: randomUUID(),
    author_id: users["Marcus_Webb"],
    body: `Seen this exact thing on my partner's ring. We took it to an independent jeweller (not the original seller) and they confirmed the stone was set slightly off-axis — about 0.3mm. Completely secure, no risk, just aesthetics.\n\nThey re-seated it for £45 and it's been perfect ever since. If it's bothering you, that's genuinely the route I'd take rather than going back to the original jeweller who may downplay it.`,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

const { error: commentError } = await supabase.from("comments").insert(
  comments.map(c => ({
    ...c,
    post_id: postId,
    parent_id: null,
    score: 1,
    is_deleted: false,
  }))
);

if (commentError) {
  console.error("❌ Comments failed:", commentError.message);
} else {
  console.log("✅ 3 comments added");
}

// Update comment_count
await supabase.from("posts").update({ comment_count: 3 }).eq("id", postId);

// Add upvotes to comments
const commentVotes = comments.map(c => ({
  comment_id: c.id,
  user_id: author.id,
  vote: 1,
}));
await supabase.from("comment_votes").insert(commentVotes);

console.log(`\n🎉 Done! Post live at: /community/post/${postId}`);
