import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listExams } from '../../../api/exam.api';
import { useExamStore } from '../../../store/useExamStore';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'totalQuestions', label: 'Questions' },
];

export default function ObjExam() {
  const { exams, setExams } = useExamStore();

  useEffect(() => {
    listExams({ type: 'OBJ' }).then(({ data }) => setExams(data.exams));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Objective (OBJ) Exams</h1>
        <Link to="/dashboard/exams/obj/create">
          <Button>+ Create OBJ Exam</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        rows={exams}
        actions={(exam) => (
          <Link to={`/dashboard/exams/obj/${exam.id}/import`} className="text-primary text-sm">
            Manage Questions
          </Link>
        )}
      />
    </div>
  );
}
