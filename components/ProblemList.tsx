type Problem = {
  id: number;
  title: string;
  description: string;
};

type ProblemListProps = {
  problems: Problem[];
};

export default function ProblemList({ problems }: ProblemListProps) {
  if (!problems || problems.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No problems found. Try again later!
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {problems.map((problem) => (
        <li key={problem.id} className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold">{problem.title}</h2>
          <p className="text-gray-600">{problem.description}</p>
        </li>
      ))}
    </ul>
  );
}
