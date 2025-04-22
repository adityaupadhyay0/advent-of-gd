import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

// GET /api/problem/[date]? (date in YYYY-MM-DD format)
export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const { date } = params;

  // Query problems where the 'date' field exactly matches the provided date.
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("date", date);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { message: "No problem found for this date" },
      { status: 404 }
    );
  }

  // Return the first matching problem (adjust as needed)
  return NextResponse.json({ problem: data[0] });
}
