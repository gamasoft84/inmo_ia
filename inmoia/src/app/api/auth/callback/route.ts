import { createServerClient } from '@supabase/ssr';
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
    return response;
  }

  return NextResponse.redirect(new URL('/login?error=No+auth+payload', request.url));
}
