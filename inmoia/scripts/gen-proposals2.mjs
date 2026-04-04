import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/icons/proposals");
mkdirSync(outDir, { recursive: true });

// ── D: Casa con gradiente púrpura-dorado y ✦ grande central ──────────
const svgD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgD" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A0A2E"/>
      <stop offset="100%" stop-color="#0D0618"/>
    </linearGradient>
    <linearGradient id="roofD" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C8830A"/>
      <stop offset="100%" stop-color="#8B4513"/>
    </linearGradient>
    <linearGradient id="bodyD" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D4920F"/>
      <stop offset="100%" stop-color="#9A6010"/>
    </linearGradient>
    <radialGradient id="glowD" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#9B59B6" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#9B59B6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bgD)"/>
  <!-- Purple glow -->
  <ellipse cx="256" cy="220" rx="220" ry="180" fill="url(#glowD)"/>
  <!-- Stars background -->
  <circle cx="80"  cy="80"  r="2" fill="#ffffff" opacity="0.4"/>
  <circle cx="430" cy="90"  r="1.5" fill="#ffffff" opacity="0.3"/>
  <circle cx="60"  cy="380" r="1.5" fill="#ffffff" opacity="0.25"/>
  <circle cx="450" cy="400" r="2" fill="#ffffff" opacity="0.35"/>
  <circle cx="380" cy="60"  r="1" fill="#ffffff" opacity="0.3"/>
  <circle cx="130" cy="430" r="1" fill="#ffffff" opacity="0.2"/>
  <!-- House body -->
  <rect x="155" y="278" width="202" height="148" rx="10" fill="url(#bodyD)"/>
  <!-- Roof -->
  <polygon points="256,108 382,278 130,278" fill="url(#roofD)"/>
  <!-- Roof highlight -->
  <polygon points="256,116 374,276 138,276" fill="none" stroke="#FFD166" stroke-width="1.5" stroke-opacity="0.3"/>
  <!-- Door rounded -->
  <rect x="221" y="338" width="70" height="88" rx="35" fill="#1A0A2E" opacity="0.8"/>
  <!-- Windows -->
  <rect x="172" y="304" width="46" height="42" rx="6" fill="#1A0A2E" opacity="0.6"/>
  <rect x="294" y="304" width="46" height="42" rx="6" fill="#1A0A2E" opacity="0.6"/>
  <!-- ✦ BIG sparkle -->
  <g transform="translate(256, 96)">
    <path d="M0,-30 L6,-6 L30,0 L6,6 L0,30 L-6,6 L-30,0 L-6,-6 Z" fill="#FFD166"/>
    <path d="M0,-16 L3,-3 L16,0 L3,3 L0,16 L-3,3 L-16,0 L-3,-3 Z" fill="#ffffff"/>
  </g>
  <!-- Purple dot accents -->
  <circle cx="156" cy="278" r="5" fill="#9B59B6" opacity="0.8"/>
  <circle cx="356" cy="278" r="5" fill="#9B59B6" opacity="0.8"/>
</svg>`;

// ── E: Letra "I" estilizada como torre/edificio ───────────────────────
const svgE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgE" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0F1A"/>
      <stop offset="100%" stop-color="#050508"/>
    </linearGradient>
    <linearGradient id="towerE" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C8830A"/>
      <stop offset="50%" stop-color="#FFD166"/>
      <stop offset="100%" stop-color="#C8830A"/>
    </linearGradient>
    <linearGradient id="baseE" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F5C842"/>
      <stop offset="100%" stop-color="#8B5A00"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bgE)"/>
  <!-- Horizontal base bar -->
  <rect x="120" y="390" width="272" height="32" rx="8" fill="url(#baseE)"/>
  <!-- Horizontal top bar -->
  <rect x="120" y="90" width="272" height="32" rx="8" fill="url(#towerE)"/>
  <!-- Tower / I-beam vertical -->
  <rect x="224" y="122" width="64" height="268" fill="url(#towerE)" opacity="0.95"/>
  <!-- Windows on tower -->
  <rect x="236" y="150" width="40" height="28" rx="4" fill="#0F0F1A" opacity="0.7"/>
  <rect x="236" y="198" width="40" height="28" rx="4" fill="#0F0F1A" opacity="0.7"/>
  <rect x="236" y="246" width="40" height="28" rx="4" fill="#0F0F1A" opacity="0.7"/>
  <rect x="236" y="294" width="40" height="28" rx="4" fill="#0F0F1A" opacity="0.7"/>
  <rect x="236" y="342" width="40" height="28" rx="4" fill="#0F0F1A" opacity="0.7"/>
  <!-- ✦ top of tower -->
  <g transform="translate(256, 78)">
    <path d="M0,-20 L4,-4 L20,0 L4,4 L0,20 L-4,4 L-20,0 L-4,-4 Z" fill="#FFD166"/>
    <circle cx="0" cy="0" r="3.5" fill="#ffffff"/>
  </g>
  <!-- Side glow lines -->
  <line x1="120" y1="106" x2="120" y2="406" stroke="#C8830A" stroke-width="1" stroke-opacity="0.2"/>
  <line x1="392" y1="106" x2="392" y2="406" stroke="#C8830A" stroke-width="1" stroke-opacity="0.2"/>
</svg>`;

// ── F: Rombo / diamante con casa interna ─────────────────────────────
const svgF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#060D18"/>
    </linearGradient>
    <linearGradient id="diamondF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFD166" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#C8830A" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="houseF" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFD166"/>
      <stop offset="100%" stop-color="#C8830A"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bgF)"/>
  <!-- Diamond shape background -->
  <polygon points="256,48 464,256 256,464 48,256"
           fill="url(#diamondF)" stroke="#C8830A" stroke-width="1.5" stroke-opacity="0.35"/>
  <!-- Inner diamond -->
  <polygon points="256,90 422,256 256,422 90,256"
           fill="none" stroke="#C8830A" stroke-width="0.8" stroke-opacity="0.15"/>
  <!-- House -->
  <!-- Roof -->
  <polygon points="256,148 348,255 164,255" fill="url(#houseF)"/>
  <!-- Body -->
  <rect x="172" y="255" width="168" height="120" rx="6" fill="url(#houseF)" opacity="0.9"/>
  <!-- Door -->
  <rect x="224" y="300" width="64" height="75" rx="32" fill="#0A1628" opacity="0.75"/>
  <!-- Windows -->
  <rect x="186" y="272" width="36" height="32" rx="4" fill="#0A1628" opacity="0.6"/>
  <rect x="290" y="272" width="36" height="32" rx="4" fill="#0A1628" opacity="0.6"/>
  <!-- Corner sparkles on diamond -->
  <g transform="translate(256,44)">
    <path d="M0,-14 L2.5,-2.5 L14,0 L2.5,2.5 L0,14 L-2.5,2.5 L-14,0 L-2.5,-2.5 Z"
          fill="#FFD166"/>
  </g>
  <g transform="translate(468,256)" opacity="0.5">
    <path d="M0,-10 L2,-2 L10,0 L2,2 L0,10 L-2,2 L-10,0 L-2,-2 Z" fill="#C8830A"/>
  </g>
  <g transform="translate(44,256)" opacity="0.5">
    <path d="M0,-10 L2,-2 L10,0 L2,2 L0,10 L-2,2 L-10,0 L-2,-2 Z" fill="#C8830A"/>
  </g>
</svg>`;

// ── G: Gradiente vibrante coral+dorado, diseño bold ──────────────────
const svgG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1C0A00"/>
      <stop offset="100%" stop-color="#0A0500"/>
    </linearGradient>
    <linearGradient id="roofG" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E8520A"/>
      <stop offset="100%" stop-color="#FFB347"/>
    </linearGradient>
    <linearGradient id="bodyG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5A623"/>
      <stop offset="100%" stop-color="#C8670A"/>
    </linearGradient>
    <radialGradient id="sunG" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFD166" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#FFD166" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bgG)"/>
  <!-- Sun glow -->
  <circle cx="256" cy="200" r="180" fill="url(#sunG)"/>
  <!-- Horizon line -->
  <rect x="60" y="395" width="392" height="2" rx="1" fill="#C8670A" opacity="0.3"/>
  <!-- House bold -->
  <!-- Body -->
  <rect x="148" y="270" width="216" height="150" rx="12" fill="url(#bodyG)"/>
  <!-- Roof bold -->
  <polygon points="256,98 392,270 120,270" fill="url(#roofG)"/>
  <!-- Roof overhang line -->
  <line x1="108" y1="270" x2="404" y2="270" stroke="#FFD166" stroke-width="4" stroke-opacity="0.4"/>
  <!-- Door arch bold -->
  <rect x="218" y="332" width="76" height="88" rx="38" fill="#1C0A00" opacity="0.85"/>
  <!-- Windows bold -->
  <rect x="166" y="296" width="50" height="46" rx="8" fill="#1C0A00" opacity="0.65"/>
  <rect x="296" y="296" width="50" height="46" rx="8" fill="#1C0A00" opacity="0.65"/>
  <!-- Cross divider windows -->
  <line x1="191" y1="296" x2="191" y2="342" stroke="#F5A623" stroke-width="2" stroke-opacity="0.5"/>
  <line x1="166" y1="319" x2="216" y2="319" stroke="#F5A623" stroke-width="2" stroke-opacity="0.5"/>
  <line x1="321" y1="296" x2="321" y2="342" stroke="#F5A623" stroke-width="2" stroke-opacity="0.5"/>
  <line x1="296" y1="319" x2="346" y2="319" stroke="#F5A623" stroke-width="2" stroke-opacity="0.5"/>
  <!-- ✦ sparkle peak -->
  <g transform="translate(256,88)">
    <path d="M0,-24 L5,-5 L24,0 L5,5 L0,24 L-5,5 L-24,0 L-5,-5 Z" fill="#FFD166"/>
    <circle cx="0" cy="0" r="4" fill="#ffffff" opacity="0.95"/>
  </g>
  <!-- Small stars -->
  <g transform="translate(340,140)" opacity="0.7">
    <path d="M0,-12 L2,-2 L12,0 L2,2 L0,12 L-2,2 L-12,0 L-2,-2 Z" fill="#FFB347"/>
  </g>
  <g transform="translate(172,158)" opacity="0.5">
    <path d="M0,-8 L1.5,-1.5 L8,0 L1.5,1.5 L0,8 L-1.5,1.5 L-8,0 L-1.5,-1.5 Z" fill="#FFD166"/>
  </g>
</svg>`;

// ── H: Ultra minimal — solo ✦ grande + "InmoIA" texto fino ───────────
const svgH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0F1A"/>
      <stop offset="100%" stop-color="#0A0A12"/>
    </linearGradient>
    <linearGradient id="starH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE599"/>
      <stop offset="100%" stop-color="#C8830A"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bgH)"/>

  <!-- Thin circle frame -->
  <circle cx="256" cy="220" r="158" fill="none" stroke="url(#starH)" stroke-width="1" stroke-opacity="0.2"/>

  <!-- ✦ Large central sparkle -->
  <g transform="translate(256, 210)">
    <!-- Main 4 points -->
    <path d="M0,-110 L18,-18 L110,0 L18,18 L0,110 L-18,18 L-110,0 L-18,-18 Z"
          fill="url(#starH)" opacity="0.95"/>
    <!-- Diagonal 4 points (smaller) -->
    <path d="M-62,-62 L-8,-8 L0,-88 L8,-8 L62,-62 L8,0 L62,62 L8,8 L0,88 L-8,8 L-62,62 L-8,0 Z"
          fill="url(#starH)" opacity="0.35"/>
    <!-- Center dot -->
    <circle cx="0" cy="0" r="10" fill="#ffffff" opacity="0.9"/>
  </g>

  <!-- "InmoIA" text -->
  <text x="256" y="376"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="42" font-weight="400" letter-spacing="6"
        fill="#C8830A" text-anchor="middle" opacity="0.9">InmoIA</text>

  <!-- Thin line under text -->
  <line x1="160" y1="388" x2="352" y2="388" stroke="#C8830A" stroke-width="0.8" stroke-opacity="0.35"/>
</svg>`;

const proposals = [
  { name: "proposal-D-purpura.png",   svg: svgD },
  { name: "proposal-E-torre.png",     svg: svgE },
  { name: "proposal-F-diamante.png",  svg: svgF },
  { name: "proposal-G-coral.png",     svg: svgG },
  { name: "proposal-H-minimal.png",   svg: svgH },
];

for (const { name, svg } of proposals) {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(512, 512).png().toFile(join(outDir, name));
  console.log(`✓ ${name}`);
}
console.log("\nListo.");
