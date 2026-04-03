import Link from 'next/link';

const sections = [
  {
    num: '1',
    title: 'ACEPTACIÓN DE TÉRMINOS',
    content: 'Al registrarse y utilizar InmoIA, usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los mismos, no podrá acceder al servicio.',
  },
  {
    num: '2',
    title: 'DESCRIPCIÓN DEL SERVICIO',
    content: 'InmoIA es una plataforma SaaS que proporciona herramientas de inteligencia artificial para agencias inmobiliarias, incluyendo chatbot de WhatsApp, CRM, generación de descripciones y gestión de leads.',
  },
  {
    num: '3',
    title: 'CUENTAS DE USUARIO',
    content: 'Usted es responsable de mantener la confidencialidad de sus credenciales de acceso. Notifique inmediatamente cualquier uso no autorizado de su cuenta a soporte@inmoia.com.',
  },
  {
    num: '4',
    title: 'PLANES Y PAGOS',
    content: 'Los pagos se procesan mediante Stripe de forma segura. Los planes se cobran mensualmente de manera recurrente. Se otorga un período de gracia de 3 días ante pagos fallidos antes de suspender el acceso.',
    highlight: 'Garantía de 30 días sin riesgo: si no está satisfecho con el servicio, realizamos el reembolso completo sin preguntas.',
  },
  {
    num: '5',
    title: 'CANCELACIÓN',
    content: 'Puede cancelar su suscripción en cualquier momento desde el panel de configuración. El acceso al servicio se mantiene hasta el final del período ya pagado. No se realizan reembolsos parciales por tiempo no utilizado, salvo la garantía de 30 días.',
  },
  {
    num: '6',
    title: 'LIMITACIÓN DE RESPONSABILIDAD',
    content: 'InmoIA no se hace responsable de pérdidas de datos, oportunidades de negocio o cualquier daño indirecto derivado del uso del servicio. La responsabilidad máxima está limitada al valor pagado en los últimos 3 meses.',
  },
  {
    num: '7',
    title: 'PROPIEDAD INTELECTUAL',
    content: 'Todo el contenido generado por la IA pertenece al usuario que lo generó. InmoIA retiene los derechos sobre la plataforma, algoritmos y tecnología subyacente.',
  },
  {
    num: '8',
    title: 'LEY APLICABLE',
    content: 'Estos términos se rigen por las leyes de México. Cualquier disputa se resolverá en los tribunales competentes de la Ciudad de México, México.',
  },
];

export default function TerminosPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F3', fontFamily: 'var(--font-sans)' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #EBEBEB', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <span style={{ fontSize: '18px' }}>🌊</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E' }}>InmoIA</span>
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/privacidad" style={{ fontSize: '12px', color: '#9090A8', textDecoration: 'none' }}>Privacidad</Link>
          <Link href="/aviso-lfpdppp" style={{ fontSize: '12px', color: '#9090A8', textDecoration: 'none' }}>Aviso LFPDPPP</Link>
          <Link href="/login" style={{ fontSize: '12px', color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>Iniciar sesión</Link>
        </div>
      </nav>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', background: '#fff', border: '0.5px solid #D4D0C8', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: '#9090A8', marginBottom: '16px' }}>📄 Documento legal</div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A2E', letterSpacing: '-0.02em', marginBottom: '8px' }}>Términos y condiciones de uso</h1>
          <div style={{ fontSize: '12px', color: '#9090A8', lineHeight: 1.7 }}>
            Última actualización: 1 de abril de 2026 · Versión 1.0<br />
            Gamasoft IA Technologies S.A.S.
          </div>
        </div>

        {/* TOC */}
        <div style={{ background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#9090A8', letterSpacing: '0.06em', marginBottom: '12px' }}>ÍNDICE</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {sections.map(s => (
              <a key={s.num} href={`#s${s.num}`} style={{ fontSize: '12px', color: 'var(--brand)', textDecoration: 'none', display: 'flex', gap: '6px' }}>
                <span style={{ color: '#9090A8' }}>{s.num}.</span> {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {sections.map(s => (
            <div key={s.num} id={`s${s.num}`} style={{ background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#9090A8', letterSpacing: '0.06em', marginBottom: '6px' }}>SECCIÓN {s.num}</div>
              <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E', marginBottom: '12px' }}>{s.title}</h2>
              <p style={{ fontSize: '13px', color: '#4A4A6A', lineHeight: 1.7, margin: 0 }}>{s.content}</p>
              {s.highlight && (
                <div style={{ marginTop: '12px', background: 'var(--brand-light)', borderLeft: '3px solid var(--brand)', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: '12px', color: 'var(--brand-text)', lineHeight: 1.6 }}>
                  {s.highlight}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#9090A8' }}>
          ¿Preguntas? Escríbenos a{' '}
          <a href="mailto:legal@inmoia.com" style={{ color: 'var(--brand)', textDecoration: 'none' }}>legal@inmoia.com</a>
        </div>
      </main>
    </div>
  );
}
