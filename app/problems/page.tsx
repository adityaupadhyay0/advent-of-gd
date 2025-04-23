import ProblemList from "@/components/ProblemList";

export default async function ProblemsPage() {
  try {
    const res = await fetch("/api/problems", { cache: "no-store" });

    if (!res.ok) {
      return <p className="text-red-500">Error: {res.statusText}</p>;
    }

    const result = await res.json();

    // Ensure we always pass an array, even if the API returns a message instead of problems
    const problems = result.problems ?? [];

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Problems List</h1>
        <ProblemList problems={problems} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching problems:", error);
    return <p className="text-red-500">Failed to load problems.</p>;
  }
}
