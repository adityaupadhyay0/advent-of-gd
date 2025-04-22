import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

export async function GET() {
  // Query all problems from the "problems" table.
  const { data, error } = await supabase
    .from("problems")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ message: "No problems found" }, { status: 404 });
  }

  return NextResponse.json({ problems: data });
}
