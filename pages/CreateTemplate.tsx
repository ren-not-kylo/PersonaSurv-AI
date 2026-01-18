
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveTemplate } from '../utils/storage';
import { Outcome } from '../types';
import { Plus, Trash2, Save, Info } from 'lucide-react';

const CreateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [outcomes, setOutcomes] = useState<Outcome[]>([
    { id: '1', name: '', traits: [] }
  ]);

  const addOutcome = () => {
    setOutcomes([...outcomes, { id: Date.now().toString(), name: '', traits: [] }]);
  };

  const removeOutcome = (id: string) => {
    setOutcomes(outcomes.filter(o => o.id !== id));
  };

  const updateOutcome = (id: string, field: keyof Outcome, value: any) => {
    setOutcomes(outcomes.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleSave = () => {
    if (!topic || outcomes.some(o => !o.name)) {
      alert("Please fill in all required fields.");
      return;
    }
    const newTemplate = {
      id: Date.now().toString(),
      topic,
      questionCount,
      outcomes,
      createdAt: Date.now(),
    };
    saveTemplate(newTemplate);
    navigate('/admin');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Create Template</h2>
        <p className="text-slate-500 mt-2">Define your research topic and expected outcomes.</p>
      </header>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Research Topic</label>
          <input 
            type="text" 
            placeholder="e.g., Hogwarts House, Ideal Pet, Leadership Style"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Questions ({questionCount})</label>
          <input 
            type="range" 
            min="3" max="15" 
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-semibold text-slate-700">Possible Outcomes</label>
            <button 
              onClick={addOutcome}
              className="flex items-center gap-2 text-indigo-600 text-sm font-bold hover:text-indigo-700"
            >
              <Plus size={16} /> Add Outcome
            </button>
          </div>
          
          <div className="space-y-4">
            {outcomes.map((o, index) => (
              <div key={o.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3 relative group">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input 
                      type="text"
                      placeholder="Outcome Name (e.g., Gryffindor)"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={o.name}
                      onChange={(e) => updateOutcome(o.id, 'name', e.target.value)}
                    />
                  </div>
                  {outcomes.length > 1 && (
                    <button 
                      onClick={() => removeOutcome(o.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div>
                  <input 
                    type="text"
                    placeholder="Traits (comma separated: Brave, Bold, Fierce)"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={o.traits.join(', ')}
                    onChange={(e) => updateOutcome(o.id, 'traits', e.target.value.split(',').map(s => s.trim()))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl text-indigo-700 text-sm leading-relaxed">
          <Info className="shrink-0 mt-0.5" size={18} />
          <p>Gemini AI will use these outcomes and traits to craft unique questions tailored specifically to each user's personal profile.</p>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Save size={20} /> Save Template
        </button>
      </div>
    </div>
  );
};

export default CreateTemplate;
