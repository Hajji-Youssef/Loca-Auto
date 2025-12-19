
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldAlert, CheckCircle2, Loader2, Check } from 'lucide-react';
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
          return prev + 2;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const success = login(formData.email, formData.password);
      setLoading(false);
      
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          const email = formData.email.toLowerCase();
          if (email.endsWith('@locaauto.com') && (email.includes('worker') || email.includes('admin'))) {
              navigate('/workspace');
          } else {
              navigate('/dashboard');
          }
        }, 2000); // Temps pour voir l'animation de succès
      } else {
        setError("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
      }
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#d1d5db]/90 backdrop-blur-sm animate-in fade-in duration-500">
        <div className="max-w-md w-full text-center space-y-6 p-8">
          {/* Checkmark Circle */}
          <div className="relative mx-auto w-24 h-24">
             <div className="absolute inset-0 bg-[#dcfce7] rounded-full animate-pulse"></div>
             <div className="relative bg-[#dcfce7] text-[#059669] rounded-full w-24 h-24 flex items-center justify-center shadow-md">
                <Check size={48} strokeWidth={4} className="animate-in zoom-in duration-300" />
             </div>
          </div>

          {/* Texts */}
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Connexion réussie !</h2>
            <div className="space-y-0.5">
                <p className="text-lg text-slate-500 font-medium">Ravi de vous revoir,</p>
                <p className="text-xl font-black text-[#2563eb]">{user?.fullName}</p>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full max-w-[280px] mx-auto space-y-4">
              <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                <div 
                    className="h-full bg-[#2563eb] transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                Sécurisation de la session...
              </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100/50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#eff6ff] rounded-full flex items-center justify-center text-[#3b82f6] mb-6 shadow-sm">
             <LogIn size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Connexion</h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">Accédez à votre espace sécurisé LocaAuto</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <ShieldAlert className="text-red-600 shrink-0" size={18} />
            <p className="text-xs text-red-700 font-bold leading-tight">{error}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3b82f6] transition-colors">
                <Mail size={18} />
              </div>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                disabled={loading} 
                className="block w-full pl-11 pr-4 py-4 bg-[#cbd5e1]/40 border-transparent rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:bg-white transition-all text-sm" 
                placeholder="votre@email.com" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3b82f6] transition-colors">
                <Lock size={18} />
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={loading} 
                className="block w-full pl-11 pr-4 py-4 bg-white border-2 border-[#3b82f6] rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all text-sm" 
                placeholder="••••••" 
                value={formData.password} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-[#0f172a] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] disabled:opacity-70 mt-6"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Se connecter"}
          </button>

          <div className="text-center pt-6">
            <Link to="/signup" className="text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca] transition-colors">
              Pas encore membre ? <span className="underline">Créer un compte</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
