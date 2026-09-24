import { supabaseServer } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

// Max file size: 10MB
const MAX_SIZE = 10 * 1024 * 1024;
const BUCKET = "images";

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return Response.json({ error: "Missing path parameter" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: `File terlalu besar (maks ${MAX_SIZE / 1024 / 1024}MB)` }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = supabaseServer();

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Dapatkan public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return Response.json({ url: publicUrlData.publicUrl, path: data.path });
  } catch (err) {
    console.error("Upload route error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
