
import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Task } from '../types';
import { TrendingUp, Award, Zap, Target } from 'lucide-react';

interface StatsViewProps {
  tasks: Task[];
}

const StatsView: React.FC<StatsViewProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.completed);
  
  // Mock data for the last 7 days since we might not have real history
  const data = useMemo(() => [
    { name: 'Mon', tasks: Math.floor(Math.random() * 5) + 2 },
    { name: 'Tue', tasks: Math.floor(Math.random() * 5) + 3 },
    { name: 'Wed', tasks: Math.floor(Math.random() * 5) + 1 },
    { name: 'Thu', tasks: Math.floor(Math.random() * 5) + 4 },
    { name: 'Fri', tasks: Math.floor(Math.random() * 5) + 2 },
    { name: 'Sat', tasks: Math.floor(Math.random() * 5) + 0 },
    { name: 'Sun', tasks: completedTasks.length },
  ], [completedTasks.length]);

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<TrendingUp className="text-emerald-500" />}
          label="Total Completed"
          value={completedTasks.length}
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<Zap className="text-indigo-500" />}
          label="Daily Velocity"
          value="4.2"
          sub="Tasks/Day"
          color="bg-indigo-50"
        />
        <StatCard 
          icon={<Award className="text-amber-500" />}
          label="Success Rate"
          value={`${tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%`}
          color="bg-amber-50"
        />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2 text-xl">
          <Target size={24} className="text-indigo-600" />
          Weekly Performance
        </h3>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
              <Bar 
                dataKey="tasks" 
                fill="#4f46e5" 
                radius={[8, 8, 0, 0]}
                barSize={40}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === data.length - 1 ? '#4f46e5' : '#e2e8f0'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-serif font-bold mb-4">Consistency is King</h3>
          <p className="text-indigo-100 max-w-2xl leading-relaxed">
            Productivity isn't about doing everything at once. It's about doing small things consistently. You've completed {completedTasks.length} meaningful actions recently. Keep building that momentum!
          </p>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
    <div className={`${color} p-4 rounded-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {sub && <span className="text-xs text-slate-400 font-medium">{sub}</span>}
      </div>
    </div>
  </div>
);

export default StatsView;
