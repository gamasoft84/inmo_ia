import { NextRequest, NextResponse } from "next/server";
import { findTopPropertyMatches } from "@/lib/whatsapp/semantic-properties";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { query, agencyId, limit = 6 } = await req.json() as {
    query: string;
    agencyId?: string;
    limit?: number;
  };

  if (!query?.trim()) {
    return NextResponse.json({ error: "Query requerida." }, { status: 400 });
  }

  // Resolve agencyId from session if not provided
  let resolvedAgencyId = agencyId;
  if (!resolvedAgencyId) {
    const supabase = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("agency_id")
        .eq("id", user.id)
        .maybeSingle();
      resolvedAgencyId = profile?.agency_id as string | undefined;
    }
  }

  if (!resolvedAgencyId) {
    return NextResponse.json({ error: "agencyId requerido." }, { status: 400 });
  }

  const result = await findTopPropertyMatches({
    agencyId: resolvedAgencyId,
    query: query.trim(),
    limit,
  });

  // Enrich with full property data
  const supabase = createServiceClient();
  const ids = result.matches.map(m => m.id);
  const { data: props } = ids.length
    ? await supabase
        .from("properties")
        .select("id, slug, title_es, city, type, price_mxn, photos, status")
        .in("id", ids)
    : { data: [] };

  // Preserve similarity order
  const enriched = result.matches.map(m => {
    const prop = (props ?? []).find(p => p.id === m.id);
    return {
      id:         m.id,
      slug:       prop?.slug ?? m.id,
      title:      prop?.title_es ?? m.title,
      city:       prop?.city ?? m.city,
      type:       prop?.type ?? "",
      price_mxn:  prop?.price_mxn ?? null,
      photo:      Array.isArray(prop?.photos) ? (prop.photos as string[])[0] : null,
      status:     prop?.status ?? "active",
      similarity: m.similarity,
      features:   m.features,
    };
  });

  return NextResponse.json({ matches: enriched, source: result.source });
}
