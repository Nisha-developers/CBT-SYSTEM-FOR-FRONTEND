// Quick summary cards (Section 8). Wire each count up to its own
// lightweight API call (or a combined /api/dashboard/summary endpoint
// you add later) once the backend has real data to show.
const stats = [
  { label: 'Students', value: '—' },
  { label: 'Classes', value: '—' },
  { label: 'Exams', value: '—' },
  { label: 'Results Pending', value: '—' },
];

export default function Overview() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow p-5">
            <div className="text-2xl font-bold text-primary">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
