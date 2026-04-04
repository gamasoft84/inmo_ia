import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[áàä]/g, "a")
    .replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9-]/g, "");
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 7);
}

function isSlugConflict(message?: string | null) {
  const normalized = (message || "").toLowerCase();
  return normalized.includes("duplicate key") && normalized.includes("slug");
}

export async function POST(req: NextRequest) {
  // Cliente service role para bypass RLS en tabla users
  const supabaseAdmin = createServiceClient();

  try {
    const body = await req.json();
    const { userId, userEmail, type, operation, city, price_mxn, area_total, bedrooms, features, title_es, desc_es, publish } = body;

    // Validación básica
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "userId y userEmail son requeridos." },
        { status: 400 }
      );
    }

    if (!city || !title_es) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (ciudad, titulo)." },
        { status: 400 }
      );
    }

    // Resuelve agency_id usando service role (bypass RLS)
    let userRow = (await supabaseAdmin
      .from("users")
      .select("id, agency_id, email, name")
      .eq("id", userId)
      .maybeSingle()).data;

    // Si el usuario no existe, crearlo on-demand con auth metadata
    if (!userRow) {
      // Obtener info del usuario en auth.users
      const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (authErr || !authUser.user) {
        return NextResponse.json(
          { error: "Usuario no encontrado en el sistema." },
          { status: 400 }
        );
      }

      const metadata = authUser.user.user_metadata as Record<string, string> | undefined;
      const nombre = metadata?.nombre || userEmail?.split('@')[0] || 'Usuario';
      const agencia = metadata?.agencia || 'Mi Agencia';
      const whatsapp = metadata?.whatsapp;

      const baseSlug = slugify(agencia) || `agencia-${randomSuffix()}`;
      let agencyData: { id: string } | null = null;
      let agencyErrMessage = "";

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const candidateSlug = attempt === 0 ? baseSlug : `${baseSlug}-${randomSuffix()}`;
        const inserted = await supabaseAdmin
          .from("agencies")
          .insert({
            name: agencia,
            slug: candidateSlug,
            status: "trial",
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            ...(whatsapp ? { whatsapp_number: `+52${whatsapp}` } : {}),
          })
          .select("id")
          .single();

        if (!inserted.error && inserted.data?.id) {
          agencyData = { id: String(inserted.data.id) };
          break;
        }

        agencyErrMessage = inserted.error?.message ?? "";
        if (!isSlugConflict(agencyErrMessage)) {
          break;
        }
      }

      if (!agencyData?.id) {
        return NextResponse.json(
          { error: agencyErrMessage || "No se pudo crear la agencia del usuario." },
          { status: 400 }
        );
      }

      // Crear usuario
      const { error: userCreateErr } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          agency_id: agencyData.id,
          name: nombre,
          email: userEmail,
          role: 'agency_admin',
        });

      if (userCreateErr) {
        return NextResponse.json(
          { error: "No se pudo crear el usuario en el sistema." },
          { status: 400 }
        );
      }

      userRow = {
        id: userId,
        agency_id: agencyData.id,
        email: userEmail,
        name: nombre,
      };
    }

    if (!userRow?.agency_id) {
      return NextResponse.json(
        { error: "No se pudo resolver la agencia del usuario." },
        { status: 400 }
      );
    }

    const slugBase = slugify(`${type}-${city}-${Date.now()}`);

    const payload = {
      agency_id: userRow.agency_id,
      type,
      operation,
      city,
      status: publish ? "active" : "draft",
      title_es,
      desc_es,
      price_mxn: Number(price_mxn || 0),
      area_total: Number(area_total || 0),
      bedrooms: Number(bedrooms || 0),
      features,
      slug: slugBase,
    };

    // Usa service role para insertar (bypass RLS)
    const withSlug = await supabaseAdmin
      .from("properties")
      .insert(payload)
      .select("id")
      .single();

    if (!withSlug.error && withSlug.data?.id) {
      return NextResponse.json(
        {
          success: true,
          id: withSlug.data.id,
          slug: slugBase,
        },
        { status: 201 }
      );
    }

    // Compatibilidad con esquemas que no tengan columnas completas
    const fallback = await supabaseAdmin
      .from("properties")
      .insert({
        agency_id: userRow.agency_id,
        title_es,
        city,
        status: publish ? "active" : "draft",
        features,
      })
      .select("id")
      .single();

    if (fallback.error || !fallback.data?.id) {
      return NextResponse.json(
        {
          error:
            withSlug.error?.message ??
            fallback.error?.message ??
            "No se pudo guardar la propiedad.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: fallback.data.id,
        slug: slugBase,
      },
      { status: 201 }
    );
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Error inesperado";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
