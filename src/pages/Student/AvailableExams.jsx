import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { availableExams } from '../../api/exam.api';
import { apiError } from '../../api/axios';
import Modal from '../../components/common/Modal';
import DetectMobile from '../../components/common/DetectMobile';
import { useSchoolStore } from '../../store/useSchoolStore';
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




const EXAM_TYPE = ['Theory', 'Objectives']

export default function AvailableExams() {
 const classes = useSchoolStore((state) => state.classes);
const classArms = useSchoolStore((state) => state.classArms);
const arms = useSchoolStore((state) => state.arms);
const optionalSubjects = useSchoolStore((state) => state.optionalSubjects);
const subjects = useSchoolStore((state) => state.subjects);
const loadSchool = useSchoolStore((state) => state.loadSchool);
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [searchError, setSearchError] = useState('');
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
  
  async function loadSchools() {
    try {
      await loadSchool();

      const {
        classes: classApi,
        arms: armApi,
        subjects: subjectApi,
        optionalSubjects: optionalSubject,
      } = useSchoolStore.getState();
      console.log(classApi);
setExams([{ classApi, armApi, 'subjectApi': [subjectApi, optionalSubject].flatMap((file)=>file) }]);
    } catch (err) {
      console.error(err);
    }
  }

  loadSchools();
}, []);


  // dropdown options come from the exams this student can actually take
  const uniq = (list) => [...new Set(list)].sort();
  const classOptions = uniq(exams[0]?.classApi.map((e) => e?.name));
  const armOptions = uniq(exams[0]?.armApi.map((e) => e.name));
  const subjectOptions = uniq(exams[0]?.subjectApi.map((e) => e.name));
  console.log(exams);
  


  

  // --- VALIDATION: All three must be selected ---
  const isSelectionComplete = selectedClass && selectedArm && selectedSubject && selectedType;

  const handleContinue = () => {
    if (!isSelectionComplete) return;
    setSearchError('');
    localStorage.setItem('mode', 'Exam mode');
navigate("/student/exams/instructions", {
  state: {
    selectedClass,
    selectedArm,
    selectedSubject,
    selectedType,
  },
});
   
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
                    {classOptions.map((cls) => (
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
                    {armOptions.map((arm) => (
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
                    {subjectOptions.map((sub) => (
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

            {searchError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{searchError}</p>
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