
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ClipboardList, User, Sparkles, LogOut } from 'lucide-react';
import { getSessionRole, setSessionRole } from '../utils/storage';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = getSessionRole();

  if (location.pathname === '/signin') {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center">{children}</main>;
  }

  const allNavItems = [
    { path: '/', label: 'Surveys', icon: ClipboardList, roles: [UserRole.USER] },
    { path: '/profile', label: 'My Profile', icon: User, roles: [UserRole.USER] },
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN] },
    { path: '/admin/create', label: 'New Template', icon: PlusCircle, roles: [UserRole.ADMIN] },
  ];

  const filteredItems = allNavItems.filter(item => currentRole && item.roles.includes(currentRole));

  const handleSignOut = () => {
    setSessionRole(null);
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar / Top Nav */}
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 sticky top-0 h-auto md:h-screen z-10 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            PersonaSurv
          </h1>
        </div>
        
        <div className="px-4 py-2 space-y-1 flex-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 space-y-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Active Role</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${currentRole === UserRole.ADMIN ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
              <span className="text-sm font-bold text-slate-700">{currentRole === UserRole.ADMIN ? 'Administrator' : 'Participant'}</span>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Switch Role</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
