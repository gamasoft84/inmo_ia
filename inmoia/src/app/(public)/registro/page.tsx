'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type FormData = {
  nombre: string;
  email: string;
  password: string;
  agencia: string;
  ciudad: string;
  tipoAgencia: string;
  plan: 'solo' | 'agencia' | 'pro' | '';
  whatsapp: string;
};

const STEPS = [
  {
    num: '01',
    leftTitle: 'Bienvenido a',
    leftHighlight: 'InmoIA',
    leftDesc: 'La plataforma que hace que tu agencia venda más mientras la IA trabaja por ti.',
    rightTitle: 'Crea tu cuenta',
  },
  {
    num: '02',
    leftTitle: 'Nunca pierdas un lead',
    leftHighlight: 'por falta de respuesta',
    leftDesc: 'Sofía responde en segundos, califica el interés y agenda la visita. Sin intervención humana.',
    rightTitle: 'Cuéntanos de tu agencia',
  },
  {
    num: '03',
    leftTitle: 'El plan perfecto',
    leftHighlight: 'para tu agencia',
    leftDesc: '14 días gratis. Sin tarjeta. Sin compromiso. Cancela cuando quieras.',
    rightTitle: 'Elige tu plan',
  },
  {
    num: '04',
    leftTitle: 'Activa tu chatbot',
    leftHighlight: 'en menos de 3 minutos',
    leftDesc: 'Conecta tu número de WhatsApp Business y Sofía empieza a trabajar de inmediato.',
    rightTitle: 'Contraseña y WhatsApp',
  },
  {
    num: '05',
    leftTitle: '¡Todo listo!',
    leftHighlight: 'Tu agencia ya está en InmoIA',
    leftDesc: 'Empieza a recibir y calificar leads hoy mismo. El dashboard te espera.',
    rightTitle: '¡Listo para vender más!',
  },
];

const PLANS = [
  { id: 'solo' as const, name: 'Solo', price: '$49', period: 'USD/mes', desc: '1 agente · 500 mensajes/mes' },
  { id: 'agencia' as const, name: 'Agencia', price: '$149', period: 'USD/mes', desc: '5 agentes · 1,000 mensajes/mes', popular: true },
  { id: 'pro' as const, name: 'Pro', price: '$299', period: 'USD/mes', desc: '15 agentes · 5,000 mensajes/mes' },
];

const TIPOS = ['Agencia inmobiliaria', 'Agente independiente', 'Desarrolladora', 'Franquicia', 'Otro'];

export default function RegistroPage() {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [form, setForm] = useState<FormData>({
    nombre: '', email: '', password: '', agencia: '', ciudad: '', tipoAgencia: '', plan: '', whatsapp: '',
  });

  function update(key: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function next() {
    if (step === 5) {
      setLoading(true);
      setError('');
      setOk('');

      try {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
            data: {
              nombre: form.nombre,
              agencia: form.agencia,
              ciudad: form.ciudad,
              whatsapp: form.whatsapp,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (!authData.user?.id) {
          setError('No se pudo crear la sesión.');
          setLoading(false);
          return;
        }

        // Los datos se guardan en user_metadata y se crearán en la callback cuando el usuario confirme
        setOk('Revisa tu email para confirmar la creación de cuenta. Después serás redirigido al dashboard.');
        setLoading(false);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Error inesperado';
        setError(message);
        setLoading(false);
      }
      return;
    }
    setStep(s => s + 1);
  }

  const current = STEPS[step - 1];
  const canContinue: Record<number, boolean> = {
    1: !!form.nombre && !!form.email,
    2: !!form.agencia && !!form.ciudad,
    3: !!form.plan,
    4: form.password.length >= 8 && form.whatsapp.length >= 10,
    5: true,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '0.5px solid #D4D0C8', borderRadius: '8px',
    padding: '10px 12px', fontSize: '13px', color: '#1A1A2E', outline: 'none', fontFamily: 'var(--font-sans)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '10px', color: '#9090A8', letterSpacing: '0.04em',
    marginBottom: '5px', textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-sans)' }}>
      <style>{`@keyframes fadeInStep { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ width: '100%', maxWidth: '780px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', display: 'flex', minHeight: '480px' }}>

        {/* LEFT PANEL */}
        <div style={{ width: '42%', background: '#0F0F1A', padding: '40px 32px', display: 'flex', flexDirection: 'column', borderRight: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginBottom: '40px' }}>
            <span style={{ fontSize: '18px' }}>🌊</span>
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>InmoIA</span>
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--brand)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '16px' }}>
              {current.num} / 05
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#fff', lineHeight: 1.2, marginBottom: '8px' }}>
              {current.leftTitle}<br />
              <span style={{ color: 'var(--brand)' }}>{current.leftHighlight}</span>
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginTop: '12px' }}>
              {current.leftDesc}
            </p>
          </div>
          {/* Dots */}
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: '6px', borderRadius: '3px', background: i + 1 === step ? 'var(--brand)' : i + 1 < step ? 'rgba(186,117,23,0.5)' : 'rgba(255,255,255,0.15)',
                  width: i + 1 === step ? '20px' : '6px', transition: 'all 300ms ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, background: '#F7F6F3', padding: '40px 32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A2E', marginBottom: '4px' }}>{current.rightTitle}</div>
            {step === 1 && <div style={{ fontSize: '12px', color: '#9090A8' }}>Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Inicia sesión</Link></div>}
          </div>

          {error && (
            <div
              style={{
                marginBottom: '12px',
                border: '0.5px solid #F7C1C1',
                background: '#FCEBEB',
                color: '#A32D2D',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '11px',
              }}
            >
              {error}
            </div>
          )}

          {ok && (
            <div
              style={{
                marginBottom: '12px',
                border: '0.5px solid #C1E7C1',
                background: '#EBFCEB',
                color: '#2D7D2D',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '11px',
              }}
            >
              {ok}
            </div>
          )}

          <div style={{ flex: 1 }}>

            {/* STEP 1 — Cuenta */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeInStep 0.25s ease both' }}>
                <div>
                  <label style={labelStyle}>NOMBRE COMPLETO</label>
                  <input style={inputStyle} placeholder="Luis Aguilar" value={form.nombre} onChange={e => update('nombre', e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = '#D4D0C8')} />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input type="email" style={inputStyle} placeholder="tu@agencia.com" value={form.email} onChange={e => update('email', e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = '#D4D0C8')} />
                </div>
              </div>
            )}

            {/* STEP 2 — Agencia */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeInStep 0.25s ease both' }}>
                <div>
                  <label style={labelStyle}>NOMBRE DE TU AGENCIA</label>
                  <input style={inputStyle} placeholder="Agencia Aguilar" value={form.agencia} onChange={e => update('agencia', e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = '#D4D0C8')} />
                </div>
                <div>
                  <label style={labelStyle}>CIUDAD PRINCIPAL</label>
                  <input style={inputStyle} placeholder="Guadalajara, CDMX, Cancún..." value={form.ciudad} onChange={e => update('ciudad', e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = '#D4D0C8')} />
                </div>
                <div>
                  <label style={labelStyle}>TIPO</label>
                  <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} value={form.tipoAgencia} onChange={e => update('tipoAgencia', e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = '#D4D0C8')}>
                    <option value="">Selecciona...</option>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3 — Plan */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeInStep 0.25s ease both' }}>
                {PLANS.map(p => (
                  <div
                    key={p.id}
                    onClick={() => update('plan', p.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '10px', border: `1.5px solid ${form.plan === p.id ? 'var(--brand)' : '#D4D0C8'}`, background: form.plan === p.id ? 'var(--brand-light)' : '#fff', cursor: 'pointer', transition: 'all 150ms', position: 'relative' }}
                  >
                    {p.popular && <div style={{ position: 'absolute', top: '-9px', left: '12px', background: 'var(--brand)', color: '#fff', fontSize: '9px', fontWeight: 600, padding: '1px 8px', borderRadius: '10px', letterSpacing: '0.05em' }}>MÁS POPULAR</div>}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A2E' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#9090A8' }}>{p.desc}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--brand-dark)' }}>{p.price}</div>
                      <div style={{ fontSize: '10px', color: '#9090A8' }}>{p.period}</div>
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: '11px', color: '#9090A8', textAlign: 'center', marginTop: '4px' }}>14 días gratis · Sin tarjeta de crédito</div>
              </div>
            )}

            {/* STEP 4 — Contraseña + WhatsApp */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeInStep 0.25s ease both' }}>
                <div>
                  <label style={labelStyle}>CONTRASEÑA</label>
                  <input type="password" style={inputStyle} placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => update('password', e.target.value)} onFocus={e => (e.target.style.borderColor = 'var(--brand)')} onBlur={e => (e.target.style.borderColor = '#D4D0C8')} />
                </div>
                <div>
                  <label style={labelStyle}>NÚMERO DE WHATSAPP BUSINESS</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ ...inputStyle, width: '80px', flexShrink: 0, color: '#9090A8', display: 'flex', alignItems: 'center' }}>+52</div>
                    <input
                      type="tel"
                      style={{ ...inputStyle }}
                      placeholder="33 1234 5678"
                      value={form.whatsapp}
                      onChange={e => update('whatsapp', e.target.value.replace(/\D/g, ''))}
                      onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                      onBlur={e => (e.target.style.borderColor = '#D4D0C8')}
                    />
                  </div>
                </div>
                <div style={{ background: 'var(--brand-light)', border: '0.5px solid var(--brand-border)', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: 'var(--brand-text)' }}>
                  <strong>✦ Tip:</strong> Usa un número de WhatsApp Business dedicado a tu agencia para mejores resultados con Sofía.
                </div>
              </div>
            )}

            {/* STEP 5 — Listo */}
            {step === 5 && (
              <div style={{ textAlign: 'center', paddingTop: '8px', animation: 'fadeInStep 0.25s ease both' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1A1A2E', marginBottom: '8px' }}>¡Bienvenido a InmoIA, {form.nombre.split(' ')[0]}!</div>
                <div style={{ fontSize: '12px', color: '#9090A8', lineHeight: 1.7, marginBottom: '20px' }}>
                  Tu agencia <strong>{form.agencia}</strong> está lista.<br />
                  Plan <strong>{PLANS.find(p => p.id === form.plan)?.name}</strong> · 14 días gratis.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff', borderRadius: '10px', padding: '14px', border: '0.5px solid #EBEBEB' }}>
                  {[
                    { icon: '✓', label: 'Cuenta creada', done: true },
                    { icon: '✓', label: 'Agencia configurada', done: true },
                    { icon: '✓', label: 'Sofía lista para responder', done: true },
                    { icon: '→', label: 'Ir al dashboard', done: false },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: item.done ? '#3B6D11' : 'var(--brand)' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: item.done ? '#EAF3DE' : 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600, flexShrink: 0 }}>{item.icon}</div>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={next}
            disabled={!canContinue[step] || loading}
            style={{ marginTop: '24px', width: '100%', background: canContinue[step] && !loading ? '#0F0F1A' : '#D4D0C8', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 500, cursor: canContinue[step] && !loading ? 'pointer' : 'not-allowed', transition: 'background 200ms', fontFamily: 'var(--font-sans)' }}
          >
            {loading ? 'Creando tu cuenta...' : step === 5 ? 'Ir al dashboard →' : 'Continuar →'}
          </button>
        </div>

      </div>
    </div>
  );
}

