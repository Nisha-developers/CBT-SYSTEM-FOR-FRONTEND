import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteSchool } from '../../../api/school.api';
import { useAuthStore } from '../../../store/useAuthStore';
import Button from '../../../components/common/Button';

// Section 19: destructive reset — requires typing DELETE to confirm,
// exactly like the architecture doc specifies.
export default function DeleteSchool() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    try {
      await deleteSchool(confirmText);
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Deletion failed');
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6 text-red-600">Delete School</h1>
      <div className="bg-white p-6 rounded-lg shadow border border-red-200">
        <p className="text-sm text-gray-700 mb-4">
          <strong>Warning:</strong> This will permanently remove your school's data —
          students, classes, arms, subjects, exams, questions, attempts, and results.
        </p>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <input
          className="w-full border rounded-md px-3 py-2 text-sm mb-4"
          placeholder='Type "DELETE" to confirm'
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
        <Button variant="danger" disabled={confirmText !== 'DELETE'} onClick={handleDelete}>
          Delete Permanently
        </Button>
      </div>
    </div>
  );
}
