import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { startAttempt,  availableExams } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';
import { signOut } from '../../utils/session';
import { apiError } from '../../api/axios';
import Button from '../../components/common/Button';
import DetectMobile from '../../components/common/DetectMobile';

import { 
  ClipboardList, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  RefreshCw,
  Save,
  Timer,
  Lock,
  Info
} from 'lucide-react';

export default function ExamInstructions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const setActiveAttempt = useExamStore((s) => s.setActiveAttempt);
  const { state } = useLocation();

  
  

  // --- STUDENT ID STATE ---
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [disableStartExam, setDisableStartExam] = useState(false);
  const [examId, setExamId] = useState('');

  const getExamId = (data) =>{
    const id = data.id;
    return id;
  }

  const handleStart = async () => {
    // Validate Student ID before starting
    if (!studentId.trim()) {
      setError('Please enter your Student ID to continue.');
      return;
    }
    setError('');

    try {
      const exam = (await availableExams(studentId)).data;
  const  findSelectedSubject =   exam.exams.find((exam)=>exam.subject === state.selectedSubject);
   const  isMatched =   exam.exams.find((exam)=>exam.subject === state.selectedSubject && exam.arm === state.selectedArm && exam.class === state.selectedClass && exam.typeLabel === state.selectedType );
  const findSelectedArm =  exam.exams.find((exam)=>exam.arm === state.selectedArm);
   const findSelectedClass =  exam.exams.find((exam)=>exam.class === state.selectedClass);
   const findSelectedType = exam.exams.find((exam)=>exam.typeLabel === state.selectedType);
   console.log(Boolean(isMatched));
 
  if (!findSelectedSubject){
    setError('The exam of the subject choosen is not available yet please check and try again');
    setDisableStartExam(true);
    return
  }
  if(!findSelectedArm || !findSelectedClass || !findSelectedType){
    setError('Class or Arm or Type does not match. Please check and try again')
    setDisableStartExam(true);
    return
  }
  if(!isMatched){
    setError('An error has occured, please check and try again');
  }
  else{
     const subjectId = getExamId(isMatched);
     console.log(subjectId);
    const { data } = await startAttempt(subjectId,{studentId});
    console.log(data);
setActiveAttempt(data.attempt);
navigate(`/student/exams/${subjectId}/take`, {
  state: {
    studentId,
  }
});
  }
    } catch (err) {
      setError(apiError(err, 'Could not start the exam.'));
    }
  };
  useEffect(()=>{
    function checkScreenSize(){
  if(innerWidth > 768 ){
    setIsMobile(false);
  }
  else{
    setIsMobile(true);
  }
  if(!state?.selectedArm){
  
    setError('No subject, class and exam type found. Go to exam page and set it');
    setDisableStartExam(true);
    return;
  }

    }
    checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  return ()=>{
    window.removeEventListener('resize',checkScreenSize);
  }
  }, []);

  if(isMobile){
    return(
      <DetectMobile />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
      
      <div className="w-full max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}
        <div className="p-6 lg:p-8 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
              Examination
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
            Exam Instructions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please read carefully before you begin your examination.
          </p>
        </div>

        {/* ========================================================= */}
        {/* STUDENT ID FORM */}
        {/* ========================================================= */}
        <div className="p-6 lg:p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. SCH/SS2/A/001"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (error) setError('');
              }}
              className={`w-full bg-white border text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-colors ${
                error 
                  ? 'border-red-300 focus:ring-red-600/20 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Enter the Student ID provided by your school to begin the examination.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TWO-COLUMN INSTRUCTIONS */}
        {/* ========================================================= */}
        <div className="p-6 lg:p-8">
          
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            Read These Instructions Carefully
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="sm:border-r sm:border-gray-200 sm:pr-6">
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5">
                  <div className="p-1 bg-blue-50 rounded-md border border-blue-100 shrink-0 mt-0.5">
                    <RefreshCw className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                  Do not bring phone or any devices that can implicate you.
                  
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-1 bg-blue-50 rounded-md border border-blue-100 shrink-0 mt-0.5">
                    <Save className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Your answers are saved automatically as you go.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-1 bg-blue-50 rounded-md border border-blue-100 shrink-0 mt-0.5">
                    <Timer className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    The exam auto-submits when the timer runs out.
                  </span>
                </li>
              </ul>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5">
                  <div className="p-1 bg-blue-50 rounded-md border border-blue-100 shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Once submitted, you cannot re-enter this exam.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-1 bg-blue-50 rounded-md border border-blue-100 shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Keep track of the timer displayed at the top of the exam screen.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-1 bg-blue-50 rounded-md border border-blue-100 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Answer all questions before you submit the exam.
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Warning Callout */}
          <div className="mt-6 flex items-start gap-3 p-3 lg:p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-900">
                Important Notice
              </p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
               Please make sure you follow all the rules and regulations governing the examination. Any violation of the examination rules will result in a penalty.
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* FOOTER / START BUTTON */}
        {/* ========================================================= */}
        <div className="p-6 lg:p-8 border-t border-gray-100 bg-gray-50/50">
          <Button 
            className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-colors shadow-sm ${
              studentId.trim() || disableStartExam
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleStart}
            disabled={!studentId.trim() || disableStartExam}
          >
            <CheckCircle2 className="w-4 h-4" />
            Start Exam
          </Button>
          <p className="text-xs text-gray-400 text-center mt-3">
            By clicking "Start Exam", you agree to follow the examination rules.
          </p>
        </div>

      </div>
    </div>
  );
}