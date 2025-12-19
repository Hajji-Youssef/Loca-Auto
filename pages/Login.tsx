
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldAlert, CheckCircle2, Loader2, Info } from 'lucide-react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'un délai réseau court
    setTimeout(() => {
      const success = login(formData.email, formData.password);
      setLoading(false);
      
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          if (formData.email.toLowerCase().includes('worker') || formData.email.toLowerCase().includes('admin')) {
              navigate('/workspace');
          } else {
              navigate('/dashboard');
          }
        }, 1500);
      } else {
        setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
      }
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-500">
        <div className="max-w-sm w-full text-center space-y-6 p-8">
          <div className="relative mx-auto w-24 h-24">
             <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-25"></div>
             <div className="relative bg-emerald-100 text-emerald-600 rounded-full w-24 h-24 flex items-center justify-center shadow-inner">
                <CheckCircle2 size={56} className="animate-in zoom-in duration-300" />
             </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Connexion réussie !</h2>
            <p className="text-lg text-gray-600 italic">Redirection vers votre espace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4 shadow-inner">
             <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Connexion</h2>
          <p className="mt-2 text-sm text-gray-500 italic">Accès sécurisé à votre profil LocaAuto</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 text-xs text-blue-800">
            <Info className="shrink-0 mt-0.5" size={16} />
            <div>
                <p className="font-bold mb-1">Démonstration :</p>
                <p>Emails : <strong>worker@locaauto.com</strong> ou <strong>admin@locaauto.com</strong></p>
                <p>Pass : <strong>123456</strong></p>
            </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <ShieldAlert className="text-red-600 shrink-0" size={20} />
            <p className="text-sm text-red-700 font-medium leading-tight">{error}</p>
          </div>
        )}
        
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <Mail size={18} />
              </div>
              <input id="email" name="email" type="email" required disabled={loading} className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all sm:text-sm" placeholder="votre@email.com" value={formData.email} onChange={handleChange} />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={18} />
              </div>
              <input id="password" name="password" type="password" required disabled={loading} className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all sm:text-sm" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg active:scale-95 disabled:opacity-70">
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Se connecter"}
          </button>

          <div className="text-center">
            <Link to="/signup" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Pas encore membre ? <span className="underline">Créer un compte</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
