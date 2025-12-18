
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, User, CalendarDays, LogIn, Briefcase, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isWorker, logout } = useAuth();
  
  const isWorkspace = location.pathname.startsWith('/workspace');
  if (isWorkspace) return null; 

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
      logout();
      navigate('/');
      setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-primary-600 p-1.5 rounded-lg text-white transform group-hover:scale-110 transition-transform duration-200">
                <Car size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">Loca<span className="text-primary-600">Auto</span></span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/catalog" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive('/catalog') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Nos Véhicules</Link>
              <Link to="/sales" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive('/sales') ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-orange-300'}`}>Nos Ventes</Link>
              {user && (
                <>
                  <Link to="/rentals" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive('/rentals') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Mes Réservations</Link>
                  <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Mon Espace</Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isWorker && (
                <Link to="/workspace" className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-primary-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors">
                    <Briefcase size={16} /> Espace Agence
                </Link>
            )}
             
            {!user ? (
                <>
                    <Link to="/signup" className={`text-sm font-medium transition-colors ${isActive('/signup') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>S'inscrire</Link>
                    <Link to="/login" className="flex items-center gap-2 bg-gray-900 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
                    <LogIn size={16} /> Connexion
                    </Link>
                </>
            ) : (
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors">
                    <LogOut size={16} /> Déconnexion
                </button>
            )}
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="pt-2 pb-3 space-y-1">
             <Link to="/catalog" onClick={() => setIsOpen(false)} className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${isActive('/catalog') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}>
              <div className="flex items-center gap-3"><Car size={18}/> Nos Véhicules</div>
            </Link>
            <Link to="/sales" onClick={() => setIsOpen(false)} className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${isActive('/sales') ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}>
              <div className="flex items-center gap-3"><ShoppingBag size={18}/> Nos Ventes</div>
            </Link>
            {user && (
                <>
                    <Link to="/rentals" onClick={() => setIsOpen(false)} className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${isActive('/rentals') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3"><CalendarDays size={18}/> Mes Réservations</div>
                    </Link>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${isActive('/dashboard') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3"><User size={18}/> Mon Espace</div>
                    </Link>
                </>
            )}
            {isWorker && (
                <Link to="/workspace" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-3 border-l-4 border-slate-500 text-base font-medium bg-slate-50 text-slate-800">
                    <div className="flex items-center gap-3"><Briefcase size={18}/> Espace Agence</div>
                </Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200 bg-gray-50">
             <div className="flex flex-col px-4 space-y-3">
                {!user ? (
                    <>
                        <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100">S'inscrire</Link>
                        <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-md">Connexion</Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className="block w-full text-center px-4 py-2 border border-red-200 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100">Déconnexion</button>
                )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
