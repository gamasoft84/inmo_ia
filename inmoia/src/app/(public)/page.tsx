import Link from 'next/link';

const feats = [
  {
    icon: '💬',
    title: 'Chatbot WhatsApp 24/7',
    desc: 'Sofía responde, califica y agenda visitas automáticamente mientras duermes.',
  },
  {
    icon: '✦',
    title: 'IA genera tus descripciones',
    desc: 'Sube fotos y la IA crea el anuncio con precio, atributos y copy persuasivo.',
  },
  {
    icon: '📊',
    title: 'CRM inteligente',
    desc: 'Score automático por comportamiento. Siempre sabes a quién llamar primero.',
  },
  {
    icon: '📅',
    title: 'Agenda visitas sola',
    desc: 'El bot coordina fechas con el lead y bloquea tu calendario. Sin ir y venir.',
  },
];

const steps = [
  { num: '1', title: 'Conéctate en 3 min', desc: 'Vinculas tu WhatsApp Business y subes tus propiedades.' },
  { num: '2', title: 'La IA aprende', desc: 'Sofía estudia tu catálogo y empieza a responder con contexto real.' },
  { num: '3', title: 'Recibe leads calientes', desc: 'El CRM te entrega cada día los contactos listos para cerrar.' },
];

const plans = [
  { name: 'Solo', price: '$49', period: 'USD/mes', agents: '1 agente', msgs: '500 mensajes/mes', badge: null },
  { name: 'Agencia', price: '$149', period: 'USD/mes', agents: '5 agentes', msgs: '1,000 mensajes/mes', badge: 'MÁS POPULAR' },
  { name: 'Pro', price: '$299', period: 'USD/mes', agents: '15 agentes', msgs: '5,000 mensajes/mes', badge: null },
];

const testimonials = [
  {
    quote: 'InmoIA triplicó mis leads en el primer mes. Sofía responde más rápido que cualquier asistente humano.',
    name: 'Luis Aguilar',
    role: 'Agencia Aguilar · Guadalajara',
    initials: 'LA',
  },
  {
    quote: 'Antes perdía leads en la madrugada. Ahora el bot agenda visitas mientras duermo. ROI brutal.',
    name: 'Ana Torres',
    role: 'Realty Santa Fe · CDMX',
    initials: 'AT',
  },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#0F0F1A', color: '#fff', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(255,255,255,0.06)', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🌊</span>
          <span style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>InmoIA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/login" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', padding: '8px 14px' }}>Iniciar sesión</Link>
          <Link href="/registro" style={{ fontSize: '13px', fontWeight: 500, color: '#fff', textDecoration: 'none', background: 'var(--brand)', padding: '8px 16px', borderRadius: '8px' }}>Empezar gratis →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(186,117,23,0.15)', border: '0.5px solid rgba(186,117,23,0.4)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#FAC775', marginBottom: '24px' }}>
          <span>✦</span> IA para inmobiliarias — México y LATAM
        </div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '20px' }}>
          Tu agencia vende más<br />
          mientras la <span style={{ color: 'var(--brand)' }}>IA trabaja</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 32px' }}>
          Chatbot WhatsApp 24/7 · CRM inteligente · Descripciones con IA<br />
          Todo en una plataforma para agencias inmobiliarias modernas.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
          <Link href="/registro" style={{ background: 'var(--brand)', color: '#fff', textDecoration: 'none', padding: '13px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
            Empezar gratis — 14 días sin tarjeta →
          </Link>
          <a href="#como-funciona" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.15)', padding: '13px 24px', borderRadius: '8px', fontSize: '14px' }}>
            Ver cómo funciona
          </a>
        </div>
        {/* STATS */}
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ val: '33x', label: 'ROI PROMEDIO' }, { val: '24/7', label: 'BOT ACTIVO' }, { val: '3 min', label: 'SETUP' }, { val: '< 2s', label: 'RESPUESTA IA' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 500, color: 'var(--brand)' }}>{s.val}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--brand)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>FUNCIONALIDADES</p>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 500, color: '#1A1A2E', letterSpacing: '-0.02em', marginBottom: '48px' }}>Todo lo que tu agencia necesita</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {feats.map(f => (
              <div key={f.title} style={{ background: '#F7F6F3', borderRadius: '12px', padding: '24px', border: '0.5px solid #EBEBEB' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: '#9090A8', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '80px 24px', background: '#0F0F1A' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--brand)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>CÓMO FUNCIONA</p>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '48px' }}>En producción en menos de una hora</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', gap: '20px', position: 'relative', paddingBottom: i < steps.length - 1 ? '32px' : '0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 500, flexShrink: 0 }}>{s.num}</div>
                  {i < steps.length - 1 && <div style={{ width: '1px', flex: 1, background: 'rgba(186,117,23,0.25)', marginTop: '6px' }}></div>}
                </div>
                <div style={{ paddingTop: '6px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" style={{ padding: '80px 24px', background: '#F7F6F3' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--brand)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>PRECIOS</p>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 500, color: '#1A1A2E', letterSpacing: '-0.02em', marginBottom: '8px' }}>Simple y transparente</h2>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9090A8', marginBottom: '48px' }}>14 días gratis · Sin tarjeta · Cancela cuando quieras</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', maxWidth: '820px', margin: '0 auto' }}>
            {plans.map(p => (
              <div key={p.name} style={{ background: p.badge ? 'var(--brand-light)' : '#fff', border: `1.5px solid ${p.badge ? 'var(--brand)' : '#EBEBEB'}`, borderRadius: '12px', padding: '24px', position: 'relative', textAlign: 'center' }}>
                {p.badge && <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--brand)', color: '#fff', fontSize: '9px', fontWeight: 600, padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap', letterSpacing: '0.06em' }}>{p.badge}</div>}
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E', marginBottom: '8px' }}>{p.name}</div>
                <div style={{ fontSize: '32px', fontWeight: 500, color: 'var(--brand-dark)' }}>{p.price}</div>
                <div style={{ fontSize: '11px', color: '#9090A8', marginBottom: '16px' }}>{p.period}</div>
                <div style={{ fontSize: '12px', color: '#4A4A6A', marginBottom: '4px' }}>{p.agents}</div>
                <div style={{ fontSize: '12px', color: '#4A4A6A', marginBottom: '20px' }}>{p.msgs}</div>
                <Link href="/registro" style={{ display: 'block', background: p.badge ? 'var(--brand)' : '#0F0F1A', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
                  Empezar gratis →
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9090A8', marginTop: '24px' }}>✓ Garantía de 30 días · ✓ CFDI incluido · ✓ Soporte en español</p>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{ padding: '80px 24px', background: '#0F0F1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--brand)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>TESTIMONIOS</p>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '48px' }}>Agencias que ya venden más</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '20px' }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '20px' }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--brand-dark)', border: '1.5px solid var(--brand-border)', flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 24px', background: 'var(--brand)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '12px', letterSpacing: '-0.02em' }}>¿Listo para vender más?</h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', marginBottom: '28px' }}>Empieza gratis hoy. Sin tarjeta. Sin contratos.</p>
        <Link href="/registro" style={{ display: 'inline-block', background: '#0F0F1A', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
          Empezar prueba de 14 días →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A0A14', borderTop: '0.5px solid rgba(255,255,255,0.05)', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🌊</span>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>InmoIA</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginLeft: '8px' }}>Gamasoft IA Technologies S.A.S.</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { href: '/terminos', label: 'Términos' },
            { href: '/privacidad', label: 'Privacidad' },
            { href: '/aviso-lfpdppp', label: 'Aviso LFPDPPP' },
            { href: '/login', label: 'Iniciar sesión' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
      </footer>

    </div>
  );
}

