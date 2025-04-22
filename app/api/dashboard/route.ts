import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

// GET: Retrieve dashboard data (streaks and user progress) for the given userId.
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  // Fetch streak data for the user from the "streaks" table.
  const { data: streaks, error: streakError } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId);

  // Fetch user progress from the "user_progress" table.
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (streakError || progressError) {
    return NextResponse.json(
      { error: streakError?.message || progressError?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ streaks, progress });
}

// POST: Update or insert a user progress record for the given userId.
// Expected JSON payload:
// {
//    "problem_id": "uuid-of-problem",
//    "is_correct": true   // or false
// }
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { problem_id, is_correct } = body;
    if (!problem_id || typeof is_correct !== "boolean") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Insert or update the progress record.
    // The upsert uses the UNIQUE constraint on (user_id, problem_id) to prevent duplicates.
    const { data, error } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: params.userId,
          problem_id,
          is_correct,
          // solved_at defaults to now()
        },
        { onConflict: "user_id,problem_id" }
      )
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ progress: data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
