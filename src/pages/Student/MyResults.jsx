import { useEffect, useState } from 'react';
import { myResults } from '../../api/result.api';

export default function MyResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    myResults().then(({ data }) => setResults(data.results));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">My Results</h1>
      <ul className="space-y-3 max-w-md">
        {results.map((r) => (
          <li key={r.id} className="bg-white p-4 rounded-lg shadow">
            <div className="font-medium">{r.Exam?.title}</div>
            <div className="text-sm text-gray-500">Score: {r.score} / {r.maxScore}</div>
            {r.remarks && <div className="text-xs text-gray-400 mt-1">{r.remarks}</div>}
          </li>
        ))}
        {results.length === 0 && <p className="text-gray-400 text-sm">No released results yet.</p>}
      </ul>
    </div>
  );
}
