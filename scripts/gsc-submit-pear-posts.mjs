import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyFile = "/Users/mehedihasan/Projects/diamondcritics-8df8059f6989.json";

const pearUrls = [
  "https://diamondcritics.com/oval-vs-pear-diamond",
  "https://diamondcritics.com/pear-cut-diamond",
  "https://diamondcritics.com/pear-diamond-bezel-ring",
  "https://diamondcritics.com/pear-diamond-engagement-ring",
  "https://diamondcritics.com/pear-diamond-halo-ring",
  "https://diamondcritics.com/pear-shaped-diamond-ring",
  "https://diamondcritics.com/pear-shaped-solitaire-diamond-ring",
  "https://diamondcritics.com/princess-cut-vs-pear-diamond",
  "https://diamondcritics.com/rose-gold-pear-diamond-ring",
  "https://diamondcritics.com/round-diamond-vs-pear-shape",
  "https://diamondcritics.com/three-stone-pear-diamond-ring",
  "https://diamondcritics.com/white-gold-pear-diamond-ring",
  "https://diamondcritics.com/yellow-gold-pear-diamond-ring",
];

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/indexing"],
});

const client = await auth.getClient();
const accessToken = await client.getAccessToken();

console.log(`Submitting ${pearUrls.length} pear URLs to Google Indexing API...\n`);

let success = 0;
let failed = 0;

for (const url of pearUrls) {
  try {
    const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(`✓ ${url}`);
      success++;
    } else {
      console.error(`✗ ${url} — ${data.error?.message || JSON.stringify(data)}`);
      failed++;
    }
  } catch (err) {
    console.error(`✗ ${url} — ${err.message}`);
    failed++;
  }
}

console.log(`\nDone: ${success} submitted, ${failed} failed.`);
