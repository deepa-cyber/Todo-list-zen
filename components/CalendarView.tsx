
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ExternalLink, Settings, Info, ListTodo, Circle, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

const CalendarView: React.FC = () => {
  const [calendarUrl, setCalendarUrl] = useState<string>('');
  const [isSettingUrl, setIsSettingUrl] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('zentask-tasks');
    if (saved) {
      setLocalTasks(JSON.parse(saved));
    }
  }, []);

  const defaultEmbed = "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FLos_Angeles";

  // Filter tasks for today or upcoming
  const today = new Date().toISOString().split('T')[0];
  const upcomingTasks = localTasks
    .filter(t => !t.completed && t.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[700px]">
        {/* Agenda Sidebar */}
        <div className="xl:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <ListTodo size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800">Your Agenda</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <div key={task.id} className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 group">
                  <p className="text-sm font-semibold text-slate-800 mb-1">{task.text}</p>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight">
                    {task.dueDate === today ? "Today" : new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-xs text-slate-400">No upcoming tasks.</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-tight">
              Tasks shown here are your local todos. Use the "Schedule" icon on the task list to push them to your real Google Calendar.
            </p>
          </div>
        </div>

        {/* Calendar Frame */}
        <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <CalendarIcon size={20} className="text-indigo-600" />
              Live Google Calendar
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsSettingUrl(!isSettingUrl)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                title="Update Calendar Embed"
              >
                <Settings size={18} />
              </button>
              <a 
                href="https://calendar.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {isSettingUrl && (
            <div className="p-4 bg-indigo-50 border-b border-indigo-100">
              <label className="block text-[10px] font-bold text-indigo-700 uppercase mb-2">Embed Configuration</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Iframe src URL..."
                  className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={calendarUrl}
                  onChange={(e) => setCalendarUrl(e.target.value)}
                />
                <button 
                  onClick={() => setIsSettingUrl(false)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 bg-slate-50 relative">
            <iframe 
              src={calendarUrl || defaultEmbed}
              style={{ border: 0 }} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
