import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-sans)' }}>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '48px' }}>
        <span style={{ fontSize: '20px' }}>🌊</span>
        <span style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>InmoIA</span>
      </Link>

      {/* 404 block */}
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
          <span style={{ fontSize: '120px', fontWeight: 500, color: '#E0DDD8', lineHeight: 1, display: 'block', letterSpacing: '-4px' }}>404</span>
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '44px', lineHeight: 1 }}>🏠</span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#1A1A2E', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Esta página no existe
        </h1>
        <p style={{ fontSize: '14px', color: '#9090A8', lineHeight: 1.7, marginBottom: '32px' }}>
          La propiedad puede haber sido vendida o la URL es incorrecta.<br />
          Usa el buscador para encontrar lo que necesitas.
        </p>

        {/* Search */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
          <input
            type="text"
            placeholder="Buscar propiedades..."
            style={{ flex: 1, border: '0.5px solid #D4D0C8', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#1A1A2E', outline: 'none', background: '#fff', fontFamily: 'var(--font-sans)' }}
          />
          <button style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', flexShrink: 0 }}>
            Buscar
          </button>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', background: 'var(--brand)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
            🏠 Ir al dashboard
          </Link>
          <Link href="/" style={{ textDecoration: 'none', background: '#fff', color: '#4A4A6A', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', border: '0.5px solid #D4D0C8' }}>
            ← Página de inicio
          </Link>
        </div>

        {/* WhatsApp fallback */}
        <p style={{ marginTop: '32px', fontSize: '12px', color: '#9090A8' }}>
          ¿Necesitas ayuda?{' '}
          <a href="https://wa.me/5213312345678" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>
            Escríbenos por WhatsApp →
          </a>
        </p>
      </div>
    </div>
  );
}
