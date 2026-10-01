import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  X, 
  User, 
  BookOpen, 
  Brain, 
  Heart, 
  MessageSquare, 
  Star, 
  Save, 
  ArrowLeft,
  Info,
  Users,
  GraduationCap
} from 'lucide-react';

// --- MOCK STUDENTS (for search) ---
const MOCK_STUDENTS = [
  { id: 'STU-2026-001', name: 'Eleanor Pena', class: 'SS2', arm: 'A', gender: 'Female' },
  { id: 'STU-2026-002', name: 'Jessica Rose', class: 'SS2', arm: 'A', gender: 'Female' },
  { id: 'STU-2026-003', name: 'Michael Brown', class: 'SS2', arm: 'A', gender: 'Male' },
  { id: 'STU-2026-004', name: 'Emily Davis', class: 'SS2', arm: 'B', gender: 'Female' },
  { id: 'STU-2026-005', name: 'David Wilson', class: 'SS2', arm: 'B', gender: 'Male' },
  { id: 'STU-2026-006', name: 'Sarah Johnson', class: 'SS1', arm: 'A', gender: 'Female' },
  { id: 'STU-2026-007', name: 'James Smith', class: 'SS1', arm: 'A', gender: 'Male' },
  { id: 'STU-2026-008', name: 'Linda Taylor', class: 'SS1', arm: 'B', gender: 'Female' },
];

// --- COGNITIVE BEHAVIOR TRAITS ---
const COGNITIVE_TRAITS = [
  { key: 'memory', label: 'Memory Retention', description: 'Ability to recall learned concepts.' },
  { key: 'problemSolving', label: 'Problem Solving', description: 'Ability to solve complex problems.' },
  { key: 'criticalThinking', label: 'Critical Thinking', description: 'Ability to analyze and evaluate.' },
  { key: 'creativity', label: 'Creativity', description: 'Ability to think outside the box.' },
  { key: 'concentration', label: 'Concentration', description: 'Ability to focus during lessons.' },
];

// --- BEHAVIORAL TRAITS ---
const BEHAVIORAL_TRAITS = [
  { key: 'punctuality', label: 'Punctuality', description: 'Arrives on time to class.' },
  { key: 'neatness', label: 'Neatness', description: 'Keeps work and appearance tidy.' },
  { key: 'politeness', label: 'Politeness', description: 'Respects teachers and peers.' },
  { key: 'honesty', label: 'Honesty', description: 'Truthful in all dealings.' },
  { key: 'participation', label: 'Class Participation', description: 'Actively engages in class.' },
];

const ReviewResults = ({ onSubmit }) => {
  // --- SELECTION STATE ---
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterArm, setFilterArm] = useState('');

  // --- REVIEW FORM STATE ---
  const [cognitiveRatings, setCognitiveRatings] = useState({});
  const [behavioralRatings, setBehavioralRatings] = useState({});
  const [academicRemark, setAcademicRemark] = useState('');
  const [behavioralRemark, setBehavioralRemark] = useState('');
  const [teacherRemark, setTeacherRemark] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- FILTERING LOGIC ---
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((student) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        student.name.toLowerCase().includes(search) ||
        student.id.toLowerCase().includes(search);
      const matchesClass = filterClass ? student.class === filterClass : true;
      const matchesArm = filterArm ? student.arm === filterArm : true;
      return matchesSearch && matchesClass && matchesArm;
    });
  }, [searchTerm, filterClass, filterArm]);

  const uniqueClasses = [...new Set(MOCK_STUDENTS.map(s => s.class))].sort();
  const uniqueArms = [...new Set(MOCK_STUDENTS.map(s => s.arm))].sort();
  const hasActiveFilters = searchTerm || filterClass || filterArm;

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterClass('');
    setFilterArm('');
  };

  // --- SELECT A STUDENT ---
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    // Reset form state
    setCognitiveRatings(COGNITIVE_TRAITS.reduce((acc, t) => ({ ...acc, [t.key]: 0 }), {}));
    setBehavioralRatings(BEHAVIORAL_TRAITS.reduce((acc, t) => ({ ...acc, [t.key]: 0 }), {}));
    setAcademicRemark('');
    setBehavioralRemark('');
    setTeacherRemark('');
  };

  // --- BACK TO SEARCH ---
  const handleBack = () => {
    setSelectedStudent(null);
  };

  // --- RATING HANDLERS ---
  const handleCognitiveRate = (key, value) => {
    setCognitiveRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleBehavioralRate = (key, value) => {
    setBehavioralRatings((prev) => ({ ...prev, [key]: value }));
  };

  // --- SUBMIT ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (onSubmit) onSubmit({
        studentId: selectedStudent.id,
        cognitiveRatings,
        behavioralRatings,
        academicRemark,
        behavioralRemark,
        teacherRemark,
      });
      handleBack();
    }, 1000);
  };

  // --- STAR RATING COMPONENT ---
  const StarRating = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 ${
              star <= value ? 'fill-blue-600 text-blue-600' : 'fill-gray-100 text-gray-300'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-xs font-medium text-gray-500">
        {value > 0 ? `${value}/5` : 'Not rated'}
      </span>
    </div>
  );

  // =========================================================
  // STEP 1: STUDENT SEARCH & SELECTION VIEW
  // =========================================================
  if (!selectedStudent) {
    return (
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Student Results</h1>
          <p className="text-sm text-gray-500 mt-1">
            Search and select a student to provide academic and behavioral feedback.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Student ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="relative sm:w-44">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          <div className="relative sm:w-44">
            <select
              value={filterArm}
              onChange={(e) => setFilterArm(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
            >
              <option value="">All Arms</option>
              {uniqueArms.map((arm) => (
                <option key={arm} value={arm}>Arm {arm}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>

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

        {/* Student List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Select a Student</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {filteredStudents.length > 0 ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      <span className="text-blue-600 text-lg font-bold">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{student.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{student.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Class</span>
                      <span className="text-sm font-semibold text-gray-900">{student.class}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Arm</span>
                      <span className="text-sm font-semibold text-gray-900">Arm {student.arm}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Click to review</span>
                    <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Give Remark →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No students found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                No students match your search or filters. Try adjusting them.
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
      </div>
    );
  }

  // =========================================================
  // STEP 2: REVIEW FORM FOR SELECTED STUDENT
  // =========================================================
  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto space-y-6 h-[85vh]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Results</h1>
            <p className="text-sm text-gray-500 mt-1">
              Provide academic and behavioral feedback for this student.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Student Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              <span className="text-blue-600 text-lg font-bold">
                {selectedStudent.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{selectedStudent.name}</h2>
              <p className="text-xs text-gray-500">{selectedStudent.id} • {selectedStudent.class} - Arm {selectedStudent.arm}</p>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <X className="w-4 h-4" />
            Change Student
          </button>
        </div>
      </div>

      {/* Form */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto">
          
          {/* Cognitive Behavior */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Cognitive Behavior</h2>
                <p className="text-xs text-gray-500 mt-0.5">Rate the student's cognitive abilities (1-5).</p>
              </div>
            </div>

            <div className="space-y-4">
              {COGNITIVE_TRAITS.map((trait) => (
                <div key={trait.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{trait.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{trait.description}</p>
                  </div>
                  <StarRating 
                    value={cognitiveRatings[trait.key] || 0} 
                    onChange={(val) => handleCognitiveRate(trait.key, val)} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Traits */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Heart className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Behavioral Traits</h2>
                <p className="text-xs text-gray-500 mt-0.5">Rate the student's behavioral conduct (1-5).</p>
              </div>
            </div>

            <div className="space-y-4">
              {BEHAVIORAL_TRAITS.map((trait) => (
                <div key={trait.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{trait.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{trait.description}</p>
                  </div>
                  <StarRating 
                    value={behavioralRatings[trait.key] || 0} 
                    onChange={(val) => handleBehavioralRate(trait.key, val)} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Academic Remark */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Academic Remark</h2>
                <p className="text-xs text-gray-500 mt-0.5">Comment on the student's academic performance.</p>
              </div>
            </div>

            <textarea
              rows={4}
              placeholder="e.g. Eleanor has shown excellent improvement in Mathematics this term..."
              value={academicRemark}
              onChange={(e) => setAcademicRemark(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-none"
            />
          </div>

          {/* Behavioral Remark */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Heart className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Behavioral Remark</h2>
                <p className="text-xs text-gray-500 mt-0.5">Comment on the student's conduct and behavior.</p>
              </div>
            </div>

            <textarea
              rows={4}
              placeholder="e.g. Eleanor is a well-behaved and respectful student..."
              value={behavioralRemark}
              onChange={(e) => setBehavioralRemark(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-none"
            />
          </div>

          {/* Teacher's Final Remark */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Teacher's Final Remark</h2>
                <p className="text-xs text-gray-500 mt-0.5">Overall summary remark for the report card.</p>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. A highly dedicated student with a bright future. Keep up the excellent work!"
              value={teacherRemark}
              onChange={(e) => setTeacherRemark(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-none"
            />

            <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                This remark will appear on the student's final report card and will be visible to parents/guardians.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Review
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ReviewResults;