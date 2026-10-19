import { useCallback, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { listExams, setExamOpen, deleteExam } from '../../../api/exam.api';
import { apiError } from '../../../api/axios';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import QuestionImport from './QuestionImport.jsx';
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
import SetConfig from './SetConfig.jsx';

export default function TheoryExam() {
  const [exams, setExams] = useState([]);
  const [pageError, setPageError] = useState('');
  const [activeTab, setActiveTab] = useState('config');
  const [disableQuestion, setDisableQuestion] = useState(false);
  const [openConfig, openSetConfig] = useState(false);

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterArm, setFilterArm] = useState('');

  // --- MODAL STATE ---
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadExams = useCallback(async () => {
    try {
      const { data } = await listExams({ type: 'THEORY' });
      setExams(data.exams);
      setPageError('');
    } catch (err) {
      setPageError(apiError(err, 'Could not load exams.'));
    }
  }, []);

  useEffect(() => { loadExams(); }, [loadExams]);

  const sourceExams = exams;
  
  const handleOpenConfig = () => {
    openSetConfig(true);
  };

  const handleCloseConfig = () => {
    openSetConfig(false);
  };

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

  const handleOpenModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  // Called after a new config is saved (with the created exam) or from the details modal.
  const handleSetExam = (exam) => {
    const target = exam && exam.id ? exam : selectedExam;
    setSelectedExam(target);
    setDisableQuestion(true);
    setIsModalOpen(false);
    setActiveTab('questions');
    loadExams();
  };

  const handleToggleOpen = async () => {
    try {
      const { data } = await setExamOpen(selectedExam.id, !selectedExam.openExam);
      setSelectedExam(data.exam);
      loadExams();
    } catch (err) {
      setPageError(apiError(err));
    }
  };

  const handleDeleteExam = async () => {
    if (!window.confirm(`Delete "${selectedExam.title}" and all its questions?`)) return;
    try {
      await deleteExam(selectedExam.id);
      handleCloseModal();
      loadExams();
    } catch (err) {
      setPageError(apiError(err));
      handleCloseModal();
    }
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
      {pageError && <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{pageError}</div>}
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Theory Exams</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage theory exam configurations across all classes and arms.
          </p>
        </div>
        <Button 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm" 
          onClick={handleOpenConfig}
        >
          <Plus className="w-4 h-4" />
          Create Exam Config
        </Button>
      </div>

      {/* --- TABS --- */}
      <div className="bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm inline-flex flex-wrap gap-1">
        <button
          onClick={() => { setActiveTab('config'); setDisableQuestion(false); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'config' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          Exam Configuration
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg ${disableQuestion ? 'cursor-pointer' : 'cursor-not-allowed'} transition-colors ${
            activeTab === 'questions' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          disabled={!disableQuestion}
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
                Browse and manage all theory exam configurations.
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
                No theory exam configurations match your current search or filters. Try adjusting them.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* --- TAB CONTENT: MANAGE QUESTIONS --- */}
      {activeTab === 'questions' && <QuestionImport exam={selectedExam} onChanged={loadExams} />}

      {/* --- MODAL: EXAM CONFIG DETAILS --- */}
      <Modal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        title="Theory Exam Configuration Details"
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

            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span>Questions uploaded: {selectedExam.uploadedQuestions} / {selectedExam.totalQuestions}</span>
              <span>Time: {selectedExam.time}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <button onClick={handleToggleOpen} className="text-blue-600 hover:underline">
                {selectedExam.openExam ? 'Close exam (follow schedule)' : 'Open exam now'}
              </button>
              <button onClick={handleDeleteExam} className="text-red-600 hover:underline">Delete exam</button>
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

      {/* --- MODAL: SET CONFIG --- */}
      <Modal open={openConfig} title="Set Theory Exam Config">
        <SetConfig 
          type="theory" 
          saveConfig={handleSetExam} 
          onClose={handleCloseConfig} 
        />
      </Modal>

    </div>
  );
}