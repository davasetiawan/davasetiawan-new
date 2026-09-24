import { supabaseServer } from "../../../lib/supabase";
import SEED from "../../../lib/seed";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SINGLE_ID = 1;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function toPayload(body = {}) {
  return {
    id: SINGLE_ID,
    profile: body.profile ?? SEED.profile,
    skills: body.skills ?? SEED.skills,
    marquee: body.marquee ?? SEED.marquee,
    tech_stack: body.techStack ?? body.tech_stack ?? SEED.techStack,
    projects: body.projects ?? SEED.projects,
    experience: body.experience ?? SEED.experience,
    certificates: body.certificates ?? SEED.certificates,
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    messages: body.messages ?? SEED.messages,
    settings: body.settings ?? SEED.settings,
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row) {
  if (!row) return null;
  return {
    profile: row.profile ?? SEED.profile,
    skills: row.skills ?? SEED.skills,
    marquee: row.marquee ?? SEED.marquee,
    techStack: row.tech_stack ?? row.techStack ?? SEED.techStack,
    projects: row.projects ?? SEED.projects,
    experience: row.experience ?? SEED.experience,
    certificates: row.certificates ?? SEED.certificates,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    messages: row.messages ?? SEED.messages,
    settings: row.settings ?? SEED.settings,
  };
}

export async function GET() {
  try {
    const supabase = supabaseServer();
    const { data: row, error } = await supabase
      .from("content")
      .select("*")
      .eq("id", SINGLE_ID)
      .single();

    if (error) {
      console.error("Supabase GET error:", error.message);
      return json(fromRow(SEED));
    }

    return json(fromRow(row));
  } catch (err) {
    console.error("GET fatal error:", err.message);
    return json(fromRow(SEED));
  }
}

async function extractAndUploadBase64(obj, supabase) {
  if (!obj) return obj;
  if (typeof obj === "string") {
    if (obj.startsWith("data:image/")) {
      try {
        const matches = obj.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1];
          const ext = contentType.split("/")[1] || "jpeg";
          const buffer = Buffer.from(matches[2], "base64");
          const filename = `uploads/auto-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

          try {
            await supabase.storage.createBucket("images", { public: true });
          } catch {}

          const { data, error } = await supabase.storage
            .from("images")
            .upload(filename, buffer, { contentType, upsert: true });

          if (!error && data?.path) {
            const { data: publicUrlData } = supabase.storage
              .from("images")
              .getPublicUrl(data.path);
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.error("Auto upload base64 error:", err.message);
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const list = [];
    for (const item of obj) {
      list.push(await extractAndUploadBase64(item, supabase));
    }
    return list;
  }

  if (typeof obj === "object") {
    const out = {};
    for (const key of Object.keys(obj)) {
      out[key] = await extractAndUploadBase64(obj[key], supabase);
    }
    return out;
  }

  return obj;
}

export async function PUT(req) {
  try {
    const body = await req.json();
    let payload = toPayload(body);

    const supabase = supabaseServer();

    // Otomatis ekstrak & upload semua gambar base64 ke Supabase Storage
    // agar ukuran JSON payload database menjadi sangat kecil dan tidak terkena timeout
    payload = await extractAndUploadBase64(payload, supabase);

    const { data: row, error } = await supabase
      .from("content")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase PUT error:", error.message);
      return json({ error: error.message }, 500);
    }

    return json(fromRow(row));
  } catch (err) {
    console.error("PUT fatal error:", err.message);
    return json({ error: err.message }, 500);
  }
}

export async function DELETE() {
  try {
    const payload = toPayload(SEED);
    const supabase = supabaseServer();
    const { data: row, error } = await supabase
      .from("content")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase DELETE/reset error:", error.message);
      return json({ error: error.message }, 500);
    }

    return json(fromRow(row));
  } catch (err) {
    console.error("DELETE fatal error:", err.message);
    return json({ error: err.message }, 500);
  }
}
