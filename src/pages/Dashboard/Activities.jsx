import React, { useState } from 'react';
import { 
  FileText, 
  UserPlus, 
  CheckCircle2, 
  FolderPlus, 
  AlertCircle, 
  Calendar,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

// --- JUNK SCHOOL ACTIVITIES DATA ---
const INITIAL_ACTIVITIES = [
  {
    id: 1,
    title: 'Admin created a Mathematics examination',
    description: 'Mid-term assessment for SS2 students',
    time: '5 minutes ago',
    date: 'Today',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    id: 2,
    title: '42 students completed English assessment',
    description: 'SS1 English Language mid-term',
    time: '18 minutes ago',
    date: 'Today',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    id: 3,
    title: 'New subject "Computer Science" was added',
    description: 'Added to SS3 curriculum',
    time: '1 hour ago',
    date: 'Today',
    icon: FolderPlus,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    id: 4,
    title: '25 students were added to SS2',
    description: 'Bulk import from CSV file',
    time: '2 hours ago',
    date: 'Today',
    icon: UserPlus,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    id: 5,
    title: 'Physics results are pending review',
    description: 'SS3 Mock Examination - 86 submissions',
    time: '3 hours ago',
    date: 'Today',
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    id: 6,
    title: 'Chemistry practical scheduled',
    description: 'Scheduled for SS3 students next week',
    time: '5 hours ago',
    date: 'Yesterday',
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    id: 7,
    title: 'Admin updated grading policy',
    description: 'New grading scale applied to all classes',
    time: '8 hours ago',
    date: 'Yesterday',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    id: 8,
    title: 'Biology examination results published',
    description: 'SS2 Biology mid-term results are live',
    time: '1 day ago',
    date: 'Yesterday',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
];

const Activities = () => {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(false);

  // Simulates loading more data from an API
  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, you would append new API data here
      setIsLoading(false);
    }, 800);
  };

  // Group activities by date for better scannability
  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.date]) {
      acc[activity.date] = [];
    }
    acc[activity.date].push(activity);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Activity</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all actions and updates across your school platform.
          </p>
        </div>
      </div>

      {/* --- ACTIVITY TIMELINE CARD --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Activity Log</h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            {activities.length} Events
          </span>
        </div>

        {/* Timeline Content */}
        <div className="p-6">
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, items]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white pr-2">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                {/* Activity Items */}
                <div className="space-y-6">
                  {items.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 group">
                      
                      {/* Timeline Indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${activity.bg} ${activity.border}`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        {/* Vertical Line */}
                        {index !== items.length - 1 && (
                          <div className="w-px flex-1 bg-gray-100 my-2 group-hover:bg-gray-200 transition-colors"></div>
                        )}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 leading-snug">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-gray-400 font-medium">
                              {activity.time}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- LOAD MORE BUTTON --- */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-white border border-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                Load More Activities
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Activities;