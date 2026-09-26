import { useState } from 'react';
import { addArm, deleteArm } from '../../../api/school.api';
import Button from '../../../components/common/Button';

export default function ArmSettings() {
  const [form, setForm] = useState({ name: '', classId: '' });
  const [arms, setArms] = useState([]); // TODO: load from useSchoolStore/getSchool()

  const handleAdd = async (e) => {
    e.preventDefault();
    const { data } = await addArm(form);
    setArms([...arms, data.arm]);
    setForm({ name: '', classId: '' });
  };

  const handleDelete = async (id) => {
    await deleteArm(id);
    setArms(arms.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Arm Settings</h1>
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow space-y-3 mb-6">
        <input className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Arm name (e.g. A)"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Class ID"
          value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} />
        <Button type="submit" className="w-full">Add Arm</Button>
      </form>
      <ul className="space-y-2">
        {arms.map((a) => (
          <li key={a.id} className="flex justify-between bg-white px-4 py-2 rounded shadow text-sm">
            {a.name}
            <button onClick={() => handleDelete(a.id)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
