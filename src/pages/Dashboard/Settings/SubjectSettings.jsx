import { useState } from 'react';
import { addSubject, deleteSubject } from '../../../api/school.api';
import Button from '../../../components/common/Button';

export default function SubjectSettings() {
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState([]); // TODO: load from useSchoolStore/getSchool()

  const handleAdd = async (e) => {
    e.preventDefault();
    const { data } = await addSubject({ name });
    setSubjects([...subjects, data.subject]);
    setName('');
  };

  const handleDelete = async (id) => {
    await deleteSubject(id);
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Subject Settings</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input className="flex-1 border rounded-md px-3 py-2 text-sm" placeholder="Subject name"
          value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-2">
        {subjects.map((s) => (
          <li key={s.id} className="flex justify-between bg-white px-4 py-2 rounded shadow text-sm">
            {s.name}
            <button onClick={() => handleDelete(s.id)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
