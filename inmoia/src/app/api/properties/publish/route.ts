import { createServerClient } from "@supabase/ssr";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  // Cliente SSR para leer sesión (anon key)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // No-op: solo leemos cookies, no las escribimos
        },
      },
    }
  );

  // Cliente service role para bypass RLS en tabla users
  const supabaseAdmin = createServiceClient();

  try {
    // Debug: loguea cookies recibidas
    const allCookies = cookieStore.getAll();
    const emailCookie = cookieStore.get("inmoia_email")?.value;
    const roleCookie = cookieStore.get("inmoia_role")?.value;
    
    console.log("[publish] Debug cookies:", {
      totalCookies: allCookies.length,
      emailCookie,
      roleCookie,
      cookieNames: allCookies.map((c) => c.name),
    });

    // Intenta obtener el usuario via sesión de auth
    const { data: authData } = await supabase.auth.getUser();
    let userId = authData.user?.id;

    // Si no hay sesión de auth, intenta usar el email guardado en cookie
    if (!userId && emailCookie) {
      // Consulta el usuario por email usando service role (bypass RLS)
      const { data: userByEmail } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", emailCookie)
        .maybeSingle();
      
      if (userByEmail?.id) {
        userId = userByEmail.id;
        console.log("[publish] User resolved by email:", userId);
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Sesion no valida. Inicia sesion de nuevo." },
        { status: 401 }
      );
    }

    // Resuelve agency_id usando service role (bypass RLS)
    const { data: userRow, error: userErr } = await supabaseAdmin
      .from("users")
      .select("agency_id")
      .eq("id", userId)
      .maybeSingle();

    if (userErr || !userRow?.agency_id) {
      console.error("[publish] Error resolving agency:", {
        userErr,
        userRow,
        userId,
      });
      return NextResponse.json(
        { error: "No se pudo resolver la agencia del usuario." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      type,
      operation,
      city,
      price_mxn,
      area_total,
      bedrooms,
      features,
      title_es,
      desc_es,
      publish,
    } = body;

    if (!city || !title_es) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (ciudad, titulo)." },
        { status: 400 }
      );
    }

    const slugBase = `${type}-${city}-${Date.now()}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[áàä]/g, "a")
      .replace(/[éèë]/g, "e")
      .replace(/[íìï]/g, "i")
      .replace(/[óòö]/g, "o")
      .replace(/[úùü]/g, "u")
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9-]/g, "");

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
