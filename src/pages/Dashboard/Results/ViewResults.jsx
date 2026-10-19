import { useState, useMemo, useEffect, useCallback } from 'react';
import { viewResults, releaseResults } from '../../../api/result.api';
import { getAcademicTerms } from '../../../api/school.api';
import { apiError } from '../../../api/axios';
import { 
  Search, 
  ChevronDown, 
  X, 
  Printer, 
  Download, 
  Edit2, 
  FileText,
  Users,
  GraduationCap,
  Filter
} from 'lucide-react';
import Button from '../../../components/common/Button';

export default function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterArm, setFilterArm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState('');
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // terms/sessions (default to the current term)
  useEffect(() => {
    getAcademicTerms().then(({ data }) => {
      setSessions(data.sessions);
      setSession(data.current.session);
      setTerm(data.current.term);
    }).catch((err) => setMsg({ type: 'error', text: apiError(err) }));
  }, []);

  const load = useCallback(async () => {
    if (!session || !term) return;
    setLoading(true);
    try {
      const { data } = await viewResults({ session, term });
      setResults(data.results);
      setSubjects(data.subjects);
      setSheets(data.sheets);
    } catch (err) {
      setResults([]); setSubjects([]); setSheets([]);
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

  const uniqueClasses = [...new Set(results.map(s => s.class))].sort();
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

  // Release / withdraw results for the selected class + arm
  const selectedSheet = filterClass && filterArm
    ? sheets.find((sh) => sh.fullClassName === `${filterClass} ${filterArm}`)
    : null;

  const handleRelease = async () => {
    if (!selectedSheet) return;
    const release = !selectedSheet.released;
    if (!window.confirm(release
      ? `Release ${term} results to ${selectedSheet.fullClassName} students? They will be able to see them.`
      : `Withdraw ${selectedSheet.fullClassName} results? Students will no longer see them.`)) return;
    try {
      await releaseResults({ classArmId: selectedSheet.classArmId, session, term, release });
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
            onClick={handlePrint}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
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
        
        {/* Search by ID or Name */}
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

        {/* Class Filter */}
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

        {/* Arm Filter */}
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
            <span className="text-xs text-gray-500">Choose a class and arm to release its results.</span>
          )}
        </div>
      </div>
      {msg.text && (
        <div className={`text-sm rounded-lg px-4 py-2.5 border ${msg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>{msg.text}</div>
      )}

      {/* --- RESULTS TABLE --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Comprehensive Results</h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredResults.length} of {results.length} students. Each subject shows OBJ, Theory, and Total.
            </p>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 self-start">
            {filteredResults.length} Students
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredResults.length > 0 ? (
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
              <tbody className="divide-y divide-gray-100">
                {filteredResults.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    
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
                        {student.class} - {student.arm}
                      </span>
                    </td>

                    {/* Subject Scores */}
                    {subjects.map((subject) => {
                      const score = student.subjects[subject] || { obj: 0, theory: 0, total: 0 };
                      return (
                        <>
                          <td key={`${student.id}-${subject}-obj`} className="px-2 py-4 text-center text-sm text-gray-600 border-r border-gray-50">
                            {score.obj}
                          </td>
                          <td key={`${student.id}-${subject}-theory`} className="px-2 py-4 text-center text-sm text-gray-600 border-r border-gray-50">
                            {score.theory}
                          </td>
                          <td key={`${student.id}-${subject}-total`} className={`px-2 py-4 text-center text-sm font-semibold border-r border-gray-100 ${getScoreColor(score.total)}`}>
                            {score.total}
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
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* --- EMPTY STATE --- */
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

        {/* Table Footer / Pagination */}
        {filteredResults.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-500">
              Showing {filteredResults.length} of {results.length} students
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md">
                1
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}