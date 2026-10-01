import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  X, 
  Calendar, 
  BookOpen, 
  Award, 
  Target, 
  TrendingUp,
  ChevronRight,
  User,
  Users,
  GraduationCap,
  Printer,
  Download,
  ArrowLeft
} from 'lucide-react';

// --- MOCK STUDENTS ---
const MOCK_STUDENTS = [
  { id: 'STU-2026-001', name: 'Eleanor Pena', class: 'SS2', arm: 'A' },
  { id: 'STU-2026-002', name: 'Jessica Rose', class: 'SS2', arm: 'A' },
  { id: 'STU-2026-003', name: 'Michael Brown', class: 'SS2', arm: 'A' },
  { id: 'STU-2026-004', name: 'Emily Davis', class: 'SS2', arm: 'B' },
  { id: 'STU-2026-005', name: 'David Wilson', class: 'SS2', arm: 'B' },
  { id: 'STU-2026-006', name: 'Sarah Johnson', class: 'SS1', arm: 'A' },
  { id: 'STU-2026-007', name: 'James Smith', class: 'SS1', arm: 'A' },
  { id: 'STU-2026-008', name: 'Linda Taylor', class: 'SS1', arm: 'B' },
];

// --- MOCK 6-YEAR RESULTS DATA ---
// Structure: sessions -> terms -> subjects -> { obj, theory, total }
const MOCK_PAST_RESULTS = {
  'STU-2026-001': [
    {
      session: '2025/2026',
      current: true,
      terms: [
        {
          term: 'First Term',
          average: 82.4,
          position: 2,
          totalStudents: 45,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 45, theory: 42, total: 87 },
            English: { obj: 40, theory: 44, total: 84 },
            Physics: { obj: 38, theory: 40, total: 78 },
            Chemistry: { obj: 42, theory: 45, total: 87 },
            Biology: { obj: 41, theory: 38, total: 79 },
          },
        },
        {
          term: 'Second Term',
          average: 85.2,
          position: 1,
          totalStudents: 45,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 48, theory: 45, total: 93 },
            English: { obj: 44, theory: 46, total: 90 },
            Physics: { obj: 42, theory: 44, total: 86 },
            Chemistry: { obj: 46, theory: 48, total: 94 },
            Biology: { obj: 45, theory: 43, total: 88 },
          },
        },
        {
          term: 'Third Term',
          average: 88.1,
          position: 1,
          totalStudents: 45,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 49, theory: 48, total: 97 },
            English: { obj: 46, theory: 47, total: 93 },
            Physics: { obj: 45, theory: 46, total: 91 },
            Chemistry: { obj: 48, theory: 49, total: 97 },
            Biology: { obj: 47, theory: 45, total: 92 },
          },
        },
      ],
    },
    {
      session: '2024/2025',
      terms: [
        {
          term: 'First Term',
          average: 78.5,
          position: 4,
          totalStudents: 42,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 40, theory: 38, total: 78 },
            English: { obj: 42, theory: 40, total: 82 },
            Physics: { obj: 36, theory: 34, total: 70 },
            Chemistry: { obj: 38, theory: 40, total: 78 },
            Biology: { obj: 40, theory: 42, total: 82 },
          },
        },
        {
          term: 'Second Term',
          average: 80.1,
          position: 3,
          totalStudents: 42,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 42, theory: 40, total: 82 },
            English: { obj: 44, theory: 42, total: 86 },
            Physics: { obj: 38, theory: 36, total: 74 },
            Chemistry: { obj: 40, theory: 42, total: 82 },
            Biology: { obj: 42, theory: 40, total: 82 },
          },
        },
        {
          term: 'Third Term',
          average: 82.3,
          position: 2,
          totalStudents: 42,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 44, theory: 42, total: 86 },
            English: { obj: 46, theory: 44, total: 90 },
            Physics: { obj: 40, theory: 38, total: 78 },
            Chemistry: { obj: 42, theory: 44, total: 86 },
            Biology: { obj: 44, theory: 42, total: 86 },
          },
        },
      ],
    },
    {
      session: '2023/2024',
      terms: [
        {
          term: 'First Term',
          average: 75.2,
          position: 5,
          totalStudents: 40,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 38, theory: 36, total: 74 },
            English: { obj: 40, theory: 38, total: 78 },
            Physics: { obj: 34, theory: 32, total: 66 },
            Chemistry: { obj: 36, theory: 38, total: 74 },
            Biology: { obj: 38, theory: 40, total: 78 },
          },
        },
        {
          term: 'Second Term',
          average: 77.8,
          position: 4,
          totalStudents: 40,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 40, theory: 38, total: 78 },
            English: { obj: 42, theory: 40, total: 82 },
            Physics: { obj: 36, theory: 34, total: 70 },
            Chemistry: { obj: 38, theory: 40, total: 78 },
            Biology: { obj: 40, theory: 42, total: 82 },
          },
        },
        {
          term: 'Third Term',
          average: 79.5,
          position: 3,
          totalStudents: 40,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 42, theory: 40, total: 82 },
            English: { obj: 44, theory: 42, total: 86 },
            Physics: { obj: 38, theory: 36, total: 74 },
            Chemistry: { obj: 40, theory: 42, total: 82 },
            Biology: { obj: 42, theory: 40, total: 82 },
          },
        },
      ],
    },
    {
      session: '2022/2023',
      terms: [
        {
          term: 'First Term',
          average: 70.4,
          position: 8,
          totalStudents: 38,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 35, theory: 32, total: 67 },
            English: { obj: 38, theory: 36, total: 74 },
            Physics: { obj: 30, theory: 28, total: 58 },
            Chemistry: { obj: 34, theory: 36, total: 70 },
            Biology: { obj: 36, theory: 38, total: 74 },
          },
        },
        {
          term: 'Second Term',
          average: 73.1,
          position: 6,
          totalStudents: 38,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 38, theory: 35, total: 73 },
            English: { obj: 40, theory: 38, total: 78 },
            Physics: { obj: 32, theory: 30, total: 62 },
            Chemistry: { obj: 36, theory: 38, total: 74 },
            Biology: { obj: 38, theory: 40, total: 78 },
          },
        },
        {
          term: 'Third Term',
          average: 74.8,
          position: 5,
          totalStudents: 38,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 40, theory: 36, total: 76 },
            English: { obj: 42, theory: 40, total: 82 },
            Physics: { obj: 34, theory: 32, total: 66 },
            Chemistry: { obj: 38, theory: 40, total: 78 },
            Biology: { obj: 40, theory: 42, total: 82 },
          },
        },
      ],
    },
    {
      session: '2021/2022',
      terms: [
        {
          term: 'First Term',
          average: 68.5,
          position: 10,
          totalStudents: 35,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 32, theory: 30, total: 62 },
            English: { obj: 36, theory: 34, total: 70 },
            Physics: { obj: 28, theory: 26, total: 54 },
            Chemistry: { obj: 32, theory: 34, total: 66 },
            Biology: { obj: 34, theory: 36, total: 70 },
          },
        },
        {
          term: 'Second Term',
          average: 71.2,
          position: 7,
          totalStudents: 35,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 35, theory: 33, total: 68 },
            English: { obj: 38, theory: 36, total: 74 },
            Physics: { obj: 30, theory: 28, total: 58 },
            Chemistry: { obj: 34, theory: 36, total: 70 },
            Biology: { obj: 36, theory: 38, total: 74 },
          },
        },
        {
          term: 'Third Term',
          average: 72.9,
          position: 6,
          totalStudents: 35,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 38, theory: 34, total: 72 },
            English: { obj: 40, theory: 38, total: 78 },
            Physics: { obj: 32, theory: 30, total: 62 },
            Chemistry: { obj: 36, theory: 38, total: 74 },
            Biology: { obj: 38, theory: 40, total: 78 },
          },
        },
      ],
    },
    {
      session: '2020/2021',
      terms: [
        {
          term: 'First Term',
          average: 65.3,
          position: 12,
          totalStudents: 32,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 30, theory: 28, total: 58 },
            English: { obj: 34, theory: 32, total: 66 },
            Physics: { obj: 26, theory: 24, total: 50 },
            Chemistry: { obj: 30, theory: 32, total: 62 },
            Biology: { obj: 32, theory: 34, total: 66 },
          },
        },
        {
          term: 'Second Term',
          average: 67.8,
          position: 9,
          totalStudents: 32,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 33, theory: 31, total: 64 },
            English: { obj: 36, theory: 34, total: 70 },
            Physics: { obj: 28, theory: 26, total: 54 },
            Chemistry: { obj: 32, theory: 34, total: 66 },
            Biology: { obj: 34, theory: 36, total: 70 },
          },
        },
        {
          term: 'Third Term',
          average: 70.1,
          position: 7,
          totalStudents: 32,
          status: 'Passed',
          subjects: {
            Mathematics: { obj: 36, theory: 32, total: 68 },
            English: { obj: 38, theory: 36, total: 74 },
            Physics: { obj: 30, theory: 28, total: 58 },
            Chemistry: { obj: 34, theory: 36, total: 70 },
            Biology: { obj: 36, theory: 38, total: 74 },
          },
        },
      ],
    },
  ],
};

const PastResults = () => {
  // --- STUDENT SELECTION STATE ---
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterArm, setFilterArm] = useState('');

  // --- ACCORDION STATE ---
  const [expandedSession, setExpandedSession] = useState(null);
  const [expandedTerm, setExpandedTerm] = useState(null);

  // --- FILTER STUDENTS ---
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

  // --- GET STUDENT'S SESSIONS ---
  const studentSessions = selectedStudent ? (MOCK_PAST_RESULTS[selectedStudent.id] || []) : [];

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setExpandedSession(studentSessions[0]?.session || null);
    setExpandedTerm(null);
  };

  const handleBack = () => {
    setSelectedStudent(null);
    setExpandedSession(null);
    setExpandedTerm(null);
  };

  const toggleSession = (session) => {
    setExpandedSession(expandedSession === session ? null : session);
    setExpandedTerm(null);
  };

  const toggleTerm = (termKey) => {
    setExpandedTerm(expandedTerm === termKey ? null : termKey);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status) => {
    return status === 'Passed' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : 'bg-red-50 text-red-700 border-red-100';
  };

  // =========================================================
  // STEP 1: STUDENT SEARCH & SELECTION
  // =========================================================
  if (!selectedStudent) {
    return (
      <div className="space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Past Results</h1>
          <p className="text-sm text-gray-500 mt-1">
            View six years of academic history for any student, broken down by session and term.
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
                    <span className="text-xs text-gray-500">6-year history</span>
                    <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Results →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
  // STEP 2: PAST RESULTS VIEW FOR SELECTED STUDENT
  // =========================================================
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Past Results</h1>
            <p className="text-sm text-gray-500 mt-1">
              6-year academic history for {selectedStudent.name}.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Student Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
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
          <div className="flex items-center gap-3">
            <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 text-center">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Sessions</span>
              <span className="text-sm font-semibold text-gray-900">{studentSessions.length}</span>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 text-center">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Terms</span>
              <span className="text-sm font-semibold text-gray-900">{studentSessions.length * 3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Accordion */}
      {studentSessions.length > 0 ? (
        <div className="space-y-4">
          {studentSessions.map((session) => {
            const isSessionExpanded = expandedSession === session.session;
            const sessionAverage = (
              session.terms.reduce((sum, t) => sum + t.average, 0) / session.terms.length
            ).toFixed(1);

            return (
              <div 
                key={session.session}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Session Header */}
                <button
                  onClick={() => toggleSession(session.session)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg border ${session.current ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                      <Calendar className={`w-5 h-5 ${session.current ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{session.session}</h3>
                        {session.current && (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-wider">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {session.terms.length} terms • Session Average: <span className="font-semibold text-gray-700">{sessionAverage}%</span>
                      </p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isSessionExpanded ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Terms List */}
                {isSessionExpanded && (
                  <div className="border-t border-gray-100">
                    {session.terms.map((termData) => {
                      const termKey = `${session.session}-${termData.term}`;
                      const isTermExpanded = expandedTerm === termKey;

                      return (
                        <div key={termKey} className="border-b border-gray-100 last:border-b-0">
                          
                          {/* Term Header */}
                          <button
                            onClick={() => toggleTerm(termKey)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isTermExpanded ? 'rotate-90' : ''}`} />
                              <span className="text-sm font-medium text-gray-900">{termData.term}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(termData.status)}`}>
                                {termData.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-sm font-semibold ${getScoreColor(termData.average)}`}>
                                {termData.average}%
                              </span>
                              <span className="text-xs text-gray-500">
                                Pos. {termData.position}/{termData.totalStudents}
                              </span>
                            </div>
                          </button>

                          {/* Term Details (Subject Breakdown) */}
                          {isTermExpanded && (
                            <div className="px-6 pb-6 bg-gray-50/30">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-200">
                                      <th className="px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                      <th className="px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">OBJ</th>
                                      <th className="px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">Theory</th>
                                      <th className="px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {Object.entries(termData.subjects).map(([subject, scores]) => (
                                      <tr key={subject} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{subject}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 text-center">{scores.obj}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 text-center">{scores.theory}</td>
                                        <td className={`px-4 py-3 text-sm font-semibold text-center ${getScoreColor(scores.total)}`}>
                                          {scores.total}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr className="bg-gray-50 border-t border-gray-200">
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900" colSpan={3}>
                                        Term Average
                                      </td>
                                      <td className={`px-4 py-3 text-sm font-bold text-center ${getScoreColor(termData.average)}`}>
                                        {termData.average}%
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No past results found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">
            This student does not have any recorded academic history yet.
          </p>
        </div>
      )}

    </div>
  );
};

export default PastResults;