import { useParams } from 'react-router-dom';
import ObjExam from './ObjExam';
import TheoryExam from './TheoryExam';

// Exam ids look like "obj-<uid>" / "theory-<uid>".
export default function TakeExam() {
  const { id } = useParams();
  return id?.startsWith('theory-') ? <TheoryExam /> : <ObjExam />;
}
