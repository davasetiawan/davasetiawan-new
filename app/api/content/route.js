import { supabaseServer } from "../../../lib/supabase";
import SEED from "../../../lib/seed";

const SINGLE_ID = 1;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function toPayload(body) {
  return {
    id: SINGLE_ID,
    profile: body.profile ?? SEED.profile,
    skills: body.skills ?? SEED.skills,
    marquee: body.marquee ?? SEED.marquee,
    tech_stack: body.techStack ?? body.tech_stack ?? SEED.techStack,
    projects: body.projects ?? SEED.projects,
    experience: body.experience ?? SEED.experience,
    certificates: body.certificates ?? SEED.certificates,
    messages: body.messages ?? SEED.messages,
    settings: body.settings ?? SEED.settings,
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row) {
  if (!row) return null;
  return {
    profile: row.profile,
    skills: row.skills,
    marquee: row.marquee,
    techStack: row.tech_stack,
    projects: row.projects,
    experience: row.experience,
    certificates: row.certificates,
    messages: row.messages,
    settings: row.settings,
  };
}

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("content")
    .select("*")
    .eq("id", SINGLE_ID)
    .maybeSingle();

  if (error) return json({ error: error.message }, 500);

  if (!data) {
    const { data: seeded, error: seedError } = await supabase
      .from("content")
      .upsert(toPayload(SEED))
      .select()
      .single();
    if (seedError) return json({ error: seedError.message }, 500);
    return json(fromRow(seeded));
  }

  return json(fromRow(data));
}

export async function PUT(req) {
  const supabase = supabaseServer();
  const body = await req.json();
  const { data, error } = await supabase
    .from("content")
    .upsert(toPayload(body))
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);
  return json(fromRow(data));
}

export async function DELETE() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("content")
    .upsert(toPayload(SEED))
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);
  return json(fromRow(data));
}
