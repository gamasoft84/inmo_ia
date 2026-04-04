import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/icons/proposals");
mkdirSync(outDir, { recursive: true });

// ── Propuesta A: Monograma "iA" con destello ──────────────────────────
const svgA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgA" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#13131F"/>
      <stop offset="100%" stop-color="#0A0A14"/>
    </linearGradient>
    <linearGradient id="goldA" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFD166"/>
      <stop offset="100%" stop-color="#C8830A"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bgA)"/>

  <!-- Subtle circle glow -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="#C8830A" stroke-opacity="0.08" stroke-width="1"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="#C8830A" stroke-opacity="0.05" stroke-width="1"/>

  <!-- "i" letter -->
  <text x="148" y="320" font-family="Georgia, serif" font-size="230" font-weight="400"
        font-style="italic" fill="url(#goldA)" opacity="0.95">i</text>

  <!-- "A" letter -->
  <text x="218" y="320" font-family="Georgia, serif" font-size="230" font-weight="700"
        fill="#ffffff" opacity="0.92">A</text>

  <!-- ✦ sparkle top-right -->
  <g transform="translate(378, 118)">
    <path d="M0,-22 L4,-4 L22,0 L4,4 L0,22 L-4,4 L-22,0 L-4,-4 Z" fill="#FFD166"/>
    <circle cx="0" cy="0" r="3" fill="#ffffff"/>
  </g>

  <!-- small sparkle bottom-left -->
  <g transform="translate(134, 390)" opacity="0.6">
    <path d="M0,-12 L2,-2 L12,0 L2,2 L0,12 L-2,2 L-12,0 L-2,-2 Z" fill="#C8830A"/>
  </g>
</svg>`;

// ── Propuesta B: Casa minimalista líneas + gradiente vibrante ─────────
const svgB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A0F2E"/>
      <stop offset="100%" stop-color="#0F0A1A"/>
    </linearGradient>
    <linearGradient id="accentB" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C8830A"/>
      <stop offset="50%" stop-color="#F5C842"/>
      <stop offset="100%" stop-color="#FF9F43"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bgB)"/>

  <!-- Glow orb behind house -->
  <ellipse cx="256" cy="300" rx="160" ry="100" fill="#C8830A" opacity="0.08"/>

  <!-- House — outline only, clean minimal -->
  <!-- Body -->
  <rect x="152" y="268" width="208" height="156" rx="6"
        fill="none" stroke="url(#accentB)" stroke-width="6"/>

  <!-- Door -->
  <rect x="222" y="330" width="68" height="94" rx="34"
        fill="none" stroke="url(#accentB)" stroke-width="4" opacity="0.8"/>

  <!-- Roof lines -->
  <polyline points="136,270 256,120 376,270"
            fill="none" stroke="url(#accentB)" stroke-width="7"
            stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)"/>

  <!-- Chimney -->
  <rect x="310" y="140" width="28" height="52" rx="4"
        fill="none" stroke="url(#accentB)" stroke-width="4" opacity="0.7"/>

  <!-- ✦ center sparkle on roof peak -->
  <g transform="translate(256, 115)" filter="url(#glow)">
    <path d="M0,-18 L3.5,-3.5 L18,0 L3.5,3.5 L0,18 L-3.5,3.5 L-18,0 L-3.5,-3.5 Z"
          fill="#FFD166"/>
  </g>

  <!-- Dot lights on house -->
  <circle cx="192" cy="308" r="5" fill="#F5C842" opacity="0.7"/>
  <circle cx="320" cy="308" r="5" fill="#F5C842" opacity="0.7"/>
</svg>`;

// ── Propuesta C: Escudo premium con casa y degradado oscuro azul ──────
const svgC = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgC" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0D1B2A"/>
      <stop offset="100%" stop-color="#050E17"/>
    </linearGradient>
    <linearGradient id="goldC" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5C842"/>
      <stop offset="100%" stop-color="#C8830A"/>
    </linearGradient>
    <linearGradient id="houseC" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F5C842" stop-opacity="1"/>
      <stop offset="100%" stop-color="#C8830A" stop-opacity="0.85"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bgC)"/>

  <!-- Hexagon border accent -->
  <polygon points="256,32 456,144 456,368 256,480 56,368 56,144"
           fill="none" stroke="url(#goldC)" stroke-width="2" stroke-opacity="0.12"/>

  <!-- Inner hex -->
  <polygon points="256,72 420,162 420,348 256,440 92,348 92,162"
           fill="none" stroke="url(#goldC)" stroke-width="1" stroke-opacity="0.07"/>

  <!-- House solid fill -->
  <!-- Body -->
  <rect x="162" y="272" width="188" height="144" rx="8" fill="url(#houseC)"/>

  <!-- Roof -->
  <polygon points="256,118 370,272 142,272" fill="url(#goldC)"/>

  <!-- Door arch -->
  <rect x="222" y="334" width="68" height="82" rx="34" fill="#0D1B2A" opacity="0.7"/>

  <!-- Window left -->
  <rect x="176" y="298" width="42" height="38" rx="5" fill="#0D1B2A" opacity="0.55"/>
  <!-- Window right -->
  <rect x="294" y="298" width="42" height="38" rx="5" fill="#0D1B2A" opacity="0.55"/>

  <!-- Circuit lines (AI) from house -->
  <line x1="256" y1="118" x2="256" y2="80" stroke="#F5C842" stroke-width="2" stroke-opacity="0.4" stroke-dasharray="4,4"/>
  <line x1="370" y1="272" x2="408" y2="272" stroke="#F5C842" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="4,4"/>
  <line x1="142" y1="272" x2="104" y2="272" stroke="#F5C842" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="4,4"/>

  <!-- Nodes at circuit ends -->
  <circle cx="256" cy="76" r="5" fill="#FFD166"/>
  <circle cx="412" cy="272" r="4" fill="#FFD166" opacity="0.7"/>
  <circle cx="100" cy="272" r="4" fill="#FFD166" opacity="0.7"/>

  <!-- ✦ above house -->
  <g transform="translate(256, 72)">
    <path d="M0,-16 L3,-3 L16,0 L3,3 L0,16 L-3,3 L-16,0 L-3,-3 Z"
          fill="#ffffff" opacity="0.9"/>
  </g>
</svg>`;

const proposals = [
  { name: "proposal-A-monograma.png",  svg: svgA },
  { name: "proposal-B-lineal.png",     svg: svgB },
  { name: "proposal-C-circuito.png",   svg: svgC },
];

for (const { name, svg } of proposals) {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(512, 512).png().toFile(join(outDir, name));
  console.log(`✓ ${name}`);
}
console.log("\nVer en: public/icons/proposals/");
