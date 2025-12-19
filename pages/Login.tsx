
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldAlert, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  useEffect(() => {
    if (isSuccess) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2.5;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const result = login(formData.email, formData.password);
      setLoading(false);
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          const email = formData.email.toLowerCase();
          // Détection du domaine ou du rôle pour la redirection
          if (email.includes('admin') || email.includes('worker')) {
              navigate('/workspace');
          } else {
              navigate('/dashboard');
          }
        }, 1800);
      } else {
        setError(result.error || "Une erreur est survenue.");
      }
    }, 500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#cbd5e1]/95 backdrop-blur-sm animate-in fade-in duration-500">
        <div className="max-w-md w-full text-center space-y-10 p-8">
          <div className="relative mx-auto w-28 h-28">
             <div className="absolute inset-0 bg-[#dcfce7] rounded-full animate-pulse shadow-inner"></div>
             <div className="relative bg-[#dcfce7] text-[#059669] rounded-full w-28 h-28 flex items-center justify-center shadow-lg border-2 border-white/50">
                <Check size={64} strokeWidth={4} className="animate-in zoom-in duration-300" />
             </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Accès autorisé !</h2>
            <div className="space-y-1">
                <p className="text-xl text-slate-500 font-medium">Ravi de vous revoir,</p>
                <p className="text-2xl font-black text-[#2563eb] tracking-wide">{user?.fullName}</p>
            </div>
          </div>

          <div className="w-full max-w-[340px] mx-auto space-y-6">
              <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                <div 
                    className="h-full bg-[#2563eb] transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-[12px] font-black text-slate-400 tracking-[0.3em] uppercase">
                SÉCURISATION DE LA SESSION...
              </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8fafc] py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.05)] border border-gray-100/30">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-[#eff6ff] rounded-full flex items-center justify-center text-[#3b82f6] mb-8 shadow-sm">
             <LogIn size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Connexion</h2>
          <p className="mt-3 text-base text-slate-400 font-medium">Portail LocaAuto Enterprise</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
            <ShieldAlert className="text-red-600 shrink-0" size={24} />
            <p className="text-sm text-red-700 font-bold leading-tight">{error}</p>
          </div>
        )}
        
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3b82f6] transition-colors">
                <Mail size={22} />
              </div>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                disabled={loading} 
                className="block w-full pl-16 pr-6 py-5 bg-slate-100 border-2 border-transparent rounded-2xl text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:bg-white focus:border-[#3b82f6]/50 transition-all text-sm" 
                placeholder="Adresse email" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3b82f6] transition-colors">
                <Lock size={22} />
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={loading} 
                className="block w-full pl-16 pr-6 py-5 bg-slate-100 border-2 border-transparent rounded-2xl text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:bg-white focus:border-[#3b82f6]/50 transition-all text-sm" 
                placeholder="Mot de passe" 
                value={formData.password} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center items-center py-5 px-4 border border-transparent text-base font-black rounded-2xl text-white bg-[#0f172a] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.18)] active:scale-[0.97] disabled:opacity-70 mt-10"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : "Se connecter"}
          </button>

          <div className="text-center pt-8 border-t border-slate-100 mt-6">
            <p className="text-sm text-slate-500 font-medium mb-3">Besoin d'un accès ?</p>
            <Link to="/signup" className="text-sm font-bold text-[#4f46e5] hover:text-[#4338ca] transition-colors group underline decoration-dotted underline-offset-4">
              Créer mon compte client
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
