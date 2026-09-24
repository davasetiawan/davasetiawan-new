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

export async function PUT(req) {
  try {
    const body = await req.json();
    const payload = toPayload(body);

    const supabase = supabaseServer();
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
