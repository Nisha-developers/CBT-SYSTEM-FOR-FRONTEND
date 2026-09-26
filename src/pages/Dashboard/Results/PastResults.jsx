import { useState } from 'react';
import { pastResults } from '../../../api/result.api';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';

// Section 17: up to six years of history, queried by session/class/arm/subject
// rather than dumped onto the dashboard.
export default function PastResults() {
  const [filter, setFilter] = useState({ session: '', classId: '', armId: '', subjectId: '' });
  const [results, setResults] = useState([]);

  const search = async () => {
    const { data } = await pastResults(filter);
    setResults(data.results);
  };

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'score', label: 'Score' },
    { key: 'session', label: 'Session' },
  ];
  const rows = results.map((r) => ({
    id: r.id, studentName: r.Student?.fullName, score: `${r.score}/${r.maxScore}`, session: r.session,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Past Results</h1>
      <div className="flex gap-3 mb-4 flex-wrap">
        {['session', 'classId', 'armId', 'subjectId'].map((f) => (
          <input key={f} placeholder={f} className="border rounded-md px-3 py-2 text-sm"
            value={filter[f]} onChange={(e) => setFilter({ ...filter, [f]: e.target.value })} />
        ))}
        <Button variant="outline" onClick={search}>Search</Button>
      </div>
      <Table columns={columns} rows={rows} />
    </div>
  );
}
