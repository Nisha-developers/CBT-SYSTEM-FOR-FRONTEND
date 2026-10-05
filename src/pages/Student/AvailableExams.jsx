import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { availableExams } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';
import Modal from '../../components/common/Modal';
import DetectMobile from '../../components/common/DetectMobile';
import { 
  Search, 
  ChevronDown, 
  Users, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  FileText,
  Clock,
  Award,
  Info,
  Play,
  ClipboardList,
  Smartphone,
  ShieldAlert
} from 'lucide-react';




// =========================================================
// MOCK DATA (For visual preview — replace with real API)
// =========================================================
const MOCK_EXAMS = [
  { id: '1', title: 'Mathematics Mid-Term', type: 'OBJ', durationMinutes: 60, subject: 'Mathematics', class: 'SS2', arm: 'A', totalQuestions: 50, status: 'Active' },
  { id: '2', title: 'Mathematics Theory', type: 'Theory', durationMinutes: 90, subject: 'Mathematics', class: 'SS2', arm: 'A', totalQuestions: 10, status: 'Active' },
  { id: '3', title: 'English Language Assessment', type: 'OBJ', durationMinutes: 75, subject: 'English', class: 'SS2', arm: 'A', totalQuestions: 60, status: 'Active' },
  { id: '4', title: 'Physics Mock', type: 'OBJ', durationMinutes: 45, subject: 'Physics', class: 'SS2', arm: 'B', totalQuestions: 40, status: 'Active' },
  { id: '5', title: 'Chemistry Practical', type: 'Theory', durationMinutes: 120, subject: 'Chemistry', class: 'SS3', arm: 'A', totalQuestions: 5, status: 'Active' },
  { id: '6', title: 'Biology Mid-Term', type: 'OBJ', durationMinutes: 60, subject: 'Biology', class: 'SS3', arm: 'A', totalQuestions: 50, status: 'Active' },
  { id: '7', title: 'Economics Assessment', type: 'OBJ', durationMinutes: 60, subject: 'Economics', class: 'SS1', arm: 'A', totalQuestions: 50, status: 'Active' },
  { id: '8', title: 'Further Mathematics Theory', type: 'Theory', durationMinutes: 120, subject: 'Further Maths', class: 'SS3', arm: 'B', totalQuestions: 8, status: 'Active' },
];

// =========================================================
// DROPDOWN OPTIONS (For visual preview — replace with school store data)
// =========================================================
const CLASS_OPTIONS = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
const ARM_OPTIONS = ['A', 'B', 'C', 'D'];
const SUBJECT_OPTIONS = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Further Maths', 'Government'];
const EXAM_TYPE = ['Theory', 'Objectives']

export default function AvailableExams() {
  const navigate = useNavigate();
  const { exams, setExams } = useExamStore();
  const [isMobile, setIsMobile] = useState(false);
  
 
useEffect(()=>{
  function checkScreenSize(){
if(innerWidth > 768 ){
  setIsMobile(false);
}
else{
  setIsMobile(true);
}
  }
  checkScreenSize();
window.addEventListener('resize', checkScreenSize);
return ()=>{
  window.removeEventListener('resize',checkScreenSize);
}
}, [])
  // --- SELECTION STATE ---
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedArm, setSelectedArm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedType, setselectedType] = useState('');

  // --- YOUR ORIGINAL FETCH LOGIC (UNTOUCHED) ---
  useEffect(() => {
    availableExams().then(({ data }) => setExams(data.exams));
  }, []);

  // Use mock data if the store is empty
  const sourceExams = exams && exams.length > 0 ? exams : MOCK_EXAMS;

  

  // --- VALIDATION: All three must be selected ---
  const isSelectionComplete = selectedClass && selectedArm && selectedSubject && selectedType;

  const handleContinue = () => {
    if (!isSelectionComplete) return;
    setIsChecking(true);
    handleReset();
    navigate('/student/exams/instructions');
  };

  const handleReset = () => {
    setSelectedClass('');
    setselectedType('');
    setSelectedArm('');
    setSelectedSubject('');
    setHasSearched(false);
  };

  
  if(isMobile){
     return (
   <DetectMobile />
     )
  }

  

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Available Exams
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a class, arm,subject and type to view available examinations.
          </p>
        </div>

        {/* ========================================================= */}
        {/* SELECTION FORM (Compulsory) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Card Header */}
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Exam Selection</h2>
              <p className="text-xs text-gray-500">
                All three fields are compulsory before viewing exams.
              </p>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-5">
            
            {/* Three Dropdowns */}
            <div className="grid sm:grid-cols-4 gap-4">
              
              {/* Class */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setHasSearched(false);
                    }}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Arm */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  Arm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedArm}
                    onChange={(e) => {
                      setSelectedArm(e.target.value);
                      setHasSearched(false);
                    }}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
                  >
                    <option value="">Select Arm</option>
                    {ARM_OPTIONS.map((arm) => (
                      <option key={arm} value={arm}>Arm {arm}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setHasSearched(false);
                    }}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
                  >
                    <option value="">Select Subject</option>
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
                {/*Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setselectedType(e.target.value);
                      setHasSearched(false);
                    }}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
                  >
                    <option value="">Select Type </option>
                    {EXAM_TYPE.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
            

            {/* Selection Summary */}
            {isSelectionComplete &&(
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Ready to search: <strong>{selectedClass}</strong> · <strong>Arm {selectedArm}</strong> · <strong>{selectedSubject}</strong> · <strong>{selectedType}</strong>
                </p>
              </div>
            )}

            {/* Continue Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2"> 
              <button
                type="button"
                onClick={handleContinue}
                disabled={!isSelectionComplete}
                className={`flex-1 sm:flex-none sm:min-w-[180px] flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  isSelectionComplete
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                    Continue
                    <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}