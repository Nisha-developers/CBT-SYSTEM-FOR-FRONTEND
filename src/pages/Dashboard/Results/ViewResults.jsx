import { useEffect, useState } from 'react';
import { viewResults, releaseResult } from '../../../api/result.api';
import { useResultStore } from '../../../store/useResultStore';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';

export default function ViewResults() {
  const { results, setResults } = useResultStore();
  const [filter, setFilter] = useState({ classId: '', armId: '', subjectId: '' });

  const load = () => viewResults(filter).then(({ data }) => setResults(data.results));

  useEffect(() => { load(); }, [filter]);

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'score', label: 'Score' },
    { key: 'status', label: 'Status' },
  ];

  const rows = results.map((r) => ({
    id: r.id,
    studentName: r.Student?.fullName,
    score: `${r.score ?? '-'} / ${r.maxScore ?? '-'}`,
    status: r.status,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Results</h1>
      <div className="flex gap-3 mb-4">
        {['classId', 'armId', 'subjectId'].map((f) => (
          <input key={f} placeholder={f} className="border rounded-md px-3 py-2 text-sm"
            value={filter[f]} onChange={(e) => setFilter({ ...filter, [f]: e.target.value })} />
        ))}
      </div>
      <Table
        columns={columns}
        rows={rows}
        actions={(row) =>
          row.status === 'unreleased' ? (
            <Button
              className="text-xs px-2 py-1"
              onClick={async () => { await releaseResult(row.id); load(); }}
            >
              Release
            </Button>
          ) : (
            <span className="text-xs text-green-600">Released</span>
          )
        }
      />
    </div>
  );
}
