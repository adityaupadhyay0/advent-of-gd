import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Helper function to authenticate users
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function authenticateUser(_request: Request)
 {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return null;
  }

  // Fetch user from Supabase using email
  const { data: user, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (error || !user) {
    return null;
  }

  return user.id; // Return authenticated user ID
}

// GET: Retrieve dashboard data (streaks and user progress) for the authenticated user
export async function GET(request: Request) {
  const userId = await authenticateUser(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch streaks and progress for the authenticated user
  const { data: streaks, error: streakError } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId);

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

// POST: Update or insert a user progress record for the authenticated user
export async function POST(request: Request) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { problem_id, is_correct } = body;

    if (!problem_id || typeof is_correct !== "boolean") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Upsert the progress record for the authenticated user
    const { data, error } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: userId, // Use authenticated user ID
          problem_id,
          is_correct,
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
