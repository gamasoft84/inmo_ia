import Link from 'next/link';

const sections = [
  {
    num: '1',
    title: 'RESPONSABLE DEL TRATAMIENTO',
    content: 'Gamasoft IA Technologies S.A.S. con domicilio en México, D.F., es el responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).',
  },
  {
    num: '2',
    title: 'DATOS QUE RECOPILAMOS',
    content: 'Recopilamos: nombre completo, dirección de correo electrónico, número de WhatsApp, información de su agencia inmobiliaria, datos de leads captados a través de la plataforma, y datos de uso del servicio para mejorar la experiencia.',
  },
  {
    num: '3',
    title: 'FINALIDADES DEL TRATAMIENTO',
    content: 'Sus datos se utilizan para: (a) prestar el servicio contratado, (b) gestionar su cuenta y facturación, (c) enviar comunicaciones relacionadas con el servicio, (d) mejorar las funcionalidades de la plataforma mediante análisis estadístico.',
    highlight: 'Sus datos no se venden, alquilan ni comparten con terceros con fines publicitarios.',
  },
  {
    num: '4',
    title: 'BASE LEGAL',
    content: 'El tratamiento de sus datos se basa en la ejecución del contrato de servicio, el cumplimiento de obligaciones legales applicables en México, y en algunos casos, en su consentimiento explícito.',
  },
  {
    num: '5',
    title: 'TRANSFERENCIA DE DATOS',
    content: 'Sus datos pueden ser transferidos a proveedores de infraestructura (Supabase/AWS, Anthropic) únicamente para la prestación del servicio, siempre bajo acuerdos de confidencialidad. Estos proveedores pueden estar ubicados fuera de México.',
  },
  {
    num: '6',
    title: 'DERECHOS ARCO',
    content: 'Conforme a la LFPDPPP, usted tiene derechos de Acceso, Rectificación, Cancelación y Oposición sobre sus datos personales. Para ejercerlos, envíe un correo a privacidad@inmoia.com con asunto "Derechos ARCO".',
    highlight: 'Responderemos su solicitud en un plazo máximo de 20 días hábiles.',
  },
  {
    num: '7',
    title: 'COOKIES Y TECNOLOGÍAS DE RASTREO',
    content: 'Utilizamos cookies estrictamente necesarias para el funcionamiento del servicio (autenticación, preferencias de interfaz). No utilizamos cookies publicitarias de terceros.',
  },
  {
    num: '8',
    title: 'SEGURIDAD',
    content: 'Implementamos medidas técnicas y organizativas para proteger sus datos: cifrado en tránsito (TLS 1.3), cifrado en reposo, autenticación de dos factores y revisiones periódicas de seguridad.',
  },
  {
    num: '9',
    title: 'RETENCIÓN DE DATOS',
    content: 'Conservamos sus datos durante la vigencia del contrato y hasta 5 años después de su cancelación, según las obligaciones fiscales y legales en México. Los datos de leads se eliminan a petición del usuario.',
  },
  {
    num: '10',
    title: 'MODIFICACIONES',
    content: 'Podemos actualizar este aviso de privacidad. Le notificaremos por correo electrónico con al menos 30 días de anticipación ante cambios materiales. El uso continuado del servicio implica aceptación.',
  },
];

export default function PrivacidadPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F3', fontFamily: 'var(--font-sans)' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #EBEBEB', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <span style={{ fontSize: '18px' }}>🌊</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E' }}>InmoIA</span>
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/terminos" style={{ fontSize: '12px', color: '#9090A8', textDecoration: 'none' }}>Términos</Link>
          <Link href="/aviso-lfpdppp" style={{ fontSize: '12px', color: '#9090A8', textDecoration: 'none' }}>Aviso LFPDPPP</Link>
          <Link href="/login" style={{ fontSize: '12px', color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>Iniciar sesión</Link>
        </div>
      </nav>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', background: '#fff', border: '0.5px solid #D4D0C8', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: '#9090A8', marginBottom: '16px' }}>🔐 Aviso de privacidad</div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A2E', letterSpacing: '-0.02em', marginBottom: '8px' }}>Política de privacidad</h1>
          <div style={{ fontSize: '12px', color: '#9090A8', lineHeight: 1.7 }}>
            Última actualización: 1 de abril de 2026 · Versión 1.0<br />
            Cumple: LFPDPPP (México) · GDPR · CCPA<br />
            Gamasoft IA Technologies S.A.S.
          </div>
        </div>

        {/* Compliance badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {['🇲🇽 LFPDPPP', '🇪🇺 GDPR', '🇺🇸 CCPA', '🔒 TLS 1.3', '✓ Cifrado AES-256'].map(badge => (
            <div key={badge} style={{ background: '#fff', border: '0.5px solid #D4D0C8', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: '#4A4A6A' }}>{badge}</div>
          ))}
        </div>

        {/* TOC */}
        <div style={{ background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#9090A8', letterSpacing: '0.06em', marginBottom: '12px' }}>ÍNDICE</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {sections.map(s => (
              <a key={s.num} href={`#p${s.num}`} style={{ fontSize: '12px', color: 'var(--brand)', textDecoration: 'none', display: 'flex', gap: '6px' }}>
                <span style={{ color: '#9090A8' }}>{s.num}.</span> {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {sections.map(s => (
            <div key={s.num} id={`p${s.num}`} style={{ background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#9090A8', letterSpacing: '0.06em', marginBottom: '6px' }}>ARTÍCULO {s.num}</div>
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

        {/* ARCO request */}
        <div style={{ marginTop: '32px', background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E', marginBottom: '6px' }}>Ejerce tus derechos ARCO</div>
          <div style={{ fontSize: '13px', color: '#9090A8', marginBottom: '16px' }}>Acceso · Rectificación · Cancelación · Oposición</div>
          <a href="mailto:privacidad@inmoia.com?subject=Derechos%20ARCO" style={{ display: 'inline-block', background: 'var(--brand)', color: '#fff', textDecoration: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
            Enviar solicitud →
          </a>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#9090A8' }}>
          ¿Preguntas? Escríbenos a{' '}
          <a href="mailto:privacidad@inmoia.com" style={{ color: 'var(--brand)', textDecoration: 'none' }}>privacidad@inmoia.com</a>
        </div>
      </main>
    </div>
  );
}
