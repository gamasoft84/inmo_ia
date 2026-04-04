'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function normalizeAuthError(message: string) {
  if (message.includes('Unsupported provider')) {
    return 'Google OAuth no está habilitado en Supabase. Activa el proveedor Google en Authentication > Providers y configura su Client ID/Secret.';
  }

  if (message.includes('No auth payload')) {
    return 'No se recibió la respuesta de autenticación. Intenta iniciar sesión nuevamente.';
  }

  return message;
}

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlError = new URLSearchParams(window.location.search).get('error');
    if (urlError) {
      setError(normalizeAuthError(urlError));
    }
  }, []);

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);

    try {
      const nextPath = new URLSearchParams(window.location.search).get('next') || '/dashboard';
      const redirectTo = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (oauthError) {
        setError(normalizeAuthError(oauthError.message));
        setLoading(false);
        return;
      }

      if (!data?.url) {
        setError('No fue posible iniciar Google OAuth. Verifica la configuración del proveedor en Supabase e intenta nuevamente.');
        setLoading(false);
        return;
      }

      window.location.assign(data.url);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Ocurrió un error inesperado al iniciar sesión con Google.';
      setError(normalizeAuthError(message));
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError('');
    setLoading(true);

    const nextPath = new URLSearchParams(window.location.search).get('next') || '/dashboard';
    const emailRedirectTo = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });

    if (otpError) {
      setError(normalizeAuthError(otpError.message));
      setLoading(false);
      return;
    }

    setLoading(false);
    setSent(true);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-sans)' }}>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '32px' }}>
        <span style={{ fontSize: '22px' }}>🌊</span>
        <span style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>InmoIA</span>
      </Link>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

        {sent ? (
          /* Sent state */
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📬</div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E', marginBottom: '8px' }}>Revisa tu email</div>
            <div style={{ fontSize: '13px', color: '#9090A8', lineHeight: 1.6 }}>
              Enviamos un enlace de acceso a <strong style={{ color: '#4A4A6A' }}>{email}</strong>.<br />
              Válido por 10 minutos. Revisa spam si no aparece.
            </div>
            <button
              onClick={() => setSent(false)}
              style={{ marginTop: '24px', fontSize: '12px', color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Usar otro email
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '20px', fontWeight: 500, color: '#1A1A2E', marginBottom: '4px' }}>Iniciar sesión</div>
              <div style={{ fontSize: '13px', color: '#9090A8' }}>Bienvenido de regreso a InmoIA</div>
            </div>

            {/* Social auth */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '0.5px solid #D4D0C8', borderRadius: '8px', background: '#fff', color: '#4A4A6A', fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', transition: 'background 200ms', opacity: loading ? 0.7 : 1 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F7F6F3')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <span style={{ fontSize: '16px' }}>🔴</span>
                {loading ? 'Conectando con Google...' : 'Continuar con Google'}
              </button>

              <button
                type="button"
                disabled
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '0.5px solid #D4D0C8', borderRadius: '8px', background: '#fff', color: '#9090A8', fontSize: '13px', cursor: 'not-allowed', width: '100%' }}
              >
                <span style={{ fontSize: '16px' }}>🟢</span>
                WhatsApp OTP (próximamente)
              </button>
            </div>

            {error ? (
              <div style={{ marginBottom: '12px', border: '0.5px solid #F7C1C1', background: '#FCEBEB', color: '#A32D2D', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' }}>
                {error}
              </div>
            ) : null}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '0.5px', background: '#E0DDD8' }} />
              <span style={{ fontSize: '11px', color: '#9090A8' }}>o con email</span>
              <div style={{ flex: 1, height: '0.5px', background: '#E0DDD8' }} />
            </div>

            {/* Magic link form */}
            <form onSubmit={handleMagicLink}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '10px', color: '#9090A8', letterSpacing: '0.03em', marginBottom: '5px', textTransform: 'uppercase' }}>EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="tu@agencia.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', border: '0.5px solid #D4D0C8', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#1A1A2E', outline: 'none', transition: 'border-color 200ms' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                  onBlur={e => (e.target.style.borderColor = '#D4D0C8')}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                style={{ width: '100%', background: loading ? '#9090A8' : '#0F0F1A', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '13px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 200ms' }}
              >
                {loading ? 'Enviando...' : 'Enviar magic link →'}
              </button>
            </form>

            {/* Footer links */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9090A8', marginBottom: '6px' }}>
                ¿No tienes cuenta?{' '}
                <Link href="/registro" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>Regístrate gratis</Link>
              </div>
              <div style={{ fontSize: '12px', color: '#9090A8' }}>
                <Link href="/recuperar-password" style={{ color: '#9090A8', textDecoration: 'none' }}>¿Problemas para acceder?</Link>
              </div>
            </div>
          </>
        )}
      </div>

      <p style={{ marginTop: '24px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        Al continuar aceptas nuestros{' '}
        <Link href="/terminos" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Términos</Link>
        {' '}y{' '}
        <Link href="/privacidad" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacidad</Link>
      </p>
    </div>
  );
}

