import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listExams } from '../../../api/exam.api';
import { useExamStore } from '../../../store/useExamStore';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
];

export default function TheoryExam() {
  const { exams, setExams } = useExamStore();

  useEffect(() => {
    listExams({ type: 'THEORY' }).then(({ data }) => setExams(data.exams));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Theory Exams</h1>
        <Link to="/dashboard/exams/theory/create">
          <Button>+ Create Theory Exam</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        rows={exams}
        actions={() => (
          <Link to="/dashboard/results/theory" className="text-primary text-sm">
            Record Marks
          </Link>
        )}
      />
    </div>
  );
}
