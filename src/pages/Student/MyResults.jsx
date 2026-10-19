import { useEffect, useState, useMemo } from 'react';
import { myResults } from '../../api/result.api';
import { apiError } from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  ChevronDown, 
  User, 
  GraduationCap,
  FileText,
  Target,
  Info,
  Brain,
  Heart,
  MessageSquare,
  Star
} from 'lucide-react';

// =========================================================
// LABELS
// =========================================================
const COGNITIVE_LABELS = {
  memory: 'Memory Retention',
  problemSolving: 'Problem Solving',
  criticalThinking: 'Critical Thinking',
  creativity: 'Creativity',
  concentration: 'Concentration',
};

const BEHAVIORAL_LABELS = {
  punctuality: 'Punctuality',
  neatness: 'Neatness',
  politeness: 'Politeness',
  honesty: 'Honesty',
  participation: 'Class Participation',
};

export default function MyResults() {
  const { user } = useAuthStore();
  const [results, setResults] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loadError, setLoadError] = useState('');
  const [expandedTerms, setExpandedTerms] = useState({});

  // --- YOUR ORIGINAL FETCH LOGIC (UNTOUCHED) ---
  useEffect(() => {
    myResults()
      .then(({ data }) => { setResults(data.results); setRemarks(data.remarks); })
      .catch((err) => setLoadError(apiError(err, 'Could not load your results.')));
  }, []);

  // only released results ever reach this page
  const displayResults = results;
  const displayRemarks = remarks;

  // --- STUDENT INFO ---
  const studentName = user?.fullName || '';
  const studentId = user?.studentId || user?.admissionNumber || '';
  const studentClass = user?.class || '';
  const studentArm = user?.arm || '';

  // --- GROUP RESULTS BY SESSION + TERM ---
  const groupedResults = useMemo(() => {
    const grouped = {};
    displayResults.forEach((r) => {
      const session = r.session || 'Current Session';
      const term = r.term || 'Current Term';
      if (!grouped[session]) grouped[session] = {};
      if (!grouped[session][term]) grouped[session][term] = [];
      grouped[session][term].push(r);
    });
    return grouped;
  }, [displayResults]);

  const sortedSessions = Object.keys(groupedResults).sort((a, b) => b.localeCompare(a));

  const toggleTerm = (key) => {
    setExpandedTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- HELPERS ---
  const getScoreColor = (score, maxScore) => {
    const pct = maxScore ? (score / maxScore) * 100 : 0;
    if (pct >= 70) return 'text-emerald-600';
    if (pct >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getGrade = (score, maxScore) => {
    const pct = maxScore ? (score / maxScore) * 100 : 0;
    if (pct >= 75) return 'A';
    if (pct >= 65) return 'B';
    if (pct >= 55) return 'C';
    if (pct >= 45) return 'D';
    if (pct >= 40) return 'E';
    return 'F';
  };

  const getGradeBadge = (grade) => {
    const styles = {
      A: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      B: 'bg-blue-50 text-blue-700 border-blue-100',
      C: 'bg-amber-50 text-amber-700 border-amber-100',
      D: 'bg-orange-50 text-orange-700 border-orange-100',
      E: 'bg-red-50 text-red-700 border-red-100',
      F: 'bg-red-50 text-red-700 border-red-100',
    };
    return styles[grade] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const calcTermAverage = (termResults) => {
    if (!termResults.length) return 0;
    const total = termResults.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0);
    return (total / termResults.length).toFixed(1);
  };

  // =========================================================
  // STAR RATING DISPLAY
  // =========================================================
  const StarRating = ({ value = 0 }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= value
              ? 'fill-blue-600 text-blue-600'
              : 'fill-gray-100 text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-medium text-gray-500">
        {value}/5
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ========================================================= */}
        {/* HEADER: Student Info */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-lg font-bold">
                  {studentName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 tracking-tight">
                  My Results
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {studentName} · {studentId}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 text-center">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Class</span>
                <span className="text-sm font-semibold text-gray-900">{studentClass}</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 text-center">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Arm</span>
                <span className="text-sm font-semibold text-gray-900">Arm {studentArm}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* RESULTS BY SESSION */}
        {/* ========================================================= */}
        {sortedSessions.length > 0 ? (
          <div className="space-y-6">
            {sortedSessions.map((session) => (
              <div 
                key={session}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                
                {/* Session Header */}
                <div className="p-5 lg:p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">{session}</h2>
                      <p className="text-xs text-gray-500">Academic Session</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                    {Object.keys(groupedResults[session]).length} Terms
                  </span>
                </div>

                {/* Terms */}
                <div>
                  {Object.entries(groupedResults[session]).map(([term, termResults]) => {
                    const termKey = `${session}-${term}`;
                    const isExpanded = expandedTerms[termKey] !== false;
                    const termAvg = calcTermAverage(termResults);
                    const avgPct = parseFloat(termAvg);
                    const remarks = displayRemarks[termKey] || {};

                    return (
                      <div key={termKey} className="border-b border-gray-100 last:border-0">
                        
                        {/* Term Header (Click to toggle) */}
                        <button
                          onClick={() => toggleTerm(termKey)}
                          className="w-full px-5 lg:px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <ChevronDown 
                              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} 
                            />
                            <span className="text-sm font-medium text-gray-900">{term}</span>
                            <span className="text-xs text-gray-500">({termResults.length} subjects)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Average</span>
                              <span className={`text-sm font-bold ${getScoreColor(avgPct, 100)}`}>
                                {termAvg}%
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-5 lg:px-6 pb-6 space-y-6">
                            
                            {/* Subjects Table */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">Score</th>
                                    <th className="px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">Grade</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {termResults.map((r) => {
                                    const grade = getGrade(r.score, r.maxScore);
                                    return (
                                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                          <span className="text-sm font-medium text-gray-900">
                                            {r.subject || r.Exam?.title || 'Subject'}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <span className={`text-sm font-semibold ${getScoreColor(r.score, r.maxScore)}`}>
                                            {r.score}/{r.maxScore}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold border ${getGradeBadge(grade)}`}>
                                            {grade}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>

                            {/* ========================================================= */}
                            {/* TEACHER REMARKS */}
                            {/* ========================================================= */}
                            {(remarks.academicRemark || remarks.cognitiveRemark || remarks.teacherRemark) && (
                              <div className="space-y-4">
                                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                                  Teacher's Remarks
                                </h3>

                                {/* Academic Remark */}
                                {remarks.academicRemark && (
                                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                      <span className="text-xs font-semibold text-blue-900">Academic Remark</span>
                                    </div>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                      {remarks.academicRemark}
                                    </p>
                                  </div>
                                )}

                                {/* Cognitive Remark */}
                                {remarks.cognitiveRemark && (
                                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Brain className="w-3.5 h-3.5 text-blue-600" />
                                      <span className="text-xs font-semibold text-blue-900">Cognitive Remark</span>
                                    </div>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                      {remarks.cognitiveRemark}
                                    </p>
                                  </div>
                                )}

                                {/* Behavioral Remark */}
                                {remarks.behavioralRemark && (
                                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Heart className="w-3.5 h-3.5 text-blue-600" />
                                      <span className="text-xs font-semibold text-blue-900">Behavioral Remark</span>
                                    </div>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                      {remarks.behavioralRemark}
                                    </p>
                                  </div>
                                )}

                                {/* Final Teacher Remark */}
                                {remarks.teacherRemark && (
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Award className="w-3.5 h-3.5 text-gray-600" />
                                      <span className="text-xs font-semibold text-gray-900">Teacher's Final Remark</span>
                                    </div>
                                    <p className="text-xs text-gray-700 italic leading-relaxed">
                                      "{remarks.teacherRemark}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* ========================================================= */}
                            {/* COGNITIVE & BEHAVIORAL RATINGS */}
                            {/* ========================================================= */}
                            {(remarks.cognitive || remarks.behavioral) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Cognitive Behavior */}
                                {remarks.cognitive && (
                                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                      <div className="p-1.5 bg-blue-50 rounded-md border border-blue-100">
                                        <Brain className="w-3.5 h-3.5 text-blue-600" />
                                      </div>
                                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                        Cognitive Behavior
                                      </h4>
                                    </div>
                                    <div className="space-y-3">
                                      {Object.entries(remarks.cognitive).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between gap-3">
                                          <span className="text-xs text-gray-600 flex-1">
                                            {COGNITIVE_LABELS[key] || key}
                                          </span>
                                          <StarRating value={value} />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Behavioral Traits */}
                                {remarks.behavioral && (
                                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                      <div className="p-1.5 bg-blue-50 rounded-md border border-blue-100">
                                        <Heart className="w-3.5 h-3.5 text-blue-600" />
                                      </div>
                                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                        Behavioral Traits
                                      </h4>
                                    </div>
                                    <div className="space-y-3">
                                      {Object.entries(remarks.behavioral).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between gap-3">
                                          <span className="text-xs text-gray-600 flex-1">
                                            {BEHAVIORAL_LABELS[key] || key}
                                          </span>
                                          <StarRating value={value} />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{loadError || 'No results yet'}</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              No released results are available at this time. Check back later.
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* INFO BOX */}
        {/* ========================================================= */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-900">About Your Results</p>
            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
              Your results are grouped by academic session and term. Teacher remarks and behavioral 
              ratings are only visible once results have been released.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}