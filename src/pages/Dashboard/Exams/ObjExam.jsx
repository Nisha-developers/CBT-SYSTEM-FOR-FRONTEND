import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { listExams } from '../../../api/exam.api';
import { useExamStore } from '../../../store/useExamStore';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import { 
  Settings, 
  FileText, 
  ClipboardList, 
  Plus, 
  ChevronDown, 
  MoreHorizontal,
  Search,
  X,
  Calendar,
  BookOpen,
  Users,
  Clock,
  Award,
  Target,
  ArrowRight,
  Eye
} from 'lucide-react';

// --- JUNK DATA: EXAM CONFIGURATIONS ---
const MOCK_EXAM_CONFIGS = [
  { id: '1', title: 'Mathematics Mid-Term', subject: 'Mathematics', class: 'SS2', arm: 'A', status: 'Active', totalQuestions: 50, duration: '60 mins', totalMarks: 100, passMark: 40, date: 'Sep 28, 2026', createdAt: 'Sep 20, 2026' },
  { id: '2', title: 'English Language Assessment', subject: 'English', class: 'SS1', arm: 'B', status: 'Active', totalQuestions: 60, duration: '75 mins', totalMarks: 100, passMark: 45, date: 'Sep 28, 2026', createdAt: 'Sep 18, 2026' },
  { id: '3', title: 'Physics Mock Examination', subject: 'Physics', class: 'SS3', arm: 'A', status: 'Scheduled', totalQuestions: 40, duration: '45 mins', totalMarks: 80, passMark: 35, date: 'Sep 29, 2026', createdAt: 'Sep 15, 2026' },
  { id: '4', title: 'Chemistry Practical', subject: 'Chemistry', class: 'SS3', arm: 'C', status: 'Completed', totalQuestions: 30, duration: '30 mins', totalMarks: 50, passMark: 25, date: 'Sep 27, 2026', createdAt: 'Sep 12, 2026' },
  { id: '5', title: 'Biology Mid-Term', subject: 'Biology', class: 'SS2', arm: 'B', status: 'Active', totalQuestions: 50, duration: '60 mins', totalMarks: 100, passMark: 40, date: 'Sep 26, 2026', createdAt: 'Sep 10, 2026' },
  { id: '6', title: 'Further Mathematics Test', subject: 'Further Maths', class: 'SS3', arm: 'B', status: 'Scheduled', totalQuestions: 40, duration: '60 mins', totalMarks: 80, passMark: 35, date: 'Sep 30, 2026', createdAt: 'Sep 08, 2026' },
  { id: '7', title: 'Economics Assessment', subject: 'Economics', class: 'SS1', arm: 'A', status: 'Active', totalQuestions: 50, duration: '60 mins', totalMarks: 100, passMark: 40, date: 'Sep 25, 2026', createdAt: 'Sep 05, 2026' },
  { id: '8', title: 'Government Mock', subject: 'Government', class: 'SS2', arm: 'C', status: 'Completed', totalQuestions: 60, duration: '90 mins', totalMarks: 100, passMark: 45, date: 'Sep 24, 2026', createdAt: 'Sep 02, 2026' },
];

export default function ObjExam() {
  const { exams, setExams } = useExamStore();
  const [activeTab, setActiveTab] = useState('config');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [disableQuestion, setDisableQuestion] = useState(false);
  
  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterArm, setFilterArm] = useState('');

  // --- MODAL STATE ---
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    listExams({ type: 'OBJ' }).then(({ data }) => setExams(data.exams));
  }, []);

  const sourceExams = exams && exams.length > 0 ? exams : MOCK_EXAM_CONFIGS;

  // --- FILTERING LOGIC ---
  const filteredExams = useMemo(() => {
    return sourceExams.filter((exam) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        exam.title?.toLowerCase().includes(search) ||
        exam.subject?.toLowerCase().includes(search);
      const matchesClass = filterClass ? exam.class === filterClass : true;
      const matchesArm = filterArm ? exam.arm === filterArm : true;
      return matchesSearch && matchesClass && matchesArm;
    });
  }, [sourceExams, searchTerm, filterClass, filterArm]);

  const uniqueClasses = [...new Set(sourceExams.map(e => e.class))].sort();
  const uniqueArms = [...new Set(sourceExams.map(e => e.arm))].sort();
  const hasActiveFilters = searchTerm || filterClass || filterArm;

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterClass('');
    setFilterArm('');
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => setIsLoadingMore(false), 800);
  };

  const handleOpenModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  const handleSetExam = () => {
    // Automatically move to "Manage Questions" tab when setting examination
    setDisableQuestion(true)
    setIsModalOpen(false);
    setActiveTab('questions');
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      Scheduled: 'bg-amber-50 text-amber-700 border-amber-100',
      Completed: 'bg-blue-50 text-blue-700 border-blue-100',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Objective (OBJ) Exams</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage objective exam configurations across all classes and arms.
          </p>
        </div>
        <Link to="/dashboard/exams/obj/create">
          <Button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Create Exam Config
          </Button>
        </Link>
      </div>

      {/* --- TABS --- */}
      <div className="bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm inline-flex flex-wrap gap-1">
        <button
          onClick={() => {setActiveTab('config'); setDisableQuestion(false)}}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'config' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          Exam Configuration
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg ${disableQuestion? 'cursor-pointer' : 'cursor-not-allowed'} transition-colors ${
            activeTab === 'questions' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900}'
          }`}
       disabled = {!disableQuestion}
        >
          <FileText className="w-4 h-4" />
          Manage Questions
        </button>
      </div>

      {/* --- TAB CONTENT: EXAM CONFIGURATION --- */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Card Header */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Exam Configuration</h2>
              <p className="text-sm text-gray-500 mt-1">
                Browse and manage all objective exam configurations.
              </p>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 self-start">
              {filteredExams.length} {filteredExams.length === 1 ? 'Config' : 'Configs'}
            </span>
          </div>

          {/* --- SEARCH & FILTER BAR --- */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col lg:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by subject or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Class Filter */}
            <div className="relative sm:w-44">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Arm Filter */}
            <div className="relative sm:w-44">
              <select
                value={filterArm}
                onChange={(e) => setFilterArm(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
              >
                <option value="">All Arms</option>
                {uniqueArms.map((arm) => (
                  <option key={arm} value={arm}>Arm {arm}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* --- LIST VIEW (Tiles) --- */}
          {filteredExams.length > 0 ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredExams.map((exam) => (
                <div 
                  key={exam.id} 
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleOpenModal(exam)}
                >
                  {/* Header Row: Status & Date Created */}
                  <div className="flex items-center justify-between mb-4">
                    {renderStatusBadge(exam.status)}
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exam.createdAt || 'Recently'}
                    </span>
                  </div>

                  {/* Subject & Title */}
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {exam.subject}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900 mt-1 line-clamp-1">
                      {exam.title}
                    </h3>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Class</span>
                      <span className="text-sm font-semibold text-gray-900">{exam.class}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Arm</span>
                      <span className="text-sm font-semibold text-gray-900">Arm {exam.arm}</span>
                    </div>
                  </div>

                  {/* Footer: Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {exam.totalQuestions} Questions
                    </span>
                    <span className="text-sm font-medium text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* --- EMPTY STATE --- */
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No exams found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                No exam configurations match your current search or filters. Try adjusting them.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* --- LOAD MORE BUTTON --- */}
          {filteredExams.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-white border border-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Load More
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

<div>Set Question</div>      
      {/* --- MODAL: EXAM CONFIG DETAILS --- */}
      <Modal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        title="Exam Configuration Details"
      >
        {selectedExam && (
          <div className="space-y-6 pt-2">
            
            {/* Header inside modal */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {selectedExam.subject}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {selectedExam.title}
                </h3>
              </div>
              {renderStatusBadge(selectedExam.status)}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Subject</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{selectedExam.subject}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Class & Arm</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{selectedExam.class} - Arm {selectedExam.arm}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Total Questions</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{selectedExam.totalQuestions}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Duration</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{selectedExam.duration}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Total Marks</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{selectedExam.totalMarks}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Pass Mark</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{selectedExam.passMark}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span>Created: {selectedExam.createdAt || 'N/A'}</span>
              <span>Exam Date: {selectedExam.date || 'N/A'}</span>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSetExam}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Set Examination
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}