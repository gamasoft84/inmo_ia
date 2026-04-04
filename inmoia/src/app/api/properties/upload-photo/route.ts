import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = "property-photos";

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "FormData requerido." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const agencyId = (formData.get("agencyId") as string | null)?.trim();

  if (!file) {
    return NextResponse.json({ error: "Campo 'file' requerido." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const folder = agencyId || "general";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Intenta crear el bucket si no existe (service role puede hacerlo)
  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "No se pudo subir la foto." },
      { status: 400 }
    );
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return NextResponse.json({ url: urlData.publicUrl, path: data.path });
}
