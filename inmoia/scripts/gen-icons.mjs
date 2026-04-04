import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/icons");
mkdirSync(outDir, { recursive: true });

// SVG design: dark bg + house silhouette + ✦ AI sparkle
// Colors: #0F0F1A bg, amber gradient #C8830A → #F5A623
const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5C842"/>
      <stop offset="100%" stop-color="#C8830A"/>
    </linearGradient>
    <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE08A"/>
      <stop offset="100%" stop-color="#F5A623"/>
    </linearGradient>
    <!-- Maskable safe zone: 80% of canvas = 204px margin each side -->
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="#0F0F1A"/>

  <!-- Subtle grid texture -->
  <line x1="256" y1="60" x2="256" y2="452" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <line x1="60" y1="256" x2="452" y2="256" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>

  <!-- House body -->
  <rect x="158" y="270" width="196" height="150" rx="8" fill="url(#gold)" opacity="0.95"/>

  <!-- House roof / triangle -->
  <polygon points="256,110 370,268 142,268" fill="url(#goldLight)"/>

  <!-- Roof ridge highlight -->
  <polygon points="256,118 362,266 150,266" fill="none" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1.5"/>

  <!-- Door -->
  <rect x="224" y="330" width="64" height="90" rx="32" fill="#0F0F1A" opacity="0.75"/>

  <!-- Window left -->
  <rect x="172" y="298" width="44" height="40" rx="6" fill="#0F0F1A" opacity="0.55"/>
  <line x1="194" y1="298" x2="194" y2="338" stroke="#C8830A" stroke-width="1.5" opacity="0.6"/>
  <line x1="172" y1="318" x2="216" y2="318" stroke="#C8830A" stroke-width="1.5" opacity="0.6"/>

  <!-- Window right -->
  <rect x="296" y="298" width="44" height="40" rx="6" fill="#0F0F1A" opacity="0.55"/>
  <line x1="318" y1="298" x2="318" y2="338" stroke="#C8830A" stroke-width="1.5" opacity="0.6"/>
  <line x1="296" y1="318" x2="340" y2="318" stroke="#C8830A" stroke-width="1.5" opacity="0.6"/>

  <!-- ✦ AI sparkle — top right of house -->
  <g transform="translate(348, 148)">
    <!-- 4-pointed star -->
    <path d="M0,-28 L5,-5 L28,0 L5,5 L0,28 L-5,5 L-28,0 L-5,-5 Z"
          fill="#FFE08A" opacity="0.95"/>
    <!-- small dot center -->
    <circle cx="0" cy="0" r="4" fill="#ffffff" opacity="0.9"/>
  </g>

  <!-- Small sparkle accent -->
  <g transform="translate(164, 168)" opacity="0.5">
    <path d="M0,-14 L2.5,-2.5 L14,0 L2.5,2.5 L0,14 L-2.5,2.5 L-14,0 L-2.5,-2.5 Z"
          fill="#F5C842"/>
  </g>
</svg>`;

const sizes = [
  { name: "icon-192.png",  size: 192 },
  { name: "icon-512.png",  size: 512 },
  { name: "icon-180.png",  size: 180 }, // Apple touch icon
  { name: "icon-32.png",   size: 32  }, // favicon
];

for (const { name, size } of sizes) {
  const scaledSvg = svg512.replace('width="512" height="512"', `width="${size}" height="${size}"`);
  const buf = Buffer.from(scaledSvg);
  await sharp(buf)
    .resize(size, size)
    .png()
    .toFile(join(outDir, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

console.log("\nIconos generados en public/icons/");
