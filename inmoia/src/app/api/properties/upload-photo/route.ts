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

  // Rechazar HEIC/HEIF (no soportado por Claude Vision ni compatible con browsers)
  if (ext === "heic" || ext === "heif" || file.type === "image/heic" || file.type === "image/heif") {
    return NextResponse.json(
      { error: "Formato HEIC no soportado. En tu iPhone ve a Ajustes → Cámara → Formatos → Más compatible (JPEG)." },
      { status: 400 }
    );
  }

  // Limitar tamaño a 4 MB
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json(
      { error: `La foto pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El límite es 4 MB. Comprime la imagen antes de subir.` },
      { status: 400 }
    );
  }
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
