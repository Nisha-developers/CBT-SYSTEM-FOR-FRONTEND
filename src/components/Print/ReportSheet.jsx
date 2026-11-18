import { forwardRef } from 'react';

/**
 * Formal, print-only academic + behavioural report sheet.
 * Renders black & white, no shadows, no colours — designed for paper.
 *
 * Props:
 *  - school: { name, address, phone, email, motto, logo }
 *  - student: { name, id, class, arm, gender }
 *  - session, term
 *  - subjects: string[]
 *  - scores: { [subject]: { obj, theory, total } }
 *  - subjectConfigs: { [className::subject]: { objMax, theoryMax } }
 *  - review: { cognitiveRatings, behavioralRatings, academicRemark, behavioralRemark, teacherRemark }
 *  - summary: { average, position, total, obtainable, status }
 */
const ReportSheet = forwardRef(function ReportSheet(
  { school, student, session, term, subjects, scores, subjectConfigs, review, summary },
  ref
) {
  const COGNITIVE = [
    { key: 'memory', label: 'Memory Retention' },
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'criticalThinking', label: 'Critical Thinking' },
    { key: 'creativity', label: 'Creativity' },
    { key: 'concentration', label: 'Concentration' },
  ];
  const BEHAVIORAL = [
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'neatness', label: 'Neatness' },
    { key: 'politeness', label: 'Politeness' },
    { key: 'honesty', label: 'Honesty' },
    { key: 'participation', label: 'Class Participation' },
  ];

  const cfg = (subject) =>
    subjectConfigs?.[`${student.class}::${subject}`] || {};

  // Grade from total/max -> A..F
  const gradeFor = (total, max) => {
    if (!max) return '—';
    const pct = (Number(total) / Number(max)) * 100;
    if (pct >= 75) return 'A';
    if (pct >= 65) return 'B';
    if (pct >= 55) return 'C';
    if (pct >= 45) return 'D';
    if (pct >= 40) return 'E';
    return 'F';
  };
  const remarkFor = (g) =>
    ({ A: 'Excellent', B: 'Very Good', C: 'Good', D: 'Fair', E: 'Pass', F: 'Fail' }[g] || '—');

  const filled = (v) => (Number(v) > 0 ? v : '—');
  const fmt = (v) => (v === null || v === undefined || v === '' ? '—' : v);

  const totalObtained = subjects.reduce(
    (sum, s) => sum + Number(scores?.[s]?.total || 0),
    0
  );
  const totalObtainable = subjects.reduce((sum, s) => {
    const c = cfg(s);
    return sum + Number(c.objMax || 0) + Number(c.theoryMax || 0);
  }, 0);
  const average =
    summary?.average ??
    (totalObtainable ? (totalObtained / totalObtainable) * 100 : 0);
  const status = summary?.status ?? (average >= 40 ? 'Passed' : 'Failed');

  return (
    <div ref={ref} className="report-sheet">
      <style>{`
        .report-sheet {
          font-family: "Times New Roman", Georgia, serif;
          color: #000;
          background: #fff;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 14mm 14mm 16mm;
          font-size: 11px;
          line-height: 1.35;
          box-sizing: border-box;
        }
        .report-sheet * { box-sizing: border-box; }
        .report-sheet .rs-header {
          display: flex; align-items: center; gap: 12px;
          border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px;
        }
        .report-sheet .rs-logo {
          width: 64px; height: 64px; object-fit: contain;
          border: 1px solid #000; padding: 2px; flex-shrink: 0;
        }
        .report-sheet .rs-school { flex: 1; text-align: center; }
        .report-sheet .rs-school h1 {
          margin: 0; font-size: 20px; letter-spacing: 1px;
          text-transform: uppercase; font-weight: 700;
        }
        .report-sheet .rs-school p { margin: 1px 0; font-size: 10px; }
        .report-sheet .rs-school .motto { font-style: italic; margin-top: 2px; }
        .report-sheet .rs-title {
          text-align: center; font-size: 13px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 2px;
          border: 1px solid #000; padding: 4px 0; margin: 8px 0 12px;
        }
        .report-sheet .rs-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2px 24px; margin-bottom: 12px;
        }
        .report-sheet .rs-row {
          display: flex; gap: 6px; border-bottom: 1px dotted #000;
          padding: 3px 0;
        }
        .report-sheet .rs-row .k { font-weight: 700; min-width: 78px; }
        .report-sheet .rs-row .v { flex: 1; }

        .report-sheet table.rs-table {
          width: 100%; border-collapse: collapse; margin-bottom: 12px;
          font-size: 10.5px;
        }
        .report-sheet table.rs-table th,
        .report-sheet table.rs-table td {
          border: 1px solid #000; padding: 4px 5px; text-align: center;
        }
        .report-sheet table.rs-table th {
          background: #e8e8e8; font-weight: 700; text-transform: uppercase;
          font-size: 9.5px; letter-spacing: 0.5px;
        }
        .report-sheet table.rs-table td.left { text-align: left; }
        .report-sheet table.rs-table tr.total-row td {
          font-weight: 700; background: #f2f2f2;
        }

        .report-sheet .rs-two-col {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 14px; margin-bottom: 12px;
        }
        .report-sheet .rs-panel {
          border: 1px solid #000; padding: 6px 8px;
        }
        .report-sheet .rs-panel h3 {
          margin: 0 0 6px; font-size: 10.5px; text-transform: uppercase;
          letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px;
        }
        .report-sheet .rs-panel table { width: 100%; border-collapse: collapse; }
        .report-sheet .rs-panel table td {
          padding: 2px 0; font-size: 10.5px; border-bottom: 1px dotted #999;
        }
        .report-sheet .rs-panel table td:last-child {
          text-align: center; width: 60px; font-weight: 700;
        }

        .report-sheet .rs-remark {
          border: 1px solid #000; padding: 6px 8px; margin-bottom: 8px;
        }
        .report-sheet .rs-remark h3 {
          margin: 0 0 4px; font-size: 10.5px; text-transform: uppercase;
          letter-spacing: 1px;
        }
        .report-sheet .rs-remark p { margin: 0; min-height: 28px; font-size: 10.5px; }

        .report-sheet .rs-summary {
          display: flex; justify-content: space-between; gap: 10px;
          border: 1px solid #000; padding: 6px 10px; margin-bottom: 10px;
          font-size: 11px; font-weight: 700;
        }

        .report-sheet .rs-signatures {
          display: flex; justify-content: space-between; gap: 20px;
          margin-top: 26px; font-size: 10.5px;
        }
        .report-sheet .rs-signatures div {
          flex: 1; border-top: 1px solid #000; padding-top: 3px; text-align: center;
        }
        .report-sheet .rs-signatures .role { font-weight: 700; }

        .report-sheet .rs-footer {
          margin-top: 10px; text-align: center; font-size: 9px;
          border-top: 1px solid #000; padding-top: 4px;
        }
      `}</style>

      {/* HEADER */}
      <div className="rs-header">
        {school?.logo && <img src={school.logo} alt="Logo" className="rs-logo" />}
        <div className="rs-school">
          <h1>{school?.name || 'SCHOOL NAME'}</h1>
          <p>{school?.address || 'School Address'}</p>
          <p>
            {school?.phone && `Tel: ${school.phone}`}
            {school?.phone && school?.email && ' | '}
            {school?.email && `Email: ${school.email}`}
          </p>
          {school?.motto && <p className="motto">Motto: {school.motto}</p>}
        </div>
      </div>

      <div className="rs-title">Student Terminal Report Sheet</div>

      {/* STUDENT INFO */}
      <div className="rs-grid">
        <div className="rs-row"><span className="k">Student Name:</span><span className="v">{fmt(student?.name)}</span></div>
        <div className="rs-row"><span className="k">Student ID:</span><span className="v">{fmt(student?.id)}</span></div>
        <div className="rs-row"><span className="k">Class:</span><span className="v">{fmt(student?.class)}</span></div>
        <div className="rs-row"><span className="k">Arm:</span><span className="v">{fmt(student?.arm)}</span></div>
        <div className="rs-row"><span className="k">Gender:</span><span className="v">{fmt(student?.gender)}</span></div>
        <div className="rs-row"><span className="k">Term:</span><span className="v">{fmt(term)}</span></div>
        <div className="rs-row"><span className="k">Session:</span><span className="v">{fmt(session)}</span></div>
        <div className="rs-row"><span className="k">Position:</span><span className="v">{fmt(summary?.position)}</span></div>
      </div>

      {/* SUBJECT TABLE */}
      <table className="rs-table">
        <thead>
          <tr>
            <th style={{ width: '4%' }}>#</th>
            <th style={{ width: '30%' }}>Subject</th>
            <th>OBJ<br />(Max)</th>
            <th>OBJ<br />(Score)</th>
            <th>Theory<br />(Max)</th>
            <th>Theory<br />(Score)</th>
            <th>Total<br />(Max)</th>
            <th>Total<br />(Score)</th>
            <th>Grade</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, i) => {
            const c = cfg(subject);
            const sc = scores?.[subject] || { obj: 0, theory: 0, total: 0 };
            const objMax = Number(c.objMax || 0);
            const thMax = Number(c.theoryMax || 0);
            const totMax = objMax + thMax;
            const g = gradeFor(sc.total, totMax);
            return (
              <tr key={subject}>
                <td>{i + 1}</td>
                <td className="left">{subject}</td>
                <td>{objMax || '—'}</td>
                <td>{filled(sc.obj)}</td>
                <td>{thMax || '—'}</td>
                <td>{filled(sc.theory)}</td>
                <td>{totMax || '—'}</td>
                <td>{filled(sc.total)}</td>
                <td>{g}</td>
                <td>{remarkFor(g)}</td>
              </tr>
            );
          })}
          <tr className="total-row">
            <td colSpan={2} className="left">GRAND TOTAL</td>
            <td colSpan={4}></td>
            <td>{totalObtainable || '—'}</td>
            <td>{totalObtained}</td>
            <td colSpan={2}>
              Average: {Number(average).toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>

      {/* SUMMARY BAR */}
      <div className="rs-summary">
        <span>Total Score: {totalObtained} / {totalObtainable || '—'}</span>
        <span>Average: {Number(average).toFixed(1)}%</span>
        <span>Position: {fmt(summary?.position)}</span>
        <span>Status: {status}</span>
      </div>

      {/* COGNITIVE + BEHAVIOURAL */}
      <div className="rs-two-col">
        <div className="rs-panel">
          <h3>Cognitive Behaviour</h3>
          <table>
            <tbody>
              {COGNITIVE.map((t) => (
                <tr key={t.key}>
                  <td>{t.label}</td>
                  <td>{review?.cognitiveRatings?.[t.key] || '—'}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rs-panel">
          <h3>Behavioural Traits</h3>
          <table>
            <tbody>
              {BEHAVIORAL.map((t) => (
                <tr key={t.key}>
                  <td>{t.label}</td>
                  <td>{review?.behavioralRatings?.[t.key] || '—'}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REMARKS */}
      <div className="rs-remark">
        <h3>Academic Remark</h3>
        <p>{review?.academicRemark || ' '}</p>
      </div>
      <div className="rs-remark">
        <h3>Behavioural Remark</h3>
        <p>{review?.behavioralRemark || ' '}</p>
      </div>
      <div className="rs-remark">
        <h3>Teacher's Final Remark</h3>
        <p>{review?.teacherRemark || ' '}</p>
      </div>

      {/* SIGNATURES */}
      <div className="rs-signatures">
        <div><span className="role">Class Teacher</span></div>
        <div><span className="role">Head of School</span></div>
        <div><span className="role">Parent / Guardian</span></div>
      </div>

      <div className="rs-footer">
        Generated by CBT System · {session} · {term} · Date printed: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
});

export default ReportSheet;