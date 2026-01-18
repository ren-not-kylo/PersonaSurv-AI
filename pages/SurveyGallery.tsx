
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplates } from '../utils/storage';
import { SurveyTemplate } from '../types';
import { ArrowRight, Clock, Users, Star } from 'lucide-react';

const SurveyGallery: React.FC = () => {
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  return (
    <div>
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Explore Surveys</h2>
        <p className="text-slate-500 mt-2">Discover personalized research journeys powered by AI.</p>
      </header>

      {templates.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 border-dashed">
          <p className="text-slate-400 mb-4">No surveys available yet.</p>
          <button 
            onClick={() => navigate('/admin/create')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
          >
            Create Your First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <div 
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
              onClick={() => navigate(`/survey/${t.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Clock size={24} />
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold">4.8</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {t.topic}
              </h3>
              
              <div className="flex items-center gap-4 mt-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1">
                  <Users size={16} /> 128 Takes
                </span>
                <span className="flex items-center gap-1">
                  <ClipboardList size={16} /> {t.questionCount} Questions
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                <span>Start Discovery</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import { ClipboardList } from 'lucide-react';
export default SurveyGallery;
