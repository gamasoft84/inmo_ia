import { createEmbedding, toPgVectorLiteral } from "@/lib/ai/embeddings";
import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Propiedad no encontrada." }, { status: 404 });
  }

  return NextResponse.json({ property: data });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const supabase = createServiceClient();
  const body = await req.json().catch(() => ({}));

  const {
    type, operation, status, city, state,
    price_mxn, price_usd, area_total, area_built,
    bedrooms, bathrooms, parking, floors,
    title_es, title_en, desc_es, desc_en,
    desc_whatsapp_es, desc_instagram_es,
    neighborhood, address, photos, amenities,
    is_featured, publish_portals,
  } = body;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (type !== undefined) updates.type = type;
  if (operation !== undefined) updates.operation = operation;
  if (status !== undefined) updates.status = status;
  if (city !== undefined) updates.city = city;
  if (state !== undefined) updates.state = state;
  if (price_mxn !== undefined) updates.price_mxn = Number(price_mxn) || null;
  if (price_usd !== undefined) updates.price_usd = Number(price_usd) || null;
  if (area_total !== undefined) updates.area_total = Number(area_total) || null;
  if (area_built !== undefined) updates.area_built = Number(area_built) || null;
  if (bedrooms !== undefined) updates.bedrooms = Number(bedrooms) || 0;
  if (bathrooms !== undefined) updates.bathrooms = Number(bathrooms) || 0;
  if (parking !== undefined) updates.parking = Number(parking) || 0;
  if (floors !== undefined) updates.floors = Number(floors) || 1;
  if (title_es !== undefined) updates.title_es = title_es;
  if (title_en !== undefined) updates.title_en = title_en;
  if (desc_es !== undefined) updates.desc_es = desc_es;
  if (desc_en !== undefined) updates.desc_en = desc_en;
  if (desc_whatsapp_es !== undefined) updates.desc_whatsapp_es = desc_whatsapp_es;
  if (desc_instagram_es !== undefined) updates.desc_instagram_es = desc_instagram_es;
  if (neighborhood !== undefined) updates.neighborhood = neighborhood;
  if (address !== undefined) updates.address = address;
  if (photos !== undefined) updates.photos = Array.isArray(photos) ? photos : String(photos).split("\n").map((s: string) => s.trim()).filter(Boolean);
  if (amenities !== undefined) updates.amenities = amenities;
  if (is_featured !== undefined) updates.is_featured = Boolean(is_featured);
  if (publish_portals !== undefined) updates.publish_portals = Boolean(publish_portals);

  // Regenerar embedding si cambian título o descripción
  if (title_es || desc_es) {
    const currentRes = await supabase.from("properties").select("title_es, desc_es, city, type").eq("id", params.id).single();
    const cur = currentRes.data ?? { title_es: null, desc_es: null, city: null, type: null };
    const embeddingText = [
      updates.title_es ?? cur.title_es,
      updates.desc_es ?? cur.desc_es,
      updates.city ?? cur.city,
      updates.type ?? cur.type,
    ].filter(Boolean).join(" ");

    createEmbedding(String(embeddingText)).then((vector) => {
      supabase
        .from("properties")
        .update({ embedding: toPgVectorLiteral(vector) })
        .eq("id", params.id)
        .then(() => {});
    }).catch(() => {});
  }

  const { data, error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", params.id)
    .select("id, slug, status")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "No se pudo actualizar la propiedad." }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: data.id, slug: data.slug, status: data.status });
}
