
import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Calendar as CalendarIcon, 
  BarChart2, 
  List, 
  Plus, 
  Trash2, 
  Flame, 
  Star,
  RefreshCw,
  Info,
  CalendarDays,
  Share2
} from 'lucide-react';
import { Task, AppView, MotivationalQuote } from './types';
import { fetchDailyMotivation } from './services/geminiService';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import StatsView from './components/StatsView';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState('tasks' as AppView);
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [autoSync, setAutoSync] = useState(false);

  // Load initial tasks
  useEffect(() => {
    const saved = localStorage.getItem('zentask-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save tasks on change
  useEffect(() => {
    localStorage.setItem('zentask-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const refreshMotivation = useCallback(async () => {
    setIsQuoteLoading(true);
    const pendingCount = tasks.filter(t => !t.completed).length;
    const newQuote = await fetchDailyMotivation(pendingCount);
    setQuote(newQuote);
    setIsQuoteLoading(false);
  }, [tasks]);

  useEffect(() => {
    refreshMotivation();
  }, []);

  const getGoogleCalendarUrl = (task: Task) => {
    const date = task.dueDate.replace(/-/g, '');
    const title = encodeURIComponent(task.text);
    const endDate = new Date(task.dueDate + 'T00:00:00');
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${endDateStr}&details=Task+managed+by+ZenTask+AI&sf=true&output=xml`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      priority: 'medium',
      createdAt: Date.now(),
      dueDate: inputDate,
      isSynced: false
    };
    
    setTasks([newTask, ...tasks]);
    
    if (autoSync) {
      window.open(getGoogleCalendarUrl(newTask), '_blank');
      newTask.isSynced = true;
    }
    
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const setSynced = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isSynced: true } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <nav className="w-full md:w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col items-center py-8 px-4 sticky top-0 h-auto md:h-screen z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <CheckCircle size={28} />
          </div>
          <h1 className="hidden lg:block font-serif text-2xl font-bold text-slate-800">ZenTask</h1>
        </div>

        <div className="flex flex-row md:flex-col gap-4 w-full justify-around md:justify-start">
          <NavButton 
            active={view === 'tasks'} 
            onClick={() => setView('tasks')} 
            icon={<List size={22} />} 
            label="My Day" 
          />
          <NavButton 
            active={view === 'calendar'} 
            onClick={() => setView('calendar')} 
            icon={<CalendarIcon size={22} />} 
            label="Calendar" 
          />
          <NavButton 
            active={view === 'stats'} 
            onClick={() => setView('stats')} 
            icon={<BarChart2 size={22} />} 
            label="Progress" 
          />
        </div>

        <div className="mt-auto hidden lg:block w-full">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
              <Flame size={18} fill="currentColor" />
              <span className="font-bold">Daily Streak</span>
            </div>
            <p className="text-sm text-indigo-600">You're doing great! Keep the momentum going.</p>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-slate-500 font-medium mb-1">Welcome back,</p>
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Focus on the Goal</h2>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Star size={16} className="text-amber-500" fill="currentColor" />
                  {tasks.length - completedCount} tasks to conquer
                </span>
              </div>
            </div>

            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500">AI Daily Spark</span>
                  <button 
                    onClick={refreshMotivation}
                    disabled={isQuoteLoading}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <RefreshCw size={14} className={isQuoteLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
                {isQuoteLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-700 font-medium italic">"{quote?.quote}"</p>
                    <p className="text-xs text-slate-400 text-right">— {quote?.author}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {view === 'tasks' && (
              <div className="space-y-6">
                <form onSubmit={addTask} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="relative">
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="What will you conquer?"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400 text-lg"
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Plus size={24} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none group-focus-within:text-indigo-600 transition-colors">
                        <CalendarDays size={20} />
                      </div>
                      <input 
                        type="date"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none font-medium"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
                      <input 
                        type="checkbox" 
                        id="autoSync" 
                        checked={autoSync}
                        onChange={(e) => setAutoSync(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="autoSync" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">
                        Auto-sync to Google
                      </label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Add Task
                    </button>
                  </div>
                </form>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                  <TaskList 
                    tasks={tasks} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask}
                    onSync={setSynced}
                  />
                </div>
              </div>
            )}

            {view === 'calendar' && <CalendarView />}
            {view === 'stats' && <StatsView tasks={tasks} />}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart2 size={20} className="text-indigo-600" />
                Momentum
              </h3>
              
              <div className="relative flex items-center justify-center mb-6">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * progress) / 100}
                    strokeLinecap="round"
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-bold text-slate-900">{progress}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Tasks Completed</span>
                  <span className="font-bold text-slate-900">{completedCount}/{tasks.length}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-500" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-xl text-white overflow-hidden relative">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <CheckCircle size={160} />
              </div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Info size={18} className="text-white/80" />
                Zen Tip
              </h3>
              <p className="text-indigo-100 text-sm leading-relaxed relative z-10">
                "Syncing" your tasks with Google Calendar helps you block time for deep work. Tap the calendar icon on any task to push it to your schedule!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-2xl transition-all w-full ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 font-semibold' 
        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 font-medium'
    }`}
  >
    {icon}
    <span className="hidden lg:block">{label}</span>
  </button>
);

export default App;
