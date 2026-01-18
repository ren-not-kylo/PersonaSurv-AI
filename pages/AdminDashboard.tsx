
import React, { useState, useEffect } from 'react';
import { getTemplates, getResponses } from '../utils/storage';
import { SurveyTemplate, SurveyResponse } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Star, Award, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  useEffect(() => {
    const t = getTemplates();
    const r = getResponses();
    setTemplates(t);
    setResponses(r);
    if (t.length > 0) setSelectedTemplateId(t[0].id);
  }, []);

  const currentResponses = responses.filter(r => r.templateId === selectedTemplateId);
  const avgRating = currentResponses.length > 0 
    ? (currentResponses.reduce((acc, curr) => acc + curr.rating, 0) / currentResponses.length).toFixed(1)
    : '0.0';

  const distributionData = Object.entries(
    currentResponses.reduce((acc, curr) => {
      acc[curr.result] = (acc[curr.result] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Research Analytics</h2>
          <p className="text-slate-500 mt-2">Monitor how participants are categorizing across your surveys.</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Select Template</label>
          <select 
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.topic}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Participants', value: currentResponses.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Avg. Satisfaction', value: `${avgRating}/5`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Completion Rate', value: '94%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Unique Results', value: distributionData.length, icon: Award, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Result Distribution</h3>
          <div className="h-[400px]">
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={50}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p>No data available for this template.</p>
              </div>
            )}
          </div>
        </div>

        {/* Participant List */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Participants</h3>
          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
            {currentResponses.length > 0 ? (
              currentResponses.sort((a,b) => b.timestamp - a.timestamp).map((r) => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center group hover:bg-indigo-50 transition-colors">
                  <div>
                    <p className="font-bold text-slate-900">{r.userName}</p>
                    <p className="text-xs text-slate-400">{new Date(r.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                      {r.result}
                    </span>
                    <div className="flex gap-0.5 mt-1 justify-end text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < r.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-10">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
