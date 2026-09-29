import { useEffect, useState } from 'react';
import { listStudents, addStudent } from '../../api/student.api';
import { useStudentStore } from '../../store/useStudentStore';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { Search, Filter, Trash2, Edit2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const columns = [
  { key: 'firstName', label: 'FirstName' },
  { key: 'lastName', label: 'lastName' },
  { key: 'uniqueId', label: 'UniqueId' },
  { key: 'class', label: 'Class' },
  { key: 'arm', label: 'Arm' },
];

// --- JUNK DATA ARRAY OF OBJECTS ---
// Strictly using the keys from your columns array.
// This replaces API data temporarily for visual preview.
const MOCK_STUDENTS = [
  { _id: '1', firstName: 'Eleanor', lastName: 'Pena', uniqueId: '#01', class: '01', arm: 'A' },
  { _id: '2', firstName: 'Jessica', lastName: 'Rose', uniqueId: '#12', class: '02', arm: 'B' },
  { _id: '3', firstName: 'Jenny', lastName: 'Wilson', uniqueId: '#04', class: '01', arm: 'A' },
  { _id: '4', firstName: 'Guy', lastName: 'Hawkins', uniqueId: '#03', class: '04', arm: 'C' },
  { _id: '5', firstName: 'Jacob', lastName: 'Jones', uniqueId: '#15', class: '04', arm: 'B' },
  { _id: '6', firstName: 'Jacob', lastName: 'Jones', uniqueId: '#15', class: '04', arm: 'A' },
  { _id: '7', firstName: 'Jane', lastName: 'Cooper', uniqueId: '#01', class: '03', arm: 'A' },
  { _id: '8', firstName: 'Floyd', lastName: 'Miles', uniqueId: '#11', class: '01', arm: 'B' },
  { _id: '9', firstName: 'Floyd', lastName: 'Miles', uniqueId: '#11', class: '04', arm: 'A' },
];

export default function Students() {
  const { students, setStudents, filter, setFilter } = useStudentStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', admissionNumber: '', classId: '', armId: '', gender: '' });

  useEffect(() => {
    listStudents(filter).then(({ data }) => setStudents(data.students));
  }, [filter]);

  // Use mock data if the store is empty
  const displayStudents = students && students.length > 0 ? students : MOCK_STUDENTS;

  const handleAdd = async (e) => {
    e.preventDefault();
    await addStudent(form);
    const { data } = await listStudents(filter);
    setStudents(data.students);
    setModalOpen(false);
    setForm({ fullName: '', admissionNumber: '', classId: '', armId: '', gender: '' });
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER SECTION (Inspiration Layout) --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Students List</h1>
     
        
        {/* Purple button in inspiration, adapted to Blue-600 as requested */}
        <Button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Students
        </Button>
      </div>

      {/* --- MAIN CARD CONTAINER (Inspiration Layout) --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Card Header: Title + Search/Filter */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Students Information</h2>
          
          <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-start">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                placeholder="Search class"
                className="w-full sm:w-30 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              />
            </div>
             <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                placeholder="Search arm "
                className="w-full sm::w-30 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              />
            </div>
           
          </div>
        </div>

        {/* Table Section */}
        <div className="">
          <Table 
            columns={columns} 
            rows={displayStudents} 
            actions={() => (
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )} 
          />
        </div>

        {/* --- PAGINATION (Inspiration Layout) --- */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 text-xs font-medium text-white bg-blue-600 rounded-md flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md flex items-center justify-center transition-colors">
              2
            </button>
            <button className="w-8 h-8 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md flex items-center justify-center transition-colors">
              3
            </button>
            <span className="text-gray-400 text-xs px-1">...</span>
            <button className="w-8 h-8 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md flex items-center justify-center transition-colors">
              100
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-gray-500">10 of 100 page</span>
        </div>
      </div>

      {/* --- MODAL (Strictly using your component) --- */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Student">
        <form onSubmit={handleAdd} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['fullName', 'admissionNumber', 'classId', 'armId'].map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">Gender</label>
            <select
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Save Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}