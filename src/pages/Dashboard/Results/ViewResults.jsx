import { useState, useMemo, useEffect, useCallback,useRef} from 'react';
import { viewResults, releaseResults } from '../../../api/result.api';
import { listExams } from '../../../api/exam.api';
import { getAcademicTerms } from '../../../api/school.api';
import { apiError } from '../../../api/axios';
import ReportSheet from '../../../components/Print/ReportSheet';
import { usePrint } from '../../../components/Print/usePrint';
import { getReview } from '../../../api/result.api'; // already used in ReviewResults
import { useSchoolStore } from '../../../store/useSchoolStore';
import { 
  Search, 
  ChevronDown, 
  X, 
  Printer, 
  Download, 
  FileText,
  Users,
  GraduationCap,
  Filter,
  Award
} from 'lucide-react';
import Button from '../../../components/common/Button';

const getExamClass = (exam) => typeof exam.class === 'object'
  ? exam.class?.name
  : exam.className ?? exam.class ?? exam.fullClassName;

export default function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterArm, setFilterArm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectConfigs, setSubjectConfigs] = useState({});
  const [sheets, setSheets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState('');
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);
const { print } = usePrint();
const school = useSchoolStore((s) => s.school); // has name, address, phone, email, motto, logo
const [printStudent, setPrintStudent] = useState(null);
const [printReview, setPrintReview] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // terms/sessions (default to the current term)
  useEffect(() => {
    getAcademicTerms().then(({ data }) => {
      setSessions(data.sessions);
      setSession(data.current.session);
      setTerm(data.current.term);
    }).catch((err) => setMsg({ type: 'error', text: apiError(err) }));
  }, []);


// Fetch the review for a student, then print
const handlePrintStudent = async (student) => {

  setPrintStudent(student);
  setPrintReview(null);
  try {
    const { data } = await getReview({ studentId: student.uid ?? student.id });
    setPrintReview(data.review || null);
  } catch {
    setPrintReview(null); // still print without review
  }
  // Give React one tick to render <ReportSheet>, then print
  setTimeout(() => print(printRef.current), 400);
};
  const load = useCallback(async () => {
    if (!session || !term) return;
    setLoading(true);
    try {
      const [{ data }, { data: objData }, { data: theoryData }] = await Promise.all([
        viewResults({ session, term }),
        listExams({ type: 'OBJ' }),
        listExams({ type: 'THEORY' }),
      ]);
      setResults(data.results);
      setSubjects(data.subjects);
      setSheets(data.sheets);
      const configs = {};
      [...objData.exams, ...theoryData.exams]
        .filter((exam) => exam.session === session && exam.term === term)
        .forEach((exam) => {
          const key = `${getExamClass(exam)}::${exam.subject}`;
          configs[key] = {
            ...configs[key],
            [exam.type === 'OBJ' ? 'objMax' : 'theoryMax']: Number(exam.percentageMark),
          };
        });
      setSubjectConfigs(configs);
    } catch (err) {
      setResults([]); setSubjects([]); setSheets([]); setSubjectConfigs({});
      setMsg({ type: 'error', text: apiError(err, 'Could not load results.') });
    } finally {
      setLoading(false);
    }
  }, [session, term]);

  useEffect(() => { load(); }, [load]);

  // --- FILTERING LOGIC ---
  const filteredResults = useMemo(() => {
    return results.filter((student) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        student.name.toLowerCase().includes(search) ||
        student.id.toLowerCase().includes(search);
      const matchesClass = filterClass ? student.class === filterClass : true;
      const matchesArm = filterArm ? student.arm === filterArm : true;
      return matchesSearch && matchesClass && matchesArm;
    });
  }, [results, searchTerm, filterClass, filterArm]);

  // --- GROUP FILTERED RESULTS BY CLASS (NEW) ---
  // Produces: [{ class: 'JSS1', students: [...] }, { class: 'JSS2', students: [...] }, ...]
  const groupedByClass = useMemo(() => {
    const map = {};
    filteredResults.forEach((student) => {
      const cls = student.class || 'Unassigned';
      if (!map[cls]) map[cls] = [];
      map[cls].push(student);
    });
    return Object.keys(map)
      .sort((a, b) => a.localeCompare(b))
      .map((cls) => ({
        class: cls,
        students: map[cls],
      }));
  }, [filteredResults]);

  const uniqueClasses = [...new Set([
    ...results.map((student) => student.class),
    ...sheets.map((sheet) => sheet.className),
  ].filter(Boolean))].sort();
  const uniqueArms = [...new Set(results.map(s => s.arm))].sort();
  const hasActiveFilters = searchTerm || filterClass || filterArm;

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterClass('');
    setFilterArm('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setIsExporting(true);
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const head = ['Student ID', 'Name', 'Class', 'Arm', ...subjects.flatMap((sub) => [`${sub} OBJ`, `${sub} Theory`, `${sub} Total`]), 'Average', 'Position', 'Status'];
    const rows = filteredResults.map((r) => [
      r.id, r.name, r.class, r.arm,
      ...subjects.flatMap((sub) => { const x = r.subjects[sub] || { obj: 0, theory: 0, total: 0 }; return [x.obj, x.theory, x.total]; }),
      r.average, r.position, r.status,
    ]);
    const csv = [head, ...rows].map((row) => row.map(esc).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `results-${session.replace('/', '-')}-${term.replace(' ', '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const selectedSheet = filterClass
    ? sheets.find((sh) => sh.className === filterClass)
    : null;

  const handleRelease = async () => {
    if (!selectedSheet) return;
    const release = !selectedSheet.released;
    if (!window.confirm(release
      ? `Release ${term} results to all ${selectedSheet.className} students? They will be able to see them.`
      : `Withdraw ${selectedSheet.className} results? Students will no longer see them.`)) return;
    try {
      await releaseResults({ classId: selectedSheet.classId, session, term, release });
      setMsg({ type: 'success', text: release ? 'Results released to students.' : 'Results withdrawn.' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    }
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

  const getSubjectConfig = (className, subject) =>
    subjectConfigs[`${className}::${subject}`] || {};

  // Total number of columns for the class header row to span correctly
  const totalColumns = 2 + subjects.length * 3 + 4;

  return (
    <div className="space-y-6">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Results</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, edit, print, and export comprehensive student results.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
       
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
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

      {/* --- TERM + RELEASE BAR --- */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select value={session} onChange={(e) => setSession(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2.5">
            {sessions.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select value={term} onChange={(e) => setTerm(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2.5">
            {(sessions.find((s) => s.name === session)?.terms || []).map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          {selectedSheet ? (
            <>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${selectedSheet.released ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                {selectedSheet.released ? 'Released to students' : 'Not released'}
              </span>
              <button onClick={handleRelease}
                className="text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                {selectedSheet.released ? 'Withdraw Results' : 'Release Results'}
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-500">Choose a class to release its results to every arm.</span>
          )}
        </div>
      </div>
      {msg.text && (
        <div className={`text-sm rounded-lg px-4 py-2.5 border ${msg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>{msg.text}</div>
      )}

      {/* --- RESULTS TABLE --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Comprehensive Results</h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredResults.length} of {results.length} students, grouped by class.
            </p>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 self-start">
            {groupedByClass.length} Classes · {filteredResults.length} Students
          </span>
        </div>

        <div className="overflow-x-auto">
          {groupedByClass.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                {/* Top Header Row: Student Info + Subjects */}
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50/95 backdrop-blur-sm z-10 border-r border-gray-200" rowSpan={2}>
                    Student
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center border-r border-gray-200" rowSpan={2}>
                    Class/Arm
                  </th>
                  {subjects.map((subject) => (
                    <th key={subject} colSpan={3} className="px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center border-r border-gray-200 last:border-r-0">
                      {subject}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center border-r border-gray-200" rowSpan={2}>
                    Average
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center border-r border-gray-200" rowSpan={2}>
                    Position
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center border-r border-gray-200" rowSpan={2}>
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center" rowSpan={2}>
                    Action
                  </th>
                </tr>

                {/* Sub Header Row: OBJ, Theory, Total per subject */}
                <tr className="bg-gray-50/30 border-b border-gray-200">
                  {subjects.map((subject) => (
                    <>
                      <th key={`${subject}-obj`} className="px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center border-r border-gray-100">OBJ</th>
                      <th key={`${subject}-theory`} className="px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center border-r border-gray-100">Theory</th>
                      <th key={`${subject}-total`} className="px-2 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center border-r border-gray-200 last:border-r-0">Total</th>
                    </>
                  ))}
                </tr>
              </thead>

              <tbody>
                {groupedByClass.map((group) => (
                  <>
                    {/* --- CLASS HEADER + MAX MARKS ROW (NEW) --- */}
                    <tr 
                      key={`header-${group.class}`}
                      className="bg-blue-50/50 border-t-2 border-b border-blue-100"
                    >
                      {/* Class label (sticky) */}
                      <td className="px-4 py-3 sticky left-0 bg-blue-50/95 backdrop-blur-sm z-10 border-r border-blue-100">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-600 rounded-md">
                            <GraduationCap className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block leading-tight">
                              {group.class}
                            </span>
                            <span className="text-[10px] font-medium text-blue-600">
                              {group.students.length} {group.students.length === 1 ? 'student' : 'students'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* "Max Marks" label spanning the Class/Arm column */}
                      <td className="px-4 py-3 text-center border-r border-blue-100">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                          Max Marks
                        </span>
                      </td>

                      {/* Max OBJ / Theory / Total per subject */}
                      {subjects.map((subject) => {
                        const config = getSubjectConfig(group.class, subject);
                        const objMarks = Number.isFinite(config.objMax) && config.objMax > 0 ? [config.objMax] : [];
                        const theoryMarks = Number.isFinite(config.theoryMax) && config.theoryMax > 0 ? [config.theoryMax] : [];
                        const total = Number(config.objMax || 0) + Number(config.theoryMax || 0);
                        const totalMarks = total > 0 ? [total] : [];
                        const renderMax = (marks) => marks.length === 1 ? `/${marks[0]}` : marks.length > 1 ? 'Varies' : '—';
                        return (
                          <>
                            <td key={`max-${group.class}-${subject}-obj`} className="px-2 py-3 text-center text-xs font-bold text-blue-800 border-r border-blue-100">
                              {renderMax(objMarks)}
                            </td>
                            <td key={`max-${group.class}-${subject}-theory`} className="px-2 py-3 text-center text-xs font-bold text-blue-800 border-r border-blue-100">
                              {renderMax(theoryMarks)}
                            </td>
                            <td key={`max-${group.class}-${subject}-total`} className="px-2 py-3 text-center text-xs font-bold text-blue-900 border-r border-blue-200">
                              {renderMax(totalMarks)}
                            </td>
                          </>
                        );
                      })}

                      {/* Empty cells for Average, Position, Status, Action */}
                      <td className="px-4 py-3 border-r border-blue-100"></td>
                      <td className="px-4 py-3 border-r border-blue-100"></td>
                      <td className="px-4 py-3 border-r border-blue-100"></td>
                      <td className="px-4 py-3"></td>
                    </tr>

                    {/* --- STUDENT ROWS FOR THIS CLASS --- */}
                    {group.students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0">
                        
                        {/* Student Info (Sticky) */}
                        <td className="px-4 py-4 sticky left-0 bg-white z-10 border-r border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                              <span className="text-blue-600 text-xs font-bold">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Class/Arm */}
                        <td className="px-4 py-4 text-center border-r border-gray-100">
                          <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            Arm {student.arm}
                          </span>
                        </td>

                        {/* Subject Scores */}
                        {subjects.map((subject) => {
                          const score = student.subjects[subject] || { obj: 0, theory: 0, total: 0 };
                          const config = getSubjectConfig(student.class, subject);
                          const objValue = Number.isFinite(config.objMax) && config.objMax > 0
                            ? `${score.obj}/${config.objMax}`
                            : score.obj;
                          const theoryValue = Number.isFinite(config.theoryMax) && config.theoryMax > 0
                            ? `${score.theory}/${config.theoryMax}`
                            : score.theory;
                          const totalMax = Number(config.objMax || 0) + Number(config.theoryMax || 0);
                          const totalValue = totalMax > 0 ? `${score.total}/${totalMax}` : score.total;
                          return (
                            <>
                              <td key={`${student.id}-${subject}-obj`} className="px-2 py-4 text-center text-sm text-gray-600 border-r border-gray-50">
                                {objValue}
                              </td>
                              <td key={`${student.id}-${subject}-theory`} className="px-2 py-4 text-center text-sm text-gray-600 border-r border-gray-50">
                                {theoryValue}
                              </td>
                              <td key={`${student.id}-${subject}-total`} className={`px-2 py-4 text-center text-sm font-semibold border-r border-gray-100 ${getScoreColor(score.total)}`}>
                                {totalValue}
                              </td>
                            </>
                          );
                        })}

                        {/* Average */}
                        <td className={`px-4 py-4 text-center text-sm font-bold border-r border-gray-100 ${getScoreColor(student.average)}`}>
                          {student.average.toFixed(1)}%
                        </td>

                        {/* Position */}
                        <td className="px-4 py-4 text-center border-r border-gray-100">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            student.position === 1 ? 'bg-amber-100 text-amber-700' :
                            student.position === 2 ? 'bg-gray-200 text-gray-700' :
                            student.position === 3 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {student.position}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-center border-r border-gray-100">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(student.status)}`}>
                            {student.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-4 text-center">
                           <button
  onClick={() => handlePrintStudent(student)}
  className="text-gray-400 hover:text-blue-600 transition-colors no-print"
  title="Print report sheet"
>
  <Printer className="w-4 h-4" />
</button>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No results found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                No student results match your current search or filters. Try adjusting them.
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

        {filteredResults.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-500">
              Showing {groupedByClass.length} classes · {filteredResults.length} of {results.length} students
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md">
                1
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Hidden print-only area */}
<div className="hidden print:block">
  {printStudent && (
    <ReportSheet
      ref={printRef}
      school={school}
      student={{
        name: printStudent.name,
        id: printStudent.id,
        class: printStudent.class,
        arm: printStudent.arm,
        gender: printStudent.gender,
      }}
      session={session}
      term={term}
      subjects={subjects}
      scores={printStudent.subjects || {}}
      subjectConfigs={subjectConfigs}
      review={printReview}
      summary={{
        average: printStudent.average,
        position: printStudent.position,
        status: printStudent.status,
      }}
    />
  )}
</div>
    </div>
  );
}