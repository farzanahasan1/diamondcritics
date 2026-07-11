import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const publicImages = path.join(projectRoot, "public", "images");
const tmpImages = path.join(projectRoot, "tmp-images");

// Featured image
const featured = {
  src: "/Users/mehedihasan/Downloads/Pear-Diamond-Yellow-Gold-Engagement-Ring.jpg",
  dest: path.join(publicImages, "yellow-gold-pear-diamond-ring-featured.avif"),
  width: 1500,
  height: 1000,
  fit: "inside",
};

// Ring product images (square CDN photos → contain with white bg)
const ringImages = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: path.join(tmpImages, `bn-yg-pear-ring-${n}.jpg`),
  dest: path.join(publicImages, `bn-yg-pear-ring-${n}.avif`),
  width: 1200,
  height: 1200,
  fit: "contain",
}));

const allImages = [featured, ...ringImages];

for (const img of allImages) {
  try {
    const opts =
      img.fit === "contain"
        ? {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          }
        : { fit: "inside", withoutEnlargement: true };

    await sharp(img.src)
      .resize(img.width, img.height, opts)
      .avif({ quality: 82 })
      .toFile(img.dest);

    console.log(`✓ ${path.basename(img.dest)}`);
  } catch (err) {
    console.error(`✗ ${path.basename(img.dest)}: ${err.message}`);
  }
}

console.log("Done.");
