
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplates, getUser, saveResponse, saveUser } from '../utils/storage';
import { generateSurveyQuestions, analyzeSurveyResult } from '../services/geminiService';
import { SurveyTemplate, UserProfile, Question } from '../types';
import { Sparkles, Loader2, CheckCircle, Star } from 'lucide-react';

const TakeSurvey: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<SurveyTemplate | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; outcomeId: string }[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const t = getTemplates().find(item => item.id === id);
    const u = getUser();
    if (!t) navigate('/');
    else {
      setTemplate(t);
      setUser(u);
      initializeSurvey(t, u);
    }
  }, [id]);

  const initializeSurvey = async (t: SurveyTemplate, u: UserProfile) => {
    setLoading(true);
    try {
      const qs = await generateSurveyQuestions(t, u);
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (outcomeId: string) => {
    const qId = questions[currentStep].id;
    const newAnswers = [...answers, { questionId: qId, outcomeId }];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishSurvey(newAnswers);
    }
  };

  const finishSurvey = async (finalAnswers: typeof answers) => {
    if (!template || !user) return;
    setLoading(true);
    const finalResult = await analyzeSurveyResult(template, finalAnswers);
    setResult(finalResult);
    
    // Update user history AND append to interests
    const updatedInterests = Array.from(new Set([...user.interests, finalResult]));
    
    const updatedUser = {
      ...user,
      interests: updatedInterests,
      history: { ...user.history, [template.id]: finalResult }
    };
    saveUser(updatedUser);
    setUser(updatedUser);
    setLoading(false);
  };

  const submitFinal = () => {
    if (!template || !user || !result) return;
    saveResponse({
      id: Date.now().toString(),
      templateId: template.id,
      userId: user.id,
      userName: user.name,
      result: result,
      rating: rating,
      timestamp: Date.now()
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">Personalizing Your Experience...</h3>
          <p className="text-slate-500 mt-1 max-w-xs">Our AI is crafting questions based on your profile and interests.</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-500">Discovery Complete</h2>
          <div className="mt-4">
            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Your Result Is</p>
            <h1 className="text-5xl font-black text-slate-900 mt-2 bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-violet-700">
              {result}
            </h1>
          </div>
          
          <div className="mt-10 border-t border-slate-100 pt-8">
            <p className="text-slate-600 mb-4 font-medium">How was your survey experience?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 transition-all hover:scale-110 ${rating >= star ? 'text-amber-500' : 'text-slate-200'}`}
                >
                  <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={submitFinal}
            disabled={rating === 0}
            className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold disabled:opacity-50 hover:bg-black transition-all"
          >
            Submit & Return Home
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center text-sm font-bold text-slate-400">
        <span>QUESTION {currentStep + 1} OF {questions.length}</span>
        <div className="flex-1 mx-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-xl space-y-10 animate-in fade-in duration-500">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {q.text}
        </h2>

        <div className="grid gap-4">
          {q.options.map((opt, idx) => (
            <button 
              key={idx}
              onClick={() => handleAnswer(opt.outcomeId)}
              className="w-full text-left p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 font-semibold transition-all group flex items-center justify-between"
            >
              <span>{opt.text}</span>
              <div className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-indigo-500 group-hover:bg-indigo-500 transition-all"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeSurvey;
