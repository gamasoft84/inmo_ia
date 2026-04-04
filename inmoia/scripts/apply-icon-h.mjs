import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/icons");
mkdirSync(outDir, { recursive: true });

const svgBase = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
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
    <path d="M0,-110 L18,-18 L110,0 L18,18 L0,110 L-18,18 L-110,0 L-18,-18 Z"
          fill="url(#starH)" opacity="0.95"/>
    <path d="M-62,-62 L-8,-8 L0,-88 L8,-8 L62,-62 L8,0 L62,62 L8,8 L0,88 L-8,8 L-62,62 L-8,0 Z"
          fill="url(#starH)" opacity="0.35"/>
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

// Para iconos pequeños (32px) el texto no se ve bien — versión solo estrella
const svgSmall = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgS" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0F1A"/>
      <stop offset="100%" stop-color="#0A0A12"/>
    </linearGradient>
    <linearGradient id="starS" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE599"/>
      <stop offset="100%" stop-color="#C8830A"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bgS)"/>
  <g transform="translate(256, 256)">
    <path d="M0,-140 L23,-23 L140,0 L23,23 L0,140 L-23,23 L-140,0 L-23,-23 Z"
          fill="url(#starS)" opacity="0.95"/>
    <path d="M-80,-80 L-10,-10 L0,-112 L10,-10 L80,-80 L10,0 L80,80 L10,10 L0,112 L-10,10 L-80,80 L-10,0 Z"
          fill="url(#starS)" opacity="0.3"/>
    <circle cx="0" cy="0" r="12" fill="#ffffff" opacity="0.9"/>
  </g>
</svg>`;

const sizes = [
  { name: "icon-512.png",  size: 512, svg: svgBase  },
  { name: "icon-192.png",  size: 192, svg: svgBase  },
  { name: "icon-180.png",  size: 180, svg: svgBase  },
  { name: "icon-32.png",   size: 32,  svg: svgSmall },
];

for (const { name, size, svg } of sizes) {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(size, size).png().toFile(join(outDir, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

console.log("\nIconos actualizados en public/icons/");
