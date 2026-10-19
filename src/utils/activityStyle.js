import { FileText, CheckCircle2, FolderPlus, UserPlus, AlertCircle, ShieldCheck, GraduationCap } from 'lucide-react';

// Icon + colours for an activity, based on the `type` the API sends.
const STYLES = {
  exam: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  student: { icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
  school: { icon: FolderPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
  result: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  admin: { icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
  alert: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  general: { icon: GraduationCap, color: 'text-gray-600', bg: 'bg-gray-100' },
};

export const activityStyle = (type) => STYLES[type] || STYLES.general;
