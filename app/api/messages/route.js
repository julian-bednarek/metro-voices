import { supabase } from "../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false })
    .limit(100);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  const random = data[Math.floor(Math.random() * data.length)];
  return Response.json(random ?? null);
}

export async function POST(request) {
  let content;
  try {
    const body = await request.json();
    content = body.content;
  } catch (e) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!content || !content.trim()) {
    return Response.json({ error: "Message cannot be empty" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([{ content }])
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
