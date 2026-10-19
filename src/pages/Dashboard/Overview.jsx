import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOverview } from '../../api/dashboard.api';
import { apiError } from '../../api/axios';
import { activityStyle } from '../../utils/activityStyle';
import { 
  Users, 
  FileText, 
  BookOpen, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  UserPlus,
  FolderPlus,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// --- CUSTOM TOOLTIP FOR CHARTS ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: <span className="font-medium text-gray-900">{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOverview()
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(apiError(err, 'Could not load the overview.')));
  }, []);

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!data) return <div className="p-6 text-sm text-gray-500">Loading overview…</div>;

  const k = data.kpis;
  const pct = (n) => (n === null || n === undefined ? '—' : `${n}%`);
  const kpiData = [
    { label: 'Total Students', value: k.totalStudents.toLocaleString(), change: `+${k.newStudentsThisMonth}`, trend: k.newStudentsThisMonth > 0 ? 'up' : 'neutral', icon: Users, sub: 'added this month' },
    { label: 'Active Exams', value: String(k.activeExams), change: String(data.totalExams), trend: 'neutral', icon: FileText, sub: 'currently running' },
    { label: 'Total Subjects', value: String(k.totalSubjects), change: String(k.totalSubjects), trend: 'neutral', icon: BookOpen, sub: 'across classes' },
    {
      label: 'Average Performance', value: pct(k.averagePerformance),
      change: k.performanceChange === null ? '—' : `${k.performanceChange >= 0 ? '+' : ''}${k.performanceChange}%`,
      trend: k.performanceChange !== null && k.performanceChange > 0 ? 'up' : 'neutral', icon: Target,
      sub: k.performanceChange === null ? `${data.term.term}, ${data.term.session}` : 'from last term',
    },
  ];
  const examActivityData = data.examActivity;
  const classPerformanceData = data.classPerformance;
  const recentActivity = data.recentActivity.map((a) => ({ id: a.id, text: a.title, time: a.time, ...activityStyle(a.type) }));

  return (
    <div className="space-y-6">
      
     {/* 1. KPI SECTION */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {kpiData.map((kpi, idx) => {
    const isPrimary = idx === 0;

    return (
      <div
        key={idx}
        className={`relative overflow-hidden rounded-xl border p-5 lg:p-6 shadow-sm transition-shadow hover:shadow-md ${
          isPrimary
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-600 hover:shadow-blue-600/25'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Decorative circles (primary card only) */}
        {isPrimary && (
          <>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
          </>
        )}

        <div className="relative flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${isPrimary ? 'bg-white/15' : 'bg-gray-50'}`}>
            <kpi.icon className={`w-5 h-5 ${isPrimary ? 'text-white' : 'text-gray-400'}`} />
          </div>
          {kpi.trend === 'up' && (
            <span
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
                isPrimary ? 'text-white bg-white/15' : 'text-emerald-600 bg-emerald-50'
              }`}
            >
              <ArrowUpRight className="w-3 h-3" /> {kpi.change}
            </span>
          )}
          {kpi.trend === 'neutral' && (
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
              {kpi.change}
            </span>
          )}
        </div>

        <div className="relative">
          <h3
            className={`text-3xl font-bold tracking-tight ${
              isPrimary ? 'text-white' : 'text-gray-900'
            }`}
          >
            {kpi.value}
          </h3>
          <p className={`text-sm mt-1 font-medium ${isPrimary ? 'text-blue-100' : 'text-gray-500'}`}>
            {kpi.label}
          </p>
          <p className={`text-xs mt-0.5 ${isPrimary ? 'text-blue-200' : 'text-gray-400'}`}>
            {kpi.sub}
          </p>
        </div>
      </div>
    );
  })}
</div>

      {/* 2. ANALYTICS SECTION (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RIGHT: Exam Activity (Donut Chart) - Takes 1/3 width */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Exam Activity</h2>
            <p className="text-sm text-gray-500">Distribution of exam statuses</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={examActivityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {examActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} exams`, 'Count']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-900">{data.totalExams}</span>
                <span className="text-xs text-gray-500 font-medium">Total Exams</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6 w-full">
              {examActivityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
         {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${activity.bg} ${activity.color}`}>
                  <activity.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 leading-snug">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CLASS PERFORMANCE (Bar Chart) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Class Performance Overview</h2>
          <p className="text-sm text-gray-500">Average score per class across all subjects</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value}%`, 'Average Score']}
              />
              <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}