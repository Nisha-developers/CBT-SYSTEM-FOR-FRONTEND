import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExam, saveAnswer, submitAttempt } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';
import Button from '../../components/common/Button';

// OBJ exam runner: question -> select answer -> saved -> next -> submit.
// (Theory exams would use a textarea instead of options — extend this
// component or branch on exam.type once you build that flow out.)
export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeAttempt, answers, setAnswer } = useExamStore();
  const [exam, setExam] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getExam(id).then(({ data }) => setExam(data.exam));
  }, [id]);

  if (!exam) return <div className="p-6">Loading exam...</div>;
  const questions = exam.questions || [];
  const question = questions[index];

  const selectAnswer = async (opt) => {
    setAnswer(question.id, opt);
    if (activeAttempt) await saveAnswer(activeAttempt.id, question.id, opt);
  };

  const handleSubmit = async () => {
    if (activeAttempt) await submitAttempt(activeAttempt.id);
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Question {index + 1} of {questions.length}</span>
          <span>{exam.durationMinutes} min</span>
        </div>
        {question && (
          <>
            <p className="font-medium mb-4">{question.text}</p>
            <div className="space-y-2 mb-6">
              {Object.entries(question.options || {}).map(([key, text]) => (
                <label key={key} className={`block border rounded-md px-3 py-2 text-sm cursor-pointer ${
                  answers[question.id] === key ? 'border-primary bg-blue-50' : 'border-gray-200'
                }`}>
                  <input type="radio" name={`q-${question.id}`} className="mr-2"
                    checked={answers[question.id] === key} onChange={() => selectAnswer(key)} />
                  {key}. {text}
                </label>
              ))}
            </div>
          </>
        )}
        <div className="flex justify-between">
          <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            Previous
          </Button>
          {index < questions.length - 1 ? (
            <Button onClick={() => setIndex(index + 1)}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Exam</Button>
          )}
        </div>
      </div>
    </div>
  );
}
