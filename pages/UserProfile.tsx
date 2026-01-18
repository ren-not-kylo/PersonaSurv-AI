
import React, { useState, useEffect } from 'react';
import { getUser, saveUser } from '../utils/storage';
import { UserProfile } from '../types';
import { User, Tag, MapPin, Save, Plus, X } from 'lucide-react';

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    setProfile(getUser());
  }, []);

  const handleSave = () => {
    if (profile) {
      saveUser(profile);
      alert('Profile updated successfully!');
    }
  };

  const addInterest = () => {
    if (newInterest && profile) {
      setProfile({ ...profile, interests: [...profile.interests, newInterest] });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    if (profile) {
      setProfile({ ...profile, interests: profile.interests.filter(i => i !== interest) });
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Your AI Persona</h2>
        <p className="text-slate-500 mt-2">This data helps Gemini personalize your survey questions.</p>
      </header>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
            <User size={40} />
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Demographics & Context</label>
              <textarea 
                rows={3}
                placeholder="e.g. 24 year old college student in New York, passionate about ethics and AI."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={profile.demographics}
                onChange={(e) => setProfile({ ...profile, demographics: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Interests</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.interests.map((interest) => (
                  <span 
                    key={interest} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100"
                  >
                    {interest}
                    <button onClick={() => removeInterest(interest)} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add interest (e.g. Cooking)"
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                />
                <button 
                  onClick={addInterest}
                  className="p-2 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {Object.keys(profile.history).length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Past Identity Results</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(profile.history).map(([id, result]) => (
                    <div key={id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Tag size={14} className="text-indigo-500" />
                      <span className="text-sm font-semibold text-slate-700">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
            >
              <Save size={20} /> Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
