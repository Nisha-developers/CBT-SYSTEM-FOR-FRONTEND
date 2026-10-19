import React, { useCallback, useEffect, useState } from 'react';
import { MoreHorizontal, ChevronDown } from 'lucide-react';
import { listActivities } from '../../api/dashboard.api';
import { apiError } from '../../api/axios';
import { activityStyle } from '../../utils/activityStyle';

const PAGE = 30;

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (offset) => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await listActivities({ limit: PAGE, offset });
      const mapped = data.activities.map((a) => {
        const st = activityStyle(a.type);
        return { ...a, icon: st.icon, color: st.color, bg: st.bg, border: st.bg.replace('-50', '-100').replace('bg-', 'border-') };
      });
      setActivities((prev) => (offset === 0 ? mapped : [...prev, ...mapped]));
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(apiError(err, 'Could not load activity.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(0); }, [load]);

  const handleLoadMore = () => load(activities.length);

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
            {total} Events
          </span>
        </div>

        {/* Timeline Content */}
        <div className="p-6">
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          {!isLoading && !error && activities.length === 0 && <p className="text-sm text-gray-400">No activity yet.</p>}
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
        {hasMore && (
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
        )}

      </div>
    </div>
  );
};

export default Activities;