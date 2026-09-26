import { useEffect, useState } from 'react';
import { listStudents, addStudent } from '../../api/student.api';
import { useStudentStore } from '../../store/useStudentStore';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const columns = [
  { key: 'fullName', label: 'Name' },
  { key: 'admissionNumber', label: 'Admission No.' },
];

export default function Students() {
  const { students, setStudents, filter, setFilter } = useStudentStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', admissionNumber: '', classId: '', armId: '', gender: '' });

  useEffect(() => {
    listStudents(filter).then(({ data }) => setStudents(data.students));
  }, [filter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addStudent(form);
    const { data } = await listStudents(filter);
    setStudents(data.students);
    setModalOpen(false);
    setForm({ fullName: '', admissionNumber: '', classId: '', armId: '', gender: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>
        <Button onClick={() => setModalOpen(true)}>+ Add Student</Button>
      </div>

      {/* TODO: replace with real <select> dropdowns populated from useSchoolStore */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Class ID filter"
          className="border rounded-md px-3 py-2 text-sm"
          value={filter.classId}
          onChange={(e) => setFilter({ ...filter, classId: e.target.value })}
        />
        <input
          placeholder="Arm ID filter"
          className="border rounded-md px-3 py-2 text-sm"
          value={filter.armId}
          onChange={(e) => setFilter({ ...filter, armId: e.target.value })}
        />
      </div>

      <Table columns={columns} rows={students} actions={() => <button className="text-primary text-sm">View/Edit</button>} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Student">
        <form onSubmit={handleAdd} className="space-y-3">
          {['fullName', 'admissionNumber', 'classId', 'armId'].map((field) => (
            <input
              key={field}
              placeholder={field}
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
          <Button type="submit" className="w-full">Add Student</Button>
        </form>
      </Modal>
    </div>
  );
}
