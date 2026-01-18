
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setSessionRole } from '../utils/storage';
import { UserRole } from '../types';
import { ShieldCheck, User, Sparkles } from 'lucide-react';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = (role: UserRole) => {
    setSessionRole(role);
    navigate(role === UserRole.ADMIN ? '/admin' : '/');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="mb-12 text-center">
        <div className="bg-indigo-600 p-4 rounded-3xl inline-block mb-6 shadow-xl shadow-indigo-200">
          <Sparkles className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">PersonaSurv AI</h1>
        <p className="text-slate-500 mt-2 text-lg">Choose your portal to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Admin Portal */}
        <button 
          onClick={() => handleSignIn(UserRole.ADMIN)}
          className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200 text-left hover:border-indigo-500 hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={120} />
          </div>
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Researcher Portal</h3>
          <p className="text-slate-500 leading-relaxed">
            Create survey templates, analyze participant distribution, and monitor research impact.
          </p>
          <div className="mt-8 flex items-center gap-2 text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Enter as Admin</span>
            <span className="text-xl">→</span>
          </div>
        </button>

        {/* User Portal */}
        <button 
          onClick={() => handleSignIn(UserRole.USER)}
          className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200 text-left hover:border-emerald-500 hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <User size={120} />
          </div>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
            <User size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Participant Portal</h3>
          <p className="text-slate-500 leading-relaxed">
            Take personalized AI-generated surveys and discover your unique traits and classifications.
          </p>
          <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Enter as Participant</span>
            <span className="text-xl">→</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
