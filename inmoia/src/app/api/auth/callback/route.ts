import { createServerClient } from '@supabase/ssr';
import { createServiceClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_OTP_TYPES = new Set([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
]);

function sanitizeNextPath(nextPath: string | null): string {
  if (!nextPath) return '/dashboard';
  return nextPath.startsWith('/') ? nextPath : '/dashboard';
}

async function setRoleCookies(
  supabase: ReturnType<typeof createServerClient>,
  response: NextResponse,
) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return;

  response.cookies.set('inmoia_email', user.email ?? '', {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
  });

  // Verificar si el usuario existe en public.users
  const { data: existingUser} = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  // Si no existe, crear el usuario con los metadatos guardados
  if (!existingUser) {
    const metadata = user.user_metadata as Record<string, string> | undefined;
    const nombre = metadata?.nombre || user.email?.split('@')[0] || 'Usuario';
    const agencia = metadata?.agencia || 'Mi Agencia';

    // Crear agencia y usuario usando service role (bypass RLS)
    const supabaseAdmin = createServiceClient();

    const slug = agencia
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàä]/g, 'a')
      .replace(/[éèë]/g, 'e')
      .replace(/[íìï]/g, 'i')
      .replace(/[óòö]/g, 'o')
      .replace(/[úùü]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9-]/g, '');

    const { data: agencyData, error: agencyError } = await supabaseAdmin
      .from('agencies')
      .insert({
        name: agencia,
        slug,
        status: 'trial',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        ...(metadata?.whatsapp ? { whatsapp_number: `+52${metadata.whatsapp}` } : {}),
      })
      .select('id')
      .single();

    if (!agencyError && agencyData?.id) {
      const { error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: user.id,
          agency_id: agencyData.id,
          name: nombre,
          email: user.email,
          role: 'agency_admin',
        });

      if (!userError) {
        console.log('[callback] User and agency created successfully on confirmation');
      } else {
        console.error('[callback] Error creating user:', userError.message);
      }
    } else {
      console.error('[callback] Error creating agency:', agencyError?.message);
    }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role) {
    response.cookies.set('inmoia_role', profile.role, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const nextPath = sanitizeNextPath(url.searchParams.get('next'));

  const response = NextResponse.redirect(new URL(nextPath, request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
    }
    await setRoleCookies(supabase, response);
    return response;
  }

  if (tokenHash && type && ALLOWED_OTP_TYPES.has(type)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email',
    });
    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
    }
    await setRoleCookies(supabase, response);
    return response;
  }

  return NextResponse.redirect(new URL('/login?error=No+auth+payload', request.url));
}
