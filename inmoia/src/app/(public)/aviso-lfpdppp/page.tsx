import Link from 'next/link';

const sections = [
  {
    num: 'I',
    title: 'IDENTIDAD Y DOMICILIO DEL RESPONSABLE',
    content:
      'Gamasoft IA Technologies S.A.S., con operaciones en México, es responsable del tratamiento de los datos personales recabados a través de InmoIA.',
  },
  {
    num: 'II',
    title: 'DATOS PERSONALES RECABADOS',
    content:
      'Podemos recabar nombre, correo electrónico, teléfono, datos de agencia, preferencias comerciales y datos de navegación necesarios para operar la plataforma.',
  },
  {
    num: 'III',
    title: 'FINALIDADES PRIMARIAS',
    content:
      'Los datos se tratan para identificación, autenticación, prestación del servicio, soporte, facturación, prevención de fraude y cumplimiento de obligaciones legales.',
  },
  {
    num: 'IV',
    title: 'FINALIDADES SECUNDARIAS',
    content:
      'Con su consentimiento, podremos usar datos para mejoras de producto, analítica y comunicaciones de novedades. Puede oponerse en cualquier momento.',
    highlight:
      'Puede limitar el uso y divulgación enviando su solicitud a privacidad@inmoia.com con asunto "Limitación de uso de datos".',
  },
  {
    num: 'V',
    title: 'DERECHOS ARCO',
    content:
      'Usted puede ejercer Acceso, Rectificación, Cancelación u Oposición enviando solicitud a privacidad@inmoia.com. Responderemos en un máximo de 20 días hábiles.',
  },
  {
    num: 'VI',
    title: 'TRANSFERENCIAS DE DATOS',
    content:
      'Sus datos pueden transferirse a encargados tecnológicos para operar InmoIA, bajo estrictas obligaciones de confidencialidad y seguridad.',
  },
  {
    num: 'VII',
    title: 'MEDIDAS DE SEGURIDAD',
    content:
      'Aplicamos controles técnicos y administrativos: cifrado en tránsito, controles de acceso, auditorías internas y políticas de seguridad por rol.',
  },
  {
    num: 'VIII',
    title: 'CAMBIOS AL AVISO',
    content:
      'Este aviso puede actualizarse por cambios normativos o del servicio. Publicaremos modificaciones en esta misma página.',
  },
];

export default function AvisoLFPDPPPPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F3', fontFamily: 'var(--font-sans)' }}>
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #EBEBEB', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <span style={{ fontSize: '18px' }}>🌊</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E' }}>InmoIA</span>
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/terminos" style={{ fontSize: '12px', color: '#9090A8', textDecoration: 'none' }}>Términos</Link>
          <Link href="/privacidad" style={{ fontSize: '12px', color: '#9090A8', textDecoration: 'none' }}>Privacidad</Link>
        </div>
      </nav>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', background: '#fff', border: '0.5px solid #D4D0C8', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: '#9090A8', marginBottom: '16px' }}>🇲🇽 Aviso legal</div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A2E', letterSpacing: '-0.02em', marginBottom: '8px' }}>Aviso de privacidad integral (LFPDPPP)</h1>
          <div style={{ fontSize: '12px', color: '#9090A8', lineHeight: 1.7 }}>
            Ley Federal de Protección de Datos Personales en Posesión de los Particulares<br />
            Última actualización: 2 de abril de 2026
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sections.map(s => (
            <section key={s.num} style={{ background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#9090A8', letterSpacing: '0.06em', marginBottom: '6px' }}>SECCIÓN {s.num}</div>
              <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E', marginBottom: '10px' }}>{s.title}</h2>
              <p style={{ fontSize: '13px', color: '#4A4A6A', lineHeight: 1.7, margin: 0 }}>{s.content}</p>
              {s.highlight && (
                <div style={{ marginTop: '12px', background: 'var(--brand-light)', borderLeft: '3px solid var(--brand)', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: '12px', color: 'var(--brand-text)', lineHeight: 1.6 }}>
                  {s.highlight}
                </div>
              )}
            </section>
          ))}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#9090A8' }}>
          Contacto para privacidad: <a href="mailto:privacidad@inmoia.com" style={{ color: 'var(--brand)', textDecoration: 'none' }}>privacidad@inmoia.com</a>
        </div>
      </main>
    </div>
  );
}
