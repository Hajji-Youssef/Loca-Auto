
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }
    
    register(formData.email, formData.fullName, formData.password);
    setIsSuccess(true);
    
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center space-y-4 animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={48} />
           </div>
           <h2 className="text-2xl font-black text-gray-900">Bienvenue à bord !</h2>
           <p className="text-gray-500">Votre compte a été créé avec succès. Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
             <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Rejoignez-nous</h2>
          <p className="mt-2 text-sm text-gray-500">Créez votre profil pour réserver votre prochain véhicule</p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <User size={18} />
              </div>
              <input name="fullName" type="text" required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all sm:text-sm" placeholder="Prénom et Nom" value={formData.fullName} onChange={handleChange} />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <Mail size={18} />
              </div>
              <input name="email" type="email" required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all sm:text-sm" placeholder="Email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <Phone size={18} />
              </div>
              <input name="phoneNumber" type="tel" required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all sm:text-sm" placeholder="Téléphone" value={formData.phoneNumber} onChange={handleChange} />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={18} />
              </div>
              <input name="password" type="password" required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all sm:text-sm" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={18} />
              </div>
              <input name="confirmPassword" type="password" required className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all sm:text-sm" placeholder="Confirmer mot de passe" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg active:scale-95">
            Créer mon compte
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Déjà inscrit ? <span className="underline">Se connecter</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
