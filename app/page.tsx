import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <Link href="/problems">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          View Problems
        </button>
      </Link>
    </div>
  );
}
