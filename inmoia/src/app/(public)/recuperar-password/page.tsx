'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Step = 1 | 2 | 3;

function StrengthBar({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  const colors = ['#E0DDD8', '#A32D2D', '#D85A30', 'var(--brand)', '#3B6D11'];

  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= score ? colors[score] : '#E0DDD8', transition: 'background 200ms' }} />
        ))}
      </div>
      {password && <div style={{ fontSize: '10px', color: colors[score], marginTop: '3px' }}>{labels[score]}</div>}
    </div>
  );
}

export default function RecuperarPasswordPage() {
  const supabase = createClient();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '0.5px solid #D4D0C8', borderRadius: '8px',
    padding: '10px 12px', fontSize: '13px', color: '#1A1A2E', outline: 'none', fontFamily: 'var(--font-sans)',
  };

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/recuperar-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStep(2);
  }

  async function handleStep2() {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: fullCode,
      type: 'recovery',
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStep(3);
  }

  async function handleStep3(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword || password.length < 8) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  function handleCodeInput(i: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleCodeKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  const maskEmail = (e: string) => e.replace(/(.{2}).+(@.+)/, '$1···$2');

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-sans)' }}>

      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '32px' }}>
        <span style={{ fontSize: '22px' }}>🌊</span>
        <span style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>InmoIA</span>
      </Link>

      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

        {/* Step indicator */}
        {!done && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            {[1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: s < 3 ? 1 : 0 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, flexShrink: 0, background: s < step ? '#EAF3DE' : s === step ? 'var(--brand)' : '#F0EDE8', color: s < step ? '#3B6D11' : s === step ? '#fff' : '#9090A8' }}>
                  {s < step ? '✓' : s}
                </div>
                {i < 2 && <div style={{ flex: 1, height: '1px', background: s < step ? '#C0DD97' : '#E0DDD8' }} />}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ marginBottom: '12px', border: '0.5px solid #F7C1C1', background: '#FCEBEB', color: '#A32D2D', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' }}>
            {error}
          </div>
        )}

        {/* DONE */}
        {done && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E', marginBottom: '8px' }}>Contraseña actualizada</div>
            <div style={{ fontSize: '13px', color: '#9090A8', marginBottom: '24px' }}>Ya puedes iniciar sesión con tu nueva contraseña.</div>
            <Link href="/login" style={{ display: 'block', background: '#0F0F1A', color: '#fff', textDecoration: 'none', padding: '11px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>Ir a iniciar sesión →</Link>
          </div>
        )}

        {/* STEP 1 — Email */}
        {!done && step === 1 && (
          <form onSubmit={handleStep1}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A2E', marginBottom: '4px' }}>Recuperar acceso</div>
              <div style={{ fontSize: '13px', color: '#9090A8' }}>Te enviamos un código de verificación.</div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#9090A8', letterSpacing: '0.04em', marginBottom: '5px', textTransform: 'uppercase' as const }}>TU EMAIL</label>
              <input type="email" required style={inputStyle} placeholder="tu@agencia.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = '#D4D0C8')} />
            </div>
            <button type="submit" disabled={loading || !email} style={{ width: '100%', background: email && !loading ? '#0F0F1A' : '#D4D0C8', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '13px', fontWeight: 500, cursor: email && !loading ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)' }}>
              {loading ? 'Enviando...' : 'Enviar código →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link href="/login" style={{ fontSize: '12px', color: '#9090A8', textDecoration: 'none' }}>← Volver a iniciar sesión</Link>
            </div>
          </form>
        )}

        {/* STEP 2 — OTP */}
        {!done && step === 2 && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A2E', marginBottom: '4px' }}>Revisa tu email</div>
              <div style={{ fontSize: '13px', color: '#9090A8', lineHeight: 1.6 }}>
                Enviamos un código de 6 dígitos a <strong style={{ color: '#4A4A6A' }}>{maskEmail(email)}</strong>. Válido 10 min.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleCodeInput(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  style={{ width: '44px', height: '52px', textAlign: 'center', fontSize: '20px', fontWeight: 500, color: digit ? 'var(--brand-dark)' : '#9090A8', border: `1.5px solid ${digit ? 'var(--brand)' : '#D4D0C8'}`, borderRadius: '8px', background: digit ? 'var(--brand-light)' : '#F7F6F3', outline: 'none', fontFamily: 'var(--font-sans)', cursor: 'text' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                  onBlur={e => (e.target.style.borderColor = digit ? 'var(--brand)' : '#D4D0C8')}
                />
              ))}
            </div>
            <button
              onClick={handleStep2}
              disabled={code.join('').length < 6 || loading}
              style={{ width: '100%', background: code.join('').length === 6 && !loading ? '#0F0F1A' : '#D4D0C8', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '13px', fontWeight: 500, cursor: code.join('').length === 6 && !loading ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)' }}
            >
              {loading ? 'Verificando...' : 'Verificar →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button onClick={() => setStep(1)} style={{ fontSize: '12px', color: '#9090A8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                ← Cambiar email
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Nueva contraseña */}
        {!done && step === 3 && (
          <form onSubmit={handleStep3}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A2E', marginBottom: '4px' }}>Nueva contraseña</div>
              <div style={{ fontSize: '13px', color: '#9090A8' }}>Mínimo 8 caracteres. Usa mayúsculas, números y símbolos.</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#9090A8', letterSpacing: '0.04em', marginBottom: '5px', textTransform: 'uppercase' as const }}>NUEVA CONTRASEÑA</label>
              <input type="password" required style={inputStyle} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = '#D4D0C8')} />
              <StrengthBar password={password} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#9090A8', letterSpacing: '0.04em', marginBottom: '5px', textTransform: 'uppercase' as const }}>CONFIRMAR CONTRASEÑA</label>
              <input type="password" required style={{ ...inputStyle, borderColor: confirmPassword && password !== confirmPassword ? 'var(--error)' : '#D4D0C8' }} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = confirmPassword && password !== confirmPassword ? 'var(--error)' : '#D4D0C8')} />
              {confirmPassword && password !== confirmPassword && <div style={{ fontSize: '11px', color: 'var(--error)', marginTop: '4px' }}>Las contraseñas no coinciden</div>}
            </div>
            <button type="submit" disabled={loading || password.length < 8 || password !== confirmPassword} style={{ width: '100%', background: password.length >= 8 && password === confirmPassword && !loading ? '#0F0F1A' : '#D4D0C8', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '13px', fontWeight: 500, cursor: password.length >= 8 && password === confirmPassword && !loading ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)' }}>
              {loading ? 'Guardando...' : 'Guardar contraseña →'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
