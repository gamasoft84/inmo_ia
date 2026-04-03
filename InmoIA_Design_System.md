# InmoIA — Design System & Guía de Desarrollo
> **Versión 2.0 · Abril 2026**
> Gamasoft IA Technologies S.A.S. · Para uso exclusivo con Claude Code

---

## ÍNDICE

| # | Sección |
|---|---------|
| 1 | Identidad y marca |
| 2 | Variables CSS — Tokens de diseño |
| 3 | Tipografía |
| 4 | Colores y temas |
| 5 | Espaciado y layout |
| 6 | Componentes base |
| 7 | Componentes complejos |
| 8 | Iconografía y emojis |
| 9 | Estados del sistema |
| 10 | Responsive y PWA |
| 11 | Animaciones |
| 12 | Modelo de datos — Supabase |
| 13 | Lógica de negocio |
| 14 | Integraciones externas |
| 15 | Stack tecnológico |
| 16 | Estructura de archivos |
| 17 | Variables de entorno |
| 18 | Seguridad y roles |
| 19 | Flujos críticos del sistema |
| 20 | URLs y rutas |
| 21 | Emails transaccionales |
| 22 | Reglas de uso |
| 23 | Orden de construcción — 9 fases |
| 24 | Prototipos disponibles |
| 25 | Prompt maestro para Claude Code |

---

## 1. IDENTIDAD Y MARCA

### Producto
| Campo | Valor |
|---|---|
| **Nombre del producto** | InmoIA |
| **Empresa** | Gamasoft IA Technologies S.A.S. |
| **Tagline** | "Tu agencia vende más mientras la IA trabaja por ti" |
| **Mercado objetivo** | Agencias inmobiliarias · México y LATAM |
| **Idiomas** | Español (principal) + Inglés (portal público y Huatulco) |
| **Dominio** | inmoia.com |

### Personalidad de marca
- Profesional pero cálido — nunca frío ni robótico
- Tecnológico sin ser intimidante
- Confiable y moderno
- Premium pero accesible para agencias medianas

### Logo y símbolo de IA
```
Símbolo IA:    ✦  (identifica TODAS las funciones de inteligencia artificial)
Logo emoji:    🌊 + "InmoIA"  (agencias costeras / Huatulco)
Logo emoji:    🏡 + "InmoIA"  (agencias urbanas / CDMX)
Fondo ícono:   var(--brand-light)
Tipografía:    Sora · font-weight: 500
```

### Chatbot por defecto
```
Nombre:   Sofía
Género:   Femenino
Idioma:   Detecta automáticamente (ES/EN)
Tono:     Profesional y cálido con emojis
```

---

## 2. VARIABLES CSS — TOKENS DE DISEÑO

Pega este bloque en `app/globals.css`. Es la base de todo el sistema.

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');

:root {
  /* TEMA DE COLOR — Ámbar por defecto */
  --brand:        #BA7517;
  --brand-dark:   #854F0B;
  --brand-light:  #FAEEDA;
  --brand-border: #FAC775;
  --brand-text:   #412402;

  /* TIPOGRAFÍA */
  --font-sans: 'Sora', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* BORDER RADIUS */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  /* SOMBRAS */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.10);
  --shadow-xl: 0 20px 60px rgba(0,0,0,0.15);

  /* TRANSICIONES */
  --t-fast:   150ms ease;
  --t-normal: 200ms ease;
  --t-slow:   300ms cubic-bezier(0.4, 0, 0.2, 1);
  --t-bounce: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ESPACIADO — base 4px */
  --space-1:  4px;  --space-2:  8px;  --space-3:  12px;
  --space-4:  16px; --space-5:  20px; --space-6:  24px;
  --space-8:  32px; --space-10: 40px; --space-12: 48px;

  /* SIDEBAR — siempre oscuro, no cambia con el tema */
  --sidebar-bg:     #0F0F1A;
  --sidebar-text:   rgba(255,255,255,0.8);
  --sidebar-muted:  rgba(255,255,255,0.4);
  --sidebar-border: rgba(255,255,255,0.06);
  --sidebar-hover:  rgba(255,255,255,0.05);
  --sidebar-active: rgba(255,255,255,0.07);

  /* COLORES SEMÁNTICOS — fijos, no cambian con el tema */
  --success:        #3B6D11;
  --success-light:  #EAF3DE;
  --success-border: #C0DD97;
  --error:          #A32D2D;
  --error-light:    #FCEBEB;
  --error-border:   #F7C1C1;
  --info:           #185FA5;
  --info-light:     #E6F1FB;
  --info-border:    #B5D4F4;

  /* WHATSAPP */
  --wa-green:  #25D366;
  --wa-dark:   #075E54;
  --wa-bg:     #ECE5DD;
  --wa-bubble: #DCF8C6;
}

/* MODO CLARO (default) */
[data-theme="light"], :root {
  --bg-primary:   #FFFFFF;
  --bg-secondary: #F7F6F3;
  --bg-tertiary:  #F0EDE8;
  --text-primary:   #1A1A2E;
  --text-secondary: #4A4A6A;
  --text-tertiary:  #9090A8;
  --border-primary:   #E0DDD8;
  --border-secondary: #D4D0C8;
  --border-tertiary:  #EBEBEB;
}

/* MODO OSCURO */
[data-theme="dark"] {
  --bg-primary:   #0F0F1A;
  --bg-secondary: #1A1A2E;
  --bg-tertiary:  #12121E;
  --text-primary:   #F0EDE8;
  --text-secondary: #C0BCBA;
  --text-tertiary:  #706E7A;
  --border-primary:   #2A2A3E;
  --border-secondary: #242436;
  --border-tertiary:  #1E1E2E;
}

/* RESET */
*, *::before, *::after { box-sizing: border-box; }
body { font-family: var(--font-sans); color: var(--text-primary); background: var(--bg-primary); -webkit-font-smoothing: antialiased; }
input, select, textarea, button { font-family: var(--font-sans); }
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-thumb { background: var(--border-tertiary); border-radius: 2px; }
```

---

## 3. TIPOGRAFÍA

### Google Font: Sora
```html
<!-- app/layout.tsx -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

### Escala y uso
| Tamaño | Uso |
|---|---|
| 9px | Badges, timestamps pequeños |
| 10px | Labels de campo (uppercase + tracking) |
| 11px | Texto de cuerpo, descripciones |
| 12px | Valores en tabla, body principal |
| 13px | Nombres, subtítulos |
| 15px | Títulos de página (font-medium, tracking-tight) |
| 18px | Títulos de sección grandes |
| 22-28px | Títulos hero, valores de métricas |

### Reglas
```
Títulos de página:   15-16px · font-weight:500 · letter-spacing:-0.02em
Labels de campo:     10px · color:text-tertiary · letter-spacing:0.03em · UPPERCASE
Texto de cuerpo:     11-12px · color:text-secondary · line-height:1.6-1.7
Precios:             14-28px · font-weight:500 · color:var(--brand-dark)
Solo pesos:          400, 500, 600 — NUNCA 700 ni bold genérico
```

---

## 4. COLORES Y TEMAS

### Los 5 temas disponibles
```css
[data-color-theme="amber"]  { --brand:#BA7517; --brand-dark:#854F0B; --brand-light:#FAEEDA; --brand-border:#FAC775; --brand-text:#412402; }
[data-color-theme="green"]  { --brand:#1D9E75; --brand-dark:#0F6E56; --brand-light:#E1F5EE; --brand-border:#9FE1CB; --brand-text:#04342C; }
[data-color-theme="blue"]   { --brand:#378ADD; --brand-dark:#185FA5; --brand-light:#E6F1FB; --brand-border:#B5D4F4; --brand-text:#042C53; }
[data-color-theme="coral"]  { --brand:#D85A30; --brand-dark:#993C1D; --brand-light:#FAECE7; --brand-border:#F5C4B3; --brand-text:#4A1B0C; }
[data-color-theme="purple"] { --brand:#7F77DD; --brand-dark:#534AB7; --brand-light:#EEEDFE; --brand-border:#AFA9EC; --brand-text:#26215C; }
```

### Gestión del tema en Next.js
```typescript
// lib/utils/theme.ts
export function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-color-theme', theme)
  localStorage.setItem('inmoia-color-theme', theme)
}
export function applyDarkMode(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('inmoia-dark-mode', String(dark))
}
// Cargar al inicio en layout.tsx (script inline para evitar flash)
```

---

## 5. ESPACIADO Y LAYOUT

### Estructura general
```
┌────────────────────────────────────────┐
│  TOPBAR  (height: 52px)                │
├──────────┬─────────────────────────────┤
│          │                             │
│ SIDEBAR  │   CONTENT AREA             │
│ (220px)  │   flex:1 · overflow-y:auto  │
│ bg:#0F0F1A│   padding: 20px           │
│          │   bg: var(--bg-tertiary)    │
│          │                             │
└──────────┴─────────────────────────────┘

Mobile (<768px):
  Sin sidebar
  Bottom navigation (5 tabs, height: 56px)
  FAB (+) esquina inferior derecha
```

### CSS del layout principal
```css
.app-layout   { display:flex; height:100vh; overflow:hidden; }
.sidebar      { width:220px; flex-shrink:0; background:var(--sidebar-bg); overflow-y:auto; }
.main-content { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.topbar       { height:52px; padding:0 20px; border-bottom:0.5px solid var(--border-tertiary); background:var(--bg-primary); display:flex; align-items:center; gap:12px; flex-shrink:0; }
.content-area { flex:1; overflow-y:auto; padding:20px; background:var(--bg-tertiary); }
.page-header  { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.page-title   { font-size:15px; font-weight:500; letter-spacing:-0.02em; }
```

### Grids estándar
```css
.grid-2     { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.grid-3     { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.grid-4     { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.grid-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
/* Dos columnas main + side */
.layout-main-side       { display:flex; gap:16px; }
.layout-main-side .main { flex:1.4; }
.layout-main-side .side { flex:1; }
```

---

## 6. COMPONENTES BASE

### Botones
```css
.btn { font-family:var(--font-sans); font-size:11px; font-weight:500; border-radius:var(--radius-md); padding:8px 16px; cursor:pointer; transition:opacity var(--t-fast); display:inline-flex; align-items:center; gap:6px; white-space:nowrap; border:none; }
.btn:hover { opacity:0.88; }
.btn-sm  { font-size:10px; padding:4px 10px; }
.btn-lg  { font-size:13px; padding:10px 24px; }
.btn-full { width:100%; justify-content:center; }

.btn-primary    { background:#0F0F1A; color:#fff; }
.btn-brand      { background:var(--brand); color:#fff; }
.btn-brand-soft { background:var(--brand-light); color:var(--brand-text); border:1.5px solid var(--brand-border) !important; }
.btn-ghost      { background:none; color:var(--text-secondary); border:0.5px solid var(--border-secondary) !important; }
.btn-danger     { background:var(--error-light); color:var(--error); border:1.5px solid var(--error-border) !important; }
.btn-success    { background:var(--success-light); color:var(--success); border:1.5px solid var(--success-border) !important; }
.btn-whatsapp   { background:var(--wa-green); color:#fff; }
```

### Inputs, select, textarea
```css
.input-base { width:100%; border:0.5px solid var(--border-secondary); border-radius:var(--radius-md); padding:8px 12px; font-size:12px; font-family:var(--font-sans); background:var(--bg-primary); color:var(--text-primary); outline:none; transition:border-color var(--t-fast); }
.input-base:focus     { border-color:var(--brand); }
.input-base.ai-filled { border-color:var(--brand-border); background:var(--brand-light); color:var(--brand-text); }
.input-base.error     { border-color:var(--error); }
.input-base.success   { border-color:var(--success); }
```

### Cards
```css
.card         { background:var(--bg-primary); border-radius:var(--radius-lg); border:0.5px solid var(--border-tertiary); padding:16px; }
.card-title   { font-size:12px; font-weight:500; margin-bottom:12px; }
.card-brand   { background:var(--brand-light); border-color:var(--brand-border); }
.card-dark    { background:#0F0F1A; border-color:rgba(255,255,255,0.06); color:#fff; }
.card-success { background:var(--success-light); border-color:var(--success-border); }
.card-error   { background:var(--error-light); border-color:var(--error-border); }
.card-info    { background:var(--info-light); border-color:var(--info-border); }
```

### Toggle (switch)
```css
/* ON: background brand, knob a la derecha, texto "Sí" */
/* OFF: background secondary, knob a la izquierda, texto "No" */
.toggle-track { width:40px; height:22px; border-radius:11px; border:1.5px solid var(--border-secondary); background:var(--bg-secondary); position:relative; transition:all var(--t-normal); flex-shrink:0; }
.toggle-track.on { background:var(--brand); border-color:var(--brand); }
.toggle-knob { position:absolute; top:3px; left:3px; width:13px; height:13px; border-radius:50%; background:var(--border-secondary); transition:all var(--t-normal); }
.toggle-track.on .toggle-knob { left:21px; background:#fff; }
.toggle-text { font-size:10px; font-weight:500; color:var(--text-tertiary); min-width:18px; }
.toggle-track.on + .toggle-text { color:var(--brand-dark); }
```

### Chips y Pills
```css
/* Chip: clickeable, on/off */
.chip { padding:5px 12px; border-radius:var(--radius-full); font-size:11px; cursor:pointer; border:1.5px solid var(--border-secondary); color:var(--text-tertiary); background:var(--bg-secondary); transition:all var(--t-fast); }
.chip.active { background:var(--brand-light); border-color:var(--brand); color:var(--brand-text); font-weight:500; }

/* Pill: solo visual, no clickeable */
.pill { font-size:10px; font-weight:500; padding:2px 8px; border-radius:var(--radius-full); display:inline-flex; align-items:center; gap:4px; }
.pill-hot     { background:var(--error-light);   color:var(--error); }
.pill-warm    { background:var(--brand-light);    color:var(--brand-dark); }
.pill-cold    { background:var(--bg-secondary);   color:var(--text-tertiary); }
.pill-success { background:var(--success-light);  color:var(--success); }
.pill-info    { background:var(--info-light);     color:var(--info); }
```

### Avatar
```css
.avatar    { border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-weight:600; flex-shrink:0; background:var(--brand-light); color:var(--brand-dark); border:1.5px solid var(--brand-border); }
.avatar-sm { width:28px; height:28px; font-size:10px; }
.avatar-md { width:36px; height:36px; font-size:13px; border-radius:10px; }
.avatar-lg { width:44px; height:44px; font-size:16px; border-radius:12px; }
.avatar-xl { width:64px; height:64px; font-size:24px; border-radius:16px; }
.avatar-round { border-radius:50%; }
```

### Badge IA
```css
.badge-ai { display:inline-flex; align-items:center; gap:4px; background:var(--brand-light); color:var(--brand-dark); border:1px solid var(--brand-border); border-radius:var(--radius-full); padding:2px 8px; font-size:9px; font-weight:600; }
/* Uso: <span class="badge-ai">✦ IA</span> — identifica campos llenados por Claude */
```

---

## 7. COMPONENTES COMPLEJOS

### Sidebar navigation
```css
.sidebar-section-label { font-size:9px; font-weight:600; color:rgba(255,255,255,0.25); letter-spacing:0.08em; padding:12px 14px 4px; text-transform:uppercase; }
.sidebar-item { display:flex; align-items:center; gap:10px; padding:8px 14px; margin:1px 8px; border-radius:var(--radius-md); cursor:pointer; font-size:12px; color:rgba(255,255,255,0.5); border-left:2px solid transparent; transition:all var(--t-fast); }
.sidebar-item:hover  { background:var(--sidebar-hover); color:rgba(255,255,255,0.8); }
.sidebar-item.active { background:var(--sidebar-active); color:#fff; font-weight:500; border-left-color:var(--brand); }
```

### Stat card (dashboard)
```css
.stat-card  { background:var(--bg-primary); border-radius:var(--radius-lg); border:0.5px solid var(--border-tertiary); padding:16px; }
.stat-label { font-size:9px; color:var(--text-tertiary); letter-spacing:0.05em; font-weight:500; text-transform:uppercase; }
.stat-value { font-size:28px; font-weight:500; letter-spacing:-0.02em; line-height:1; margin:6px 0 4px; }
.stat-change      { font-size:10px; color:var(--success); }
.stat-change.down { color:var(--error); }
```

### Tabla de datos
```css
.data-table { width:100%; border-collapse:collapse; }
.data-th { text-align:left; font-size:10px; color:var(--text-tertiary); letter-spacing:0.04em; font-weight:400; padding:8px 12px; border-bottom:0.5px solid var(--border-tertiary); background:var(--bg-secondary); position:sticky; top:0; }
.data-td { padding:10px 12px; border-bottom:0.5px solid var(--border-tertiary); font-size:12px; }
.data-tr:hover .data-td { background:var(--bg-secondary); }
.data-tr:last-child .data-td { border-bottom:none; }
```

### Steps / Progress
```css
.step-num { width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:600; border:1.5px solid var(--border-secondary); color:var(--text-tertiary); background:var(--bg-primary); transition:all var(--t-normal); flex-shrink:0; }
.step.active .step-num { background:var(--brand); border-color:var(--brand); color:#fff; }
.step.done .step-num   { background:var(--success-light); border-color:var(--success-border); color:var(--success); }
.step-line      { flex:1; height:1px; background:var(--border-tertiary); }
.step-line.done { background:var(--success-border); }
```

### WhatsApp conversation
```css
.wa-container { background:var(--wa-bg); padding:10px; border-radius:var(--radius-lg); }
.wa-header    { background:var(--wa-dark); padding:8px 14px; display:flex; align-items:center; gap:8px; }
.wa-msgs      { display:flex; flex-direction:column; gap:6px; overflow-y:auto; padding:10px; }
.wa-bubble    { max-width:80%; padding:7px 12px; font-size:11px; line-height:1.5; border-radius:10px; }
.wa-bubble.bot    { background:#fff; border-radius:2px 10px 10px 10px; align-self:flex-start; color:#1a1a1a; }
.wa-bubble.client { background:var(--wa-bubble); border-radius:10px 2px 10px 10px; align-self:flex-end; color:#1a1a1a; }
.wa-time { font-size:9px; color:#9090a8; margin-top:3px; }
```

### Toast notification
```css
.toast { display:flex; align-items:flex-start; gap:10px; padding:12px 14px; border-radius:var(--radius-md); font-size:11px; animation:slideInRight 0.3s ease; position:relative; overflow:hidden; }
.toast.success { background:var(--success-light); border:0.5px solid var(--success-border); color:#27500A; }
.toast.warning { background:var(--brand-light);   border:0.5px solid var(--brand-border);   color:var(--brand-text); }
.toast.error   { background:var(--error-light);   border:0.5px solid var(--error-border);   color:#7A1F1F; }
.toast.info    { background:var(--info-light);    border:0.5px solid var(--info-border);    color:#042C53; }
.toast-progress { position:absolute; bottom:0; left:0; height:2px; background:var(--brand); animation:shrinkBar 4s linear forwards; }
```

### Skeleton loader
```css
.skeleton { background:var(--bg-secondary); border-radius:var(--radius-md); animation:shimmer 1.5s ease infinite; }
.skeleton-line  { height:10px; }
.skeleton-block { min-height:60px; border-radius:var(--radius-lg); }
```

### Empty state
```css
.empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px 20px; gap:8px; }
.empty-icon  { font-size:36px; margin-bottom:4px; }
.empty-title { font-size:13px; font-weight:500; color:var(--text-secondary); }
.empty-desc  { font-size:11px; color:var(--text-tertiary); line-height:1.6; max-width:260px; }
/* Siempre incluir: emoji grande + título + descripción + btn-brand + btn-ghost opcional */
```

---

## 8. ICONOGRAFÍA Y EMOJIS

### Librería: Lucide React
```bash
npm install lucide-react
```
```tsx
import { Home, Users, MessageSquare, BarChart2, Settings, Calendar, Bell, Search, Plus } from 'lucide-react'
// Sidebar:  size={16}
// Botones:  size={14}
// Títulos:  size={18}
```

### Símbolo ✦ — Identidad de IA
```
SIEMPRE acompaña texto descriptivo. Nunca solo.
Ejemplos correctos:
  ✦ Generar descripción
  ✦ Análisis con IA
  ✦ Sugerir respuestas
  ✦ Powered by Claude

Color sobre fondo claro:  var(--brand-dark)
Color sobre fondo oscuro: var(--brand)
En botón btn-brand-soft:  incluido en el label del botón
```

### Emojis de tipo de propiedad
```
🏡 Casa  |  🏠 Casa alt  |  🏢 Edificio/Depto  |  🏙️ Depto urbano
🌊 Frente al mar / Huatulco  |  🌿 Terreno verde  |  🏖️ Playa
🌴 Zona tropical  |  🏬 Local comercial  |  🏗️ En construcción
```

### Emojis del sistema
```
🔥 Lead caliente  |  🟡 Lead tibio  |  🧊 Lead frío
✅ Confirmado     |  ⚠️ Advertencia  |  ❌ Error/Cancelado
💬 WhatsApp/Chat  |  📅 Visita       |  💳 Pago
⚙️ Config         |  📊 Reportes    |  📍 Ubicación
```

---

## 9. ESTADOS DEL SISTEMA

### Propiedad
```typescript
type PropertyStatus = 'draft' | 'active' | 'paused' | 'sold' | 'rented' | 'archived'

const PROPERTY_STATUS = {
  draft:    { bg:'#f0f0f0', color:'#555',    border:'#ddd',    label:'Borrador',  emoji:'📝', visible:false },
  active:   { bg:'#EAF3DE', color:'#3B6D11', border:'#C0DD97', label:'Activa',    emoji:'✅', visible:true  },
  paused:   { bg:'#FAEEDA', color:'#854F0B', border:'#FAC775', label:'Pausada',   emoji:'⏸', visible:false },
  sold:     { bg:'#E6F1FB', color:'#185FA5', border:'#B5D4F4', label:'Vendida',   emoji:'🏆', visible:false },
  rented:   { bg:'#EAF3DE', color:'#3B6D11', border:'#C0DD97', label:'Rentada',   emoji:'🔑', visible:false },
  archived: { bg:'#f0f0f0', color:'#9090a8', border:'#e0e0e0', label:'Archivada', emoji:'🗃', visible:false },
}
// Solo status:'active' → aparece en catálogo público + bot la conoce
```

### Lead
```typescript
type LeadTemp = 'hot' | 'warm' | 'cold'

const LEAD_TEMP = {
  hot:  { emoji:'🔥', bg:'#FCEBEB', color:'#A32D2D', border:'#F7C1C1', label:'Caliente', minScore:75, action:'Llamar ahora'    },
  warm: { emoji:'🟡', bg:'#FAEEDA', color:'#854F0B', border:'#FAC775', label:'Tibio',    minScore:40, action:'Agendar hoy'     },
  cold: { emoji:'🧊', bg:'#f0f0f0', color:'#9090a8', border:'#ddd',    label:'Frío',     minScore:0,  action:'Reactivar por WA'},
}
// Score calculado por Claude en cada conversación
// Score ≥ 75 → hot → notificación INMEDIATA al agente
```

### Agencia
```typescript
type AgencyStatus = 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled' | 'archived'

const AGENCY_STATUS = {
  trial:     { color:'#185FA5', bg:'#E6F1FB', label:'Trial',      botActive:true,  graceDays:14 },
  active:    { color:'#3B6D11', bg:'#EAF3DE', label:'Activa',     botActive:true,  graceDays:0  },
  past_due:  { color:'#854F0B', bg:'#FAEEDA', label:'Pago pend',  botActive:true,  graceDays:3  },
  suspended: { color:'#A32D2D', bg:'#FCEBEB', label:'Suspendida', botActive:false, graceDays:0  },
  cancelled: { color:'#9090a8', bg:'#f0f0f0', label:'Cancelada',  botActive:false, graceDays:0  },
}
```

### Visita
```typescript
type VisitStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

const VISIT_STATUS = {
  pending:   { bg:'#FAEEDA', color:'#854F0B', label:'Pendiente'  },
  confirmed: { bg:'#EAF3DE', color:'#3B6D11', label:'Confirmada' },
  completed: { bg:'#E6F1FB', color:'#185FA5', label:'Realizada'  },
  cancelled: { bg:'#FCEBEB', color:'#A32D2D', label:'Cancelada'  },
  no_show:   { bg:'#f0f0f0', color:'#9090a8', label:'No asistió' },
}
```

---

## 10. RESPONSIVE Y PWA

### Breakpoints Tailwind
```javascript
// tailwind.config.ts
screens: { sm:'640px', md:'768px', lg:'1024px', xl:'1280px', '2xl':'1536px' }
```

### Comportamiento por dispositivo
```
Mobile (<768px):
  ✓ Sin sidebar → bottom navigation (5 tabs, 56px height)
  ✓ Cards en columna única
  ✓ FAB (+) en esquina inferior derecha
  ✓ Filtros en scroll horizontal
  ✓ Dynamic Island compatible (iPhone 14 Pro+)
  ✓ Área táctil mínima: 44px

Tablet (768-1024px):
  ✓ Sidebar colapsado (solo íconos, 60px)
  ✓ Cards en 2 columnas
  ✓ Tablas con scroll horizontal

Desktop (>1024px):
  ✓ Sidebar completo (220px)
  ✓ Cards en 3-4 columnas
  ✓ Layout dos columnas (main + side)
```

### PWA config
```javascript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public', register: true, skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})
module.exports = withPWA({ /* next config */ })
```

```json
// public/manifest.json
{
  "name": "InmoIA",
  "short_name": "InmoIA",
  "description": "Tu agencia vende más mientras la IA trabaja por ti",
  "start_url": "/dashboard",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0F0F1A",
  "theme_color": "#BA7517",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

---

## 11. ANIMACIONES

```css
@keyframes fadeIn       { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
@keyframes slideInLeft  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
@keyframes scaleIn      { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
@keyframes bounceIn     { from{opacity:0;transform:scale(0.8)} 60%{transform:scale(1.05)} to{opacity:1;transform:scale(1)} }
@keyframes spin         { to{transform:rotate(360deg)} }
@keyframes shimmer      { 0%,100%{opacity:0.5} 50%{opacity:1} }
@keyframes shrinkBar    { from{width:100%} to{width:0%} }

.animate-fadeIn     { animation:fadeIn       0.3s ease both; }
.animate-slideRight { animation:slideInRight  0.3s ease both; }
.animate-scaleIn    { animation:scaleIn       0.2s ease both; }
.animate-bounceIn   { animation:bounceIn      0.4s cubic-bezier(0.34,1.56,0.64,1) both; }

.delay-1 { animation-delay:0.1s; }
.delay-2 { animation-delay:0.2s; }
.delay-3 { animation-delay:0.3s; }
.delay-4 { animation-delay:0.4s; }

.spinner { width:20px; height:20px; border:2px solid rgba(186,117,23,0.2); border-top-color:var(--brand); border-radius:50%; animation:spin 0.8s linear infinite; }
```

---

## 12. MODELO DE DATOS — SUPABASE

### Tabla: agencies
```sql
CREATE TABLE agencies (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  logo_url              TEXT,
  brand_emoji           TEXT DEFAULT '🏡',
  brand_color           TEXT DEFAULT 'amber',       -- amber|green|blue|coral|purple
  dark_mode             BOOLEAN DEFAULT false,
  plan                  TEXT DEFAULT 'trial',        -- solo|agency|pro|enterprise
  status                TEXT DEFAULT 'trial',        -- trial|active|past_due|suspended|cancelled|archived
  trial_ends_at         TIMESTAMPTZ,
  whatsapp_number       TEXT,
  bot_name              TEXT DEFAULT 'Sofía',
  bot_greeting_es       TEXT,
  bot_greeting_en       TEXT,
  bot_active_24h        BOOLEAN DEFAULT true,
  bot_context           TEXT,                        -- instrucciones extra para Claude
  languages             TEXT[] DEFAULT ARRAY['es'],
  timezone              TEXT DEFAULT 'America/Mexico_City',
  stripe_customer_id    TEXT,
  stripe_subscription_id TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: users
```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  agency_id   UUID REFERENCES agencies(id) ON DELETE CASCADE,
  role        TEXT DEFAULT 'agent',    -- super_admin|agency_admin|agent|viewer
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: properties
```sql
CREATE TABLE properties (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id        UUID REFERENCES agencies(id) ON DELETE CASCADE,
  agent_id         UUID REFERENCES users(id),
  slug             TEXT UNIQUE NOT NULL,
  type             TEXT NOT NULL,              -- casa|depto|terreno|local|oficina|bodega
  operation        TEXT NOT NULL,              -- sale|rent|both
  status           TEXT DEFAULT 'draft',       -- draft|active|paused|sold|rented|archived
  title_es         TEXT NOT NULL,
  title_en         TEXT,
  desc_es          TEXT,
  desc_en          TEXT,
  desc_whatsapp_es TEXT,
  desc_whatsapp_en TEXT,
  desc_instagram_es TEXT,
  price_mxn        NUMERIC,
  price_usd        NUMERIC,
  area_total       NUMERIC,
  area_built       NUMERIC,
  bedrooms         INTEGER DEFAULT 0,
  bathrooms        NUMERIC DEFAULT 0,          -- 2.5 = 2 completos + 1 medio
  parking          INTEGER DEFAULT 0,
  floors           INTEGER DEFAULT 1,
  age_years        INTEGER DEFAULT 0,
  amenities        TEXT[] DEFAULT ARRAY[]::TEXT[],
  credits          TEXT[] DEFAULT ARRAY[]::TEXT[],
  address          TEXT,
  neighborhood     TEXT,
  city             TEXT,
  state            TEXT,
  zip_code         TEXT,
  lat              NUMERIC,
  lng              NUMERIC,
  privacy_level    TEXT DEFAULT 'approximate', -- exact|approximate|neighborhood
  photos           TEXT[] DEFAULT ARRAY[]::TEXT[],
  ai_score         INTEGER DEFAULT 0,
  ai_analysis      JSONB,
  embedding        VECTOR(1536),               -- pgvector para búsqueda semántica
  is_featured      BOOLEAN DEFAULT false,
  publish_portals  BOOLEAN DEFAULT true,
  views_count      INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: leads
```sql
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id       UUID REFERENCES agencies(id) ON DELETE CASCADE,
  agent_id        UUID REFERENCES users(id),
  name            TEXT,
  phone           TEXT NOT NULL,
  email           TEXT,
  city            TEXT,
  status          TEXT DEFAULT 'new',          -- new|contacted|visit_scheduled|visit_done|negotiation|closed|lost
  temperature     TEXT DEFAULT 'cold',         -- hot|warm|cold
  ai_score        INTEGER DEFAULT 0,           -- 0-100 calculado por Claude
  source          TEXT DEFAULT 'whatsapp',     -- whatsapp|portal|referral|direct
  language        TEXT DEFAULT 'es',           -- es|en
  budget_max      NUMERIC,
  preferred_type  TEXT,
  preferred_zones TEXT[],
  min_bedrooms    INTEGER,
  credit_type     TEXT,
  urgency         TEXT,                        -- this_month|3_months|no_rush
  property_id     UUID REFERENCES properties(id),
  notes           TEXT,
  ai_summary      TEXT,
  last_contact_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: conversations
```sql
CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id  UUID REFERENCES agencies(id) ON DELETE CASCADE,
  lead_id    UUID REFERENCES leads(id) ON DELETE CASCADE,
  role       TEXT NOT NULL,         -- bot|agent|client
  content    TEXT NOT NULL,
  language   TEXT DEFAULT 'es',
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: visits
```sql
CREATE TABLE visits (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id    UUID REFERENCES agencies(id) ON DELETE CASCADE,
  lead_id      UUID REFERENCES leads(id),
  property_id  UUID REFERENCES properties(id),
  agent_id     UUID REFERENCES users(id),
  status       TEXT DEFAULT 'pending',  -- pending|confirmed|completed|cancelled|no_show
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INTEGER DEFAULT 60,
  notes        TEXT,
  cancelled_by TEXT,                    -- lead|agent
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Habilitar RLS en TODAS las tablas
ALTER TABLE agencies      ENABLE ROW LEVEL SECURITY;
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties    ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits        ENABLE ROW LEVEL SECURITY;

-- Política base: cada usuario solo ve datos de su agencia
CREATE POLICY "agency_isolation" ON properties
  USING (agency_id = (SELECT agency_id FROM users WHERE id = auth.uid()));

-- Super admin ve todo
CREATE POLICY "super_admin_bypass" ON agencies
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'super_admin');
```

---

## 13. LÓGICA DE NEGOCIO

### Planes y límites
```typescript
const PLANS = {
  solo:       { price_usd: 49,  price_annual: 39,  agents: 1,        properties: 20,  messages: 500  },
  agency:     { price_usd: 149, price_annual: 119, agents: 5,        properties: 50,  messages: 1000 },
  pro:        { price_usd: 299, price_annual: 239, agents: 15,       properties: 150, messages: 5000 },
  enterprise: { price_usd: null,                   agents: Infinity, properties: Infinity, messages: Infinity },
}
// Descuento anual: 20%
```

### Score de lead (Claude calcula)
```
Factores que AUMENTAN el score:
  +20  Confirmó presupuesto específico
  +20  Pidió agendar visita
  +15  Mencionó urgencia ("este mes", "lo antes posible")
  +15  Presupuesto encaja con catálogo
  +10  Respondió en menos de 5 minutos
  +10  Tiene más de 3 interacciones
  +10  Crédito aprobado o disponible

Factores que DISMINUYEN el score:
  -25  Presupuesto fuera del rango de todas las props
  -20  Sin respuesta en 24+ horas
  -15  "Solo estoy viendo" / "Es para el futuro"
  -10  Ya compró o tiene propiedad

Score → temperatura:
  75-100 → hot  🔥 → notificación INMEDIATA al agente
  40-74  → warm 🟡 → seguimiento en 24h
  0-39   → cold 🧊 → seguimiento en 72h
```

---

## 14. INTEGRACIONES EXTERNAS

### Claude API
```typescript
// lib/ai/claude.ts
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-20250514'

// 4 usos principales:
// 1. Bot de WhatsApp — responder mensajes de clientes
// 2. Generar descripciones — portal, WhatsApp, Instagram, inglés
// 3. Analizar fotos (Vision) — detectar tipo, amenidades, acabados
// 4. Score de lead — analizar conversación y calcular probabilidad

// IMPORTANTE: NUNCA llamar desde el cliente (browser)
// Solo desde: /api/webhook/twilio, /api/ai/*, Server Actions
```

### Twilio WhatsApp
```typescript
// lib/whatsapp/twilio.ts
import twilio from 'twilio'
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

// Webhook: POST /api/webhook/twilio
// Parámetros: From (número), Body (mensaje), MessageSid
// Flujo: recibir → buscar/crear lead → Claude responde → enviar por Twilio

async function sendWhatsApp(to: string, body: string) {
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
  })
}
```

### Stripe
```typescript
// Flujo completo de suscripción:
// 1. Agente elige plan → crear Stripe Checkout Session
// 2. Redirect a Stripe → agente ingresa tarjeta
// 3. Stripe redirect a /configuracion/plan?success=true
// 4. Webhook stripe: checkout.session.completed
//    → agency.status = 'active'
//    → agency.stripe_subscription_id = sub.id
// 5. Webhook stripe: invoice.payment_failed
//    → agency.status = 'past_due'
// 6. Webhook stripe: customer.subscription.deleted
//    → agency.status = 'cancelled'
```

### Google Maps
```typescript
// @vis.gl/react-google-maps
// Funciones necesarias:
//   Places Autocomplete — búsqueda de dirección
//   Pin arrastrable     — ubicar propiedad exacta
//   Zona aproximada     — mostrar ±200m en portal público (privacidad)
//   Guardar lat/lng     — en tabla properties
```

---

## 15. STACK TECNOLÓGICO

```
FRONTEND
  Next.js 14          App Router · Server Components · Server Actions
  Tailwind CSS        Utility-first + CSS Variables custom
  Sora                Google Fonts 400/500/600
  next-pwa            PWA manifest + service worker
  Lucide React        Sistema de íconos
  @vis.gl/react-google-maps  Mapas interactivos

BACKEND / BaaS
  Supabase            PostgreSQL · Auth · Storage · Realtime · pgvector
  Supabase Auth       Google OAuth + Magic Link
  Supabase Storage    Fotos (bucket: property-photos)
  Supabase Realtime   Notificaciones en vivo (leads, mensajes)
  Supabase pgvector   Embeddings para búsqueda semántica del bot

INTELIGENCIA ARTIFICIAL
  Claude API          claude-sonnet-4-20250514
  Usos:               Chatbot · Descripciones · Vision · Score leads

COMUNICACIONES
  Twilio              WhatsApp Business API
  Resend              Emails transaccionales

PAGOS
  Stripe              Suscripciones · Checkout · Billing Portal
  Facturapi           CFDI México (Fase 8)

DEPLOY
  Vercel              Frontend + API Routes
  GitHub              Control de versiones (main = producción)

MONITOREO
  Sentry              Errores en producción
  Vercel Analytics    Métricas de uso
```

### Instalación
```bash
npx create-next-app@latest inmoia --typescript --tailwind --app --src-dir

npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install twilio
npm install resend
npm install stripe @stripe/stripe-js
npm install lucide-react
npm install @vis.gl/react-google-maps
npm install next-pwa
npm install @sentry/nextjs
```

---

## 16. ESTRUCTURA DE ARCHIVOS

```
inmoia/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Landing /
│   │   ├── login/page.tsx
│   │   ├── registro/page.tsx           # Onboarding 5 pasos
│   │   ├── recuperar-password/page.tsx
│   │   ├── p/[slug]/page.tsx           # Propiedad pública
│   │   ├── propiedades/page.tsx        # Catálogo público
│   │   ├── terminos/page.tsx
│   │   ├── privacidad/page.tsx
│   │   └── invite/[token]/page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Sidebar + Topbar
│   │   ├── dashboard/page.tsx
│   │   ├── leads/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── propiedades/
│   │   │   ├── page.tsx
│   │   │   ├── nueva/page.tsx
│   │   │   └── [id]/editar/page.tsx
│   │   ├── chatbot/
│   │   │   ├── page.tsx
│   │   │   └── configuracion/page.tsx
│   │   ├── calendario/page.tsx
│   │   ├── reportes/page.tsx
│   │   ├── notificaciones/page.tsx
│   │   └── configuracion/
│   │       ├── page.tsx               # Perfil
│   │       ├── agencia/page.tsx
│   │       ├── marca/page.tsx
│   │       ├── plan/page.tsx
│   │       └── seguridad/page.tsx
│   │
│   ├── (admin)/                        # Solo super_admin
│   │   ├── layout.tsx
│   │   ├── admin/page.tsx
│   │   ├── admin/agencias/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── admin/cobros/page.tsx
│   │   ├── admin/soporte/page.tsx
│   │   └── admin/ajustes/page.tsx
│   │
│   ├── api/
│   │   ├── webhook/
│   │   │   ├── twilio/route.ts         # WhatsApp entrante
│   │   │   └── stripe/route.ts         # Pagos
│   │   └── ai/
│   │       ├── describe/route.ts       # Generar descripciones
│   │       ├── analyze-photos/route.ts # Claude Vision
│   │       └── score-lead/route.ts     # Score de lead
│   │
│   ├── layout.tsx                      # Root layout
│   └── globals.css                     # Variables CSS + reset
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx · Input.tsx · Card.tsx · Toggle.tsx
│   │   ├── Badge.tsx · Chip.tsx · Avatar.tsx · Modal.tsx
│   │   ├── Toast.tsx · Skeleton.tsx · EmptyState.tsx · Spinner.tsx
│   │   └── ProgressBar.tsx · Steps.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx · Topbar.tsx
│   │   ├── BottomNav.tsx · FAB.tsx · PageWrapper.tsx
│   ├── leads/
│   │   ├── LeadCard.tsx · LeadTable.tsx · LeadDetail.tsx
│   │   ├── LeadFilters.tsx · LeadCompare.tsx
│   ├── properties/
│   │   ├── PropertyCard.tsx · PropertyForm.tsx
│   │   ├── PropertyAIOnboarding.tsx · PropertyMap.tsx
│   │   ├── PropertyPublic.tsx · PropertyCompare.tsx
│   ├── chatbot/
│   │   ├── ConversationList.tsx · ConversationView.tsx
│   │   ├── ChatBubble.tsx · BotConfig.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx · RecentLeads.tsx · ChatbotActivity.tsx
│   └── shared/
│       ├── ThemeProvider.tsx · ThemeSelector.tsx · LanguageToggle.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts · server.ts · middleware.ts
│   ├── ai/
│   │   ├── claude.ts · prompts.ts · embeddings.ts
│   ├── whatsapp/
│   │   ├── twilio.ts · bot-handler.ts
│   ├── stripe/
│   │   ├── client.ts · plans.ts
│   └── utils/
│       ├── format.ts · cn.ts · theme.ts · slugify.ts
│
├── types/
│   ├── agency.ts · user.ts · property.ts · lead.ts
│   ├── conversation.ts · visit.ts
│
├── hooks/
│   ├── useUser.ts · useAgency.ts · useTheme.ts
│   ├── useRealtime.ts · useToast.ts
│
└── public/
    ├── manifest.json
    ├── icons/ (icon-192.png · icon-512.png)
    └── og-image.png
```

---

## 17. VARIABLES DE ENTORNO

Crea `.env.local` en la raíz. **NUNCA subir a GitHub.**

```bash
# ── SUPABASE ─────────────────────────────────────
# supabase.com → proyecto → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ── ANTHROPIC ─────────────────────────────────────
# console.anthropic.com → API Keys
# Modelo: claude-sonnet-4-20250514
ANTHROPIC_API_KEY=sk-ant-api03-...

# ── TWILIO ────────────────────────────────────────
# console.twilio.com → Account Info
# Sandbox dev: +1 415 523 8886
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_NUMBER_PROD=+52331234567

# ── STRIPE ────────────────────────────────────────
# dashboard.stripe.com → Developers → API Keys
# Desarrollo: sk_test_ / Producción: sk_live_
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_SOLO_MONTHLY=price_...
STRIPE_PRICE_SOLO_ANNUAL=price_...
STRIPE_PRICE_AGENCY_MONTHLY=price_...
STRIPE_PRICE_AGENCY_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...

# ── RESEND ────────────────────────────────────────
# resend.com → API Keys
# Gratis: 3,000 emails/mes
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hola@inmoia.com
RESEND_FROM_NAME=InmoIA

# ── GOOGLE MAPS ───────────────────────────────────
# console.cloud.google.com → APIs → Maps JavaScript + Places
# Crédito gratis: $200 USD/mes
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIza...

# ── FACTURAPI (Fase 8) ────────────────────────────
# facturapi.io → CFDI México
FACTURAPI_API_KEY=...

# ── APP ───────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=InmoIA
NEXT_PUBLIC_COMPANY=Gamasoft IA Technologies
SUPER_ADMIN_EMAIL=tu@email.com

# ── SENTRY (Fase 9) ───────────────────────────────
SENTRY_DSN=https://...@sentry.io/...
```

### Dónde obtener cada key
| Servicio | URL | Qué copiar |
|---|---|---|
| Supabase | supabase.com → Settings → API | URL + anon key + service role key |
| Anthropic | console.anthropic.com → API Keys | API Key |
| Twilio | console.twilio.com | Account SID + Auth Token |
| Stripe | dashboard.stripe.com → Developers | Secret key + Webhook secret + Publishable key |
| Resend | resend.com | API Key |
| Google Maps | console.cloud.google.com | API Key (restricta a tu dominio) |

---

## 18. SEGURIDAD Y ROLES

### Roles
```typescript
type UserRole = 'super_admin' | 'agency_admin' | 'agent' | 'viewer'

// super_admin  → Solo tú (Gamasoft). /admin. Ve todas las agencias.
// agency_admin → Dueño de agencia. Equipo, config, pagos.
// agent        → Agente. Sus leads y propiedades asignadas.
// viewer       → Solo lectura. Ver reportes sin editar.
```

### Matriz de permisos resumida
```
Acción                     super  admin  agent  viewer
────────────────────────────────────────────────────────
Panel /admin                 ✓      ✗      ✗      ✗
Ver todos los leads          ✓      ✓    propio   ✓
Editar leads                 ✓      ✓      ✓      ✗
Crear/editar propiedades     ✓      ✓    propio   ✗
Configurar chatbot           ✓      ✓      ✗      ✗
Tomar control del chat       ✓      ✓      ✓      ✗
Invitar agentes              ✓      ✓      ✗      ✗
Ver facturación              ✓      ✓      ✗      ✗
Ver reportes                 ✓      ✓      ✗      ✓
```

### Reglas críticas de seguridad
```
1. Claude API: SOLO desde Server — NUNCA exponer ANTHROPIC_API_KEY al cliente
2. Supabase RLS: activo en TODAS las tablas — cada agencia solo ve sus datos
3. Middleware: proteger /dashboard y /admin en middleware.ts
4. Webhooks: verificar firma de Twilio y Stripe antes de procesar
5. .env.local: NUNCA subir a GitHub — verificar .gitignore
```

---

## 19. FLUJOS CRÍTICOS DEL SISTEMA

### Flujo 1 — Lead llega por WhatsApp
```
1. Cliente escribe al WhatsApp de la agencia
2. Twilio → webhook POST /api/webhook/twilio
3. Verificar firma Twilio (seguridad)
4. Buscar agencia por número Twilio
5. Buscar/crear lead por número de teléfono
6. Guardar mensaje en conversations (role: 'client')
7. Recuperar propiedades activas de la agencia
8. Llamar Claude API con historial + catálogo + config bot
9. Claude detecta: idioma, intención, genera respuesta
10. Guardar respuesta en conversations (role: 'bot')
11. Enviar respuesta por Twilio
12. Actualizar ai_score del lead con Claude
13. Si score ≥ 75 → Supabase Realtime → notificación al agente
14. Si pidió visita → agendar automáticamente
```

### Flujo 2 — Nueva propiedad con IA
```
1. Agente sube fotos → Supabase Storage
2. Claude Vision analiza imágenes:
   detecta tipo, recámaras, amenidades, acabados, precio estimado
3. Formulario pre-llenado (campos en color ámbar = detectados por IA)
4. Agente confirma/ajusta + agrega precio y ubicación en el mapa
5. Claude genera 4 descripciones (portal ES, WhatsApp, Instagram, English)
6. Al publicar: status = 'active'
7. Se genera embedding de la propiedad → pgvector
8. Bot la conoce instantáneamente
```

### Flujo 3 — Trial → Pago
```
Día 11: email "Tu trial termina en 3 días"
Día 14: modal conversión con countdown + recap ROI
        → Agente elige plan → Stripe Checkout
        → Stripe webhook: checkout.session.completed
        → agency.status = 'active'
        → Email de bienvenida + CFDI
        → Bot continúa sin interrupción
```

### Flujo 4 — Pago fallido → Suspensión
```
Día 0:  Pago falla → status: past_due → email + WhatsApp al admin
Día 3:  Stripe reintenta → falla → status: suspended
        → Bot se pausa
        → Dashboard muestra banner rojo
        → Leads ven "Servicio no disponible"
Pago exitoso → status: active → bot reactiva instantáneamente
Día 30: status: cancelled → datos preservados 1 año
```

---

## 20. URLs Y RUTAS

### Públicas (sin auth)
```
/                     Landing page
/propiedades          Catálogo público
/p/[slug]             Propiedad pública (ej: /p/casa-coyoacan-210m2-a3f9)
/login                Inicio de sesión (Google + Magic Link)
/registro             Registro + Onboarding 5 pasos
/recuperar-password   Reset de contraseña
/invite/[token]       Aceptar invitación
/terminos             Términos y condiciones
/privacidad           Política de privacidad
```

### Privadas (requieren auth)
```
/dashboard                   Panel principal
/leads                       Lista de leads
/leads/[id]                  Detalle de lead
/propiedades                 Catálogo interno
/propiedades/nueva           Nueva propiedad
/propiedades/[id]/editar     Editar propiedad
/chatbot                     Conversaciones WhatsApp
/chatbot/configuracion       Configurar bot (5 tabs)
/calendario                  Visitas agendadas
/reportes                    Analítica (4 tabs)
/notificaciones              Centro de notificaciones
/configuracion               Perfil del agente
/configuracion/agencia       Datos de la agencia
/configuracion/marca         Marca blanca + tema
/configuracion/plan          Plan y facturación
/configuracion/seguridad     Contraseña y 2FA
```

### Super Admin (solo super_admin)
```
/admin                  Panel general (MRR, agencias, churn)
/admin/agencias         Lista de todas las agencias
/admin/agencias/[id]    Detalle de agencia
/admin/cobros           Historial de pagos
/admin/soporte          Tickets de soporte
/admin/ajustes          Config del sistema
```

### Generación de slugs
```typescript
// Formato: [tipo]-[ciudad]-[m2]m2-[4chars-id]
// Ejemplo: casa-coyoacan-210m2-a3f9
function generateSlug(p: Property): string {
  const normalize = (s: string) => s.toLowerCase()
    .replace(/\s+/g,'-').replace(/[áàä]/g,'a').replace(/[éèë]/g,'e')
    .replace(/[íìï]/g,'i').replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/ñ/g,'n')
  return `${normalize(p.type)}-${normalize(p.city)}-${p.area_total}m2-${p.id.slice(0,4)}`
}
```

---

## 21. EMAILS TRANSACCIONALES

Todos desde `hola@inmoia.com` via Resend.

| Trigger | Asunto | Para |
|---|---|---|
| Registro exitoso | Bienvenido a InmoIA 🏡 | Nuevo agente |
| Invitación | Te invitan a unirse a [agencia] | Agente invitado |
| Visita agendada | Visita confirmada — [fecha] | Lead + Agente |
| Lead caliente | ⚡ Lead caliente: [nombre] (score [X]/100) | Agente |
| Trial termina día 11 | Tu prueba gratis termina en 3 días | Admin agencia |
| Pago exitoso | ✅ Pago procesado — Plan [nombre] | Admin agencia |
| Pago fallido | ⚠️ Acción requerida: actualiza tu tarjeta | Admin agencia |
| Resumen diario | 📊 Resumen del día — [fecha] | Admin agencia |
| Reset contraseña | Código para recuperar tu cuenta | Usuario |

---

## 22. REGLAS DE USO

### ✅ SIEMPRE hacer
```
1.  Variables CSS — NUNCA valores hardcodeados (#BA7517 → var(--brand))
2.  Bordes 0.5px solid — NUNCA 1px en elementos de UI
3.  font-family: var(--font-sans) en TODOS los elementos interactivos
4.  Transición en hover/focus — mínimo var(--t-fast)
5.  outline:none en inputs + border-color:var(--brand) en :focus
6.  Scrollbars: width:3px · color:var(--border-tertiary)
7.  Símbolo ✦ en TODAS las funciones de IA
8.  Skeleton loaders mientras cargan datos async
9.  Empty state cuando una sección no tiene contenido
10. Mobile-first — diseñar para móvil primero
11. RLS activo en Supabase — nunca mezclar datos de agencias
12. Guardar tema en localStorage · leer al montar
13. Claude API solo desde Server (API routes / Server Actions)
14. Verificar permisos de rol antes de mostrar acciones
```

### ❌ NUNCA hacer
```
1.  Colores hardcodeados en JSX o CSS
2.  border:1px en elementos principales de UI
3.  font-family: Arial, Inter, system-ui
4.  Cambiar el background del sidebar (#0F0F1A es fijo)
5.  border-radius > 16px en cards normales
6.  Animaciones > 500ms fuera del onboarding
7.  font-weight: 700 o 800 (solo 400, 500, 600)
8.  Gradientes en botones primarios
9.  Exponer ANTHROPIC_API_KEY al cliente
10. Subir .env.local a GitHub
11. Llamar Claude API desde el browser
12. Omitir el modo oscuro al crear componentes nuevos
```

### Jerarquía de acciones por pantalla
```
1 botón btn-primary  → Acción principal de la página (solo 1)
N botones btn-brand-soft con ✦ → Funciones de IA (los que sean necesarios)
N botones btn-ghost → Acciones secundarias
1 botón btn-danger → Acción destructiva (siempre pedir confirmación)
N botones btn-whatsapp → Solo para enviar mensajes de WhatsApp
```

---

## 23. ORDEN DE CONSTRUCCIÓN — 9 FASES

### FASE 1 — Fundamentos (Semana 1-2)
```
1.  Next.js 14 + Tailwind + Sora configurados
2.  globals.css con TODAS las variables CSS (copiar Sección 2)
3.  Supabase: crear todas las tablas (Sección 12) + RLS activo
4.  Auth: Google OAuth + Magic Link + middleware de rutas
5.  ThemeProvider: cargar tema de localStorage al montar
6.  .env.local con todas las variables (Sección 17)
7.  PWA: manifest.json + next-pwa configurado
```

### FASE 2 — Layout y componentes UI (Semana 2)
```
8.  Sidebar (desktop, siempre fondo #0F0F1A)
9.  Topbar con navegación
10. Bottom navigation (móvil, 5 tabs)
11. FAB (+) para acción principal en móvil
12. Todos los componentes de /components/ui/
    (Button, Input, Card, Toggle, Badge, Chip, Avatar,
     Modal, Toast, Skeleton, EmptyState, Spinner, Steps)
```

### FASE 3 — Flujos públicos (Semana 3)
```
13. Landing page pública (/)
14. Login (Google OAuth + Magic Link)
15. Registro + Onboarding animado 5 pasos
16. Recuperar contraseña (email → código → nueva contraseña)
17. Página 404 personalizada
18. Términos, privacidad y aviso LFPDPPP
```

### FASE 4 — Core del producto (Semana 3-5)
```
19. Dashboard principal (stats + leads recientes + chatbot activity)
20. Lista de propiedades con filtros y búsqueda
21. Formulario nueva propiedad (4 pasos)
22. Onboarding de propiedad con IA ← sube foto → Claude llena todo
23. Página pública de propiedad (/p/[slug]) — bilingüe ES/EN
24. Lista de leads con filtros de temperatura
25. Detalle de lead (5 tabs)
```

### FASE 5 — Chatbot WhatsApp ← PRIORIDAD (Semana 5-6)
```
26. Webhook Twilio (/api/webhook/twilio)
27. Bot handler: Claude API + detección de idioma + score de lead
28. Embeddings de propiedades en pgvector (búsqueda semántica)
29. Vista de conversaciones del chatbot
30. Configuración del bot (5 tabs: Personalidad, Horario, Respuestas, Escalado, Alertas)
```

### FASE 6 — Funciones avanzadas (Semana 6-7)
```
31. Calendario de visitas (vista semanal)
32. Flujo agendar visita (5 pasos)
33. Notificaciones en tiempo real (Supabase Realtime)
34. Reportes y analítica (4 tabs: Leads, Props, Chatbot, ROI)
35. Exportar reportes a PDF
36. Comparar propiedades (tabla lado a lado)
37. Comparar leads (análisis de prioridad)
38. Analizador de fotos con IA (Claude Vision)
39. Búsqueda y filtros avanzados de propiedades
```

### FASE 7 — Configuración y marca (Semana 7-8)
```
40. Perfil del agente (6 tabs)
41. Configuración de marca blanca (logo, emoji, colores)
42. Selector de temas (5 colores en tiempo real)
43. Centro de ayuda + FAQ interactivo
44. Historial de actividad
45. Pantallas de límite de plan
46. Invitar agentes al equipo
```

### FASE 8 — Pagos y Admin (Semana 8-9)
```
47. Stripe: checkout + webhooks + billing portal
48. Planes y suscripciones (Solo/Agencia/Pro)
49. Conversión trial → pago (countdown + ROI recap)
50. Facturación CFDI (Facturapi)
51. Panel Super Admin completo (6 secciones)
```

### FASE 9 — Pulido y lanzamiento (Semana 9-10)
```
52. SEO: metadata dinámica + og:image + sitemap.xml
53. Performance: lazy loading + image optimization + Core Web Vitals
54. Testing de flujos críticos (Playwright)
55. Sentry: monitoreo de errores en producción
56. Deploy a Vercel + dominio inmoia.com
57. Twilio: activar número real de WhatsApp Business
58. Stripe: cambiar a modo live
59. Anunciar lanzamiento 🚀
```

---

## 24. PROTOTIPOS DISPONIBLES EN CLAUDE.AI

Diseñados en la conversación de diseño de InmoIA.
**Cómo usarlos:** screenshot del prototipo → adjuntar en Claude Code → "Construye esta pantalla exactamente".

### Portal del agente (24 pantallas)
```
✅ Dashboard principal
✅ Gestión de leads (tabla + filtros + temperatura)
✅ Catálogo de propiedades
✅ Chatbot WhatsApp (conversaciones en vivo)
✅ Reportes con gráficas (4 tabs: Leads, Props, Chatbot, ROI)
✅ Configuración del chatbot (5 tabs completos)
✅ Nueva propiedad (formulario 4 pasos)
✅ Onboarding de propiedad con IA (foto → Claude llena todo)
✅ Terreno Huatulco bilingüe (ES/EN)
✅ Selector de ubicación con mapa Google Maps
✅ Detalle de lead (5 tabs: Resumen, Conversación, Props, Tareas, Notas)
✅ Calendario de visitas (vista semanal)
✅ Flujo agendar visita (5 pasos)
✅ Analizador de fotos con IA (Claude Vision)
✅ Perfil del agente (6 tabs)
✅ Selector de temas (5 colores en tiempo real)
✅ Notificaciones en tiempo real (con simulador)
✅ Búsqueda y filtros avanzados
✅ Página pública de propiedad (bilingüe ES/EN)
✅ Comparar propiedades (tabla lado a lado)
✅ Comparar leads (análisis de prioridad + IA)
✅ Exportar reportes a PDF (con preview)
✅ Estados vacíos + errores + skeleton loaders
✅ Configuración de marca blanca (preview en tiempo real)
```

### Panel Super Admin (6 pantallas)
```
✅ Resumen general (MRR, agencias, churn, ARR)
✅ Gestión de agencias (tabla completa)
✅ Cobros y facturación (historial exportable)
✅ Soporte (tickets + NPS)
✅ Ajustes del sistema (planes, integraciones)
✅ Detalle de agencia (6 tabs)
```

### Flujos públicos (11 pantallas)
```
✅ Landing page pública completa
✅ Login / registro (Google + WhatsApp OTP + Facebook)
✅ Onboarding animado (5 pasos con slides sincronizados)
✅ Conversión trial a pago (countdown + ROI + garantía 30 días)
✅ Recuperar contraseña (3 pasos: email → código → nueva)
✅ Página 404 personalizada
✅ Invitar agentes al equipo
✅ Centro de ayuda + FAQ interactivo
✅ Historial de actividad
✅ Límites de plan (3 estados: props, mensajes, suspendida)
✅ Términos, privacidad y aviso LFPDPPP
```

### Versión móvil iPhone (4 frames)
```
✅ Dashboard (iPhone 15 Pro Max · Dynamic Island)
✅ Leads con filtros horizontales
✅ Chatbot WhatsApp nativo
✅ Propiedades con FAB (+)
```

---

## 25. PROMPT MAESTRO PARA CLAUDE CODE

> Copia y pega esto COMPLETO al inicio de tu primera sesión.
> Solo una vez — Claude Code lo usará durante toda la sesión.

```
Voy a construir InmoIA — SaaS inmobiliario con IA para México.
Empresa: Gamasoft IA Technologies S.A.S.

══════════════════════════════════════════
STACK
══════════════════════════════════════════
Next.js 14 (App Router) · TypeScript · Tailwind CSS + CSS Variables
Sora (Google Fonts, wght: 400/500/600) · Lucide React · next-pwa
Supabase (PostgreSQL + Auth + Storage + Realtime + pgvector)
Claude API claude-sonnet-4-20250514 · Twilio WhatsApp · Resend · Stripe · Vercel

══════════════════════════════════════════
DESIGN SYSTEM — SEGUIR ESTRICTAMENTE
══════════════════════════════════════════

COLORES — SIEMPRE variables, NUNCA hardcodeados:
  --brand: #BA7517  |  --brand-dark: #854F0B
  --brand-light: #FAEEDA  |  --brand-border: #FAC775  |  --brand-text: #412402
  --bg-primary / --bg-secondary / --bg-tertiary
  --text-primary / --text-secondary / --text-tertiary
  --border-tertiary (para bordes sutiles)

FUENTE: font-family: var(--font-sans) en TODOS los elementos
PESOS: solo 400, 500, 600 — NUNCA 700

BORDES: 0.5px solid (NUNCA 1px) en elementos de UI
RADIUS: cards 12px · botones 8px · full para pills/chips

SIDEBAR: SIEMPRE fondo #0F0F1A — NO cambiar jamás

BOTONES (jerarquía):
  btn-primary    → #0F0F1A negro  (1 por página, acción principal)
  btn-brand-soft → ámbar suave   (funciones IA, con símbolo ✦)
  btn-ghost      → sin fondo     (secundarias)
  btn-danger     → rojo suave    (destructivas)
  btn-whatsapp   → #25D366       (solo para WhatsApp)

SÍMBOLO ✦: identifica TODA función de IA. Siempre con texto.
TEMA: 5 opciones (amber/green/blue/coral/purple), guardar en localStorage
SCROLLBARS: width:3px · color:var(--border-tertiary)
INPUTS: outline:none + border-color:var(--brand) en :focus

══════════════════════════════════════════
SEGURIDAD
══════════════════════════════════════════
· Claude API: SOLO desde Server — NUNCA exponer key al cliente
· Supabase RLS: activo en todas las tablas
· Middleware: proteger /dashboard/* y /admin/*
· .env.local: NUNCA a GitHub

══════════════════════════════════════════
ROLES
══════════════════════════════════════════
super_admin | agency_admin | agent | viewer

══════════════════════════════════════════
ESTADOS CLAVE
══════════════════════════════════════════
Propiedad: draft|active|paused|sold|rented|archived
Lead temp:  hot 🔥(≥75) | warm 🟡(40-74) | cold 🧊(<40)
Agencia:    trial|active|past_due|suspended|cancelled

══════════════════════════════════════════
RESPONSIVE
══════════════════════════════════════════
Mobile: bottom nav (5 tabs) + FAB (+) + filtros scroll horizontal
Desktop: sidebar 220px + layout dos columnas
PWA: manifest.json para iPhone (display:standalone)

══════════════════════════════════════════
TENGO 40+ PROTOTIPOS VISUALES
══════════════════════════════════════════
Diseñados en claude.ai. Al construir cada pantalla
te mostraré el screenshot para que lo repliques exactamente.
Mismo layout, mismos colores, mismos componentes.

══════════════════════════════════════════
EMPIEZA AHORA — FASE 1
══════════════════════════════════════════
Crea la estructura completa del proyecto:

1. Next.js 14 con TypeScript + Tailwind
2. globals.css con TODAS las variables CSS del Design System
3. Fuente Sora importada en layout.tsx
4. Estructura de carpetas completa (app/, components/, lib/, types/, hooks/)
5. .env.local.example con todas las variables necesarias
6. next.config.ts con next-pwa configurado
7. public/manifest.json para PWA
8. tailwind.config.ts con breakpoints y configuración
9. middleware.ts para protección de rutas
10. lib/utils/cn.ts (classNames utility)
```

---

*InmoIA Design System v2.0 — Documento definitivo y completo*
*Gamasoft IA Technologies S.A.S. · Abril 2026*
*25 secciones · Todo lo necesario para construir InmoIA con Claude Code*
