import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, nombre, email, agencia, whatsapp } = body;

    if (!userId || !nombre || !email || !agencia) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Generar slug desde nombre de agencia
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

    // 1. Crear agencia
    const { data: agencyData, error: agencyError } = await supabase
      .from('agencies')
      .insert({
        name: agencia,
        slug,
        status: 'trial',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        ...(whatsapp ? { whatsapp_number: `+52${whatsapp}` } : {}),
      })
      .select('id')
      .single();

    if (agencyError || !agencyData?.id) {
      return NextResponse.json(
        { error: agencyError?.message ?? 'Error creando agencia' },
        { status: 500 },
      );
    }

    // 2. Crear usuario vinculado a la agencia
    const { error: userError } = await supabase.from('users').insert({
      id: userId,
      agency_id: agencyData.id,
      name: nombre,
      email,
      role: 'agency_admin',
    });

    if (userError) {
      // Revertir agencia creada
      await supabase.from('agencies').delete().eq('id', agencyData.id);
      return NextResponse.json(
        { error: userError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ agencyId: agencyData.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error inesperado';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
