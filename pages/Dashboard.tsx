
import React, { useState, useEffect, useMemo } from 'react';
import { User, Settings, CreditCard, LogOut, Shield, Car, Save, Sparkles, X, KeySquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { Rental, RentalStatus } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'security'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // États pour les données réelles
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: "06 12 34 56 78",
    licenseNumber: "123456789AZ",
    address: "12 Rue de la Paix, 75000 Paris"
  });

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }
    
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    
    // Chargement des données réelles pour synchronisation
    const loadUserData = async () => {
        try {
            const userRentals = await ApiService.getMyRentals();
            setRentals(userRentals);
        } catch (error) {
            console.error("Erreur lors de la synchronisation des données", error);
        } finally {
            setLoadingData(false);
        }
    };

    loadUserData();
    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Calculs dynamiques basés sur les données réelles
  const stats = useMemo(() => {
    const active = rentals.filter(r => r.status === RentalStatus.ACTIVE).length;
    const totalSpent = rentals
        .filter(r => r.status !== RentalStatus.CANCELLED)
        .reduce((sum, r) => sum + r.totalPrice, 0);
    
    // On estime l'ancienneté (mockée ici car non présente en DB)
    return { active, totalSpent };
  }, [rentals]);

  if (!user) return null;

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert("Profil mis à jour avec succès !");
  };

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  const getFriendlyRole = () => {
      if (user.role === 'ADMIN') return "Administrateur LocaAuto";
      if (user.role === 'WORKER') return "Agent de Flotte";
      return "Client LocaAuto";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {showWelcome && (
          <div className="fixed top-24 right-4 z-50 bg-white border border-emerald-100 shadow-xl rounded-2xl p-4 pr-12 animate-in slide-in-from-right duration-500 flex items-center gap-4">
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                  <Sparkles size={20} />
              </div>
              <div>
                  <p className="text-sm font-bold text-gray-900">Content de vous revoir !</p>
                  <p className="text-xs text-gray-500">Votre espace est à jour.</p>
              </div>
              <button onClick={() => setShowWelcome(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
              </button>
          </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Header - NOM EN GRAND / ROLE EN PETIT */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">{user.fullName}</h1>
            <p className="text-lg font-bold text-primary-600 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                {getFriendlyRole()}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="h-14 w-14 rounded-xl bg-gray-900 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                {user.fullName.charAt(0)}
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Compte Vérifié</p>
                <p className="text-sm font-bold text-gray-900">{user.email}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <nav className="flex flex-col p-2 space-y-1">
                <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Car size={18} /> Tableau de bord
                </button>
                <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <User size={18} /> Mon Profil
                </button>
                <button onClick={() => setActiveTab('security')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Shield size={18} /> Sécurité
                </button>
                <div className="border-t border-gray-100 my-2 mx-4"></div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all w-full text-left">
                  <LogOut size={18} /> Déconnexion
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* LOCATIONS ACTIVES SYNCHRONISÉES */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-primary-200 transition-all">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Locations actives</p>
                    {loadingData ? <Loader2 className="animate-spin text-primary-300" size={24}/> : (
                        <p className="text-3xl font-black text-gray-900">{stats.active.toString().padStart(2, '0')}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-primary-600 font-bold text-xs">
                        <Car size={14}/> Gérer mes réservations
                    </div>
                  </div>

                  {/* DÉPENSES SYNCHRONISÉES */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-emerald-200 transition-all">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dépenses totales</p>
                    {loadingData ? <Loader2 className="animate-spin text-emerald-300" size={24}/> : (
                        <p className="text-3xl font-black text-gray-900">{stats.totalSpent.toLocaleString()} €</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-xs">
                        <CreditCard size={14}/> Voir facturation
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-purple-200 transition-all">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fidélité</p>
                    <p className="text-3xl font-black text-gray-900">OR</p>
                    <div className="mt-4 flex items-center gap-2 text-purple-600 font-bold text-xs">
                        <Sparkles size={14}/> Mes avantages
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                      <Sparkles className="text-amber-500" size={20}/> Activité récente
                  </h3>
                  <div className="space-y-4">
                      {rentals.length > 0 ? (
                        rentals.slice(0, 3).map(r => (
                          <div key={r.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm border border-gray-200">
                                  <Car size={20}/>
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900">{r.productTitle}</p>
                                  <p className="text-xs text-gray-500">Du {r.startDate} au {r.endDate}</p>
                              </div>
                              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${r.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                {r.status}
                              </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4 italic">Aucune activité récente.</p>
                      )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-black text-gray-900">Informations Personnelles</h3>
                  <button onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isEditing ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {isEditing ? <><Save size={16}/> Enregistrer</> : <><Settings size={16}/> Modifier</>}
                  </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nom Complet</label>
                      <input type="text" name="fullName" disabled={!isEditing} value={profileData.fullName} onChange={handleProfileChange} className={`w-full rounded-xl border p-3 text-sm font-medium ${isEditing ? 'border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email professionnel</label>
                      <input type="email" name="email" disabled={!isEditing} value={profileData.email} onChange={handleProfileChange} className={`w-full rounded-xl border p-3 text-sm font-medium ${isEditing ? 'border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Téléphone mobile</label>
                      <input type="tel" name="phoneNumber" disabled={!isEditing} value={profileData.phoneNumber} onChange={handleProfileChange} className={`w-full rounded-xl border p-3 text-sm font-medium ${isEditing ? 'border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Numéro de Permis</label>
                      <input type="text" name="licenseNumber" disabled={!isEditing} value={profileData.licenseNumber} onChange={handleProfileChange} className={`w-full rounded-xl border p-3 text-sm font-medium ${isEditing ? 'border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Adresse de résidence</label>
                      <input type="text" name="address" disabled={!isEditing} value={profileData.address} onChange={handleProfileChange} className={`w-full rounded-xl border p-3 text-sm font-medium ${isEditing ? 'border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`} />
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900">Sécurité du compte</h3>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                      <Shield size={12}/> Sécurité Maximale
                  </div>
                </div>
                <div className="p-6">
                  {/* GESTION MOT DE PASSE UNIQUEMENT */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 mb-6 flex flex-col md:flex-row items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-gray-100">
                          <KeySquare size={32}/>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                          <p className="font-black text-gray-900 text-xl">Modifier votre mot de passe</p>
                          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                              Assurez la sécurité de votre compte en changeant régulièrement votre mot de passe.
                          </p>
                      </div>
                      <button className="px-6 py-3 bg-gray-900 hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95">
                          Mettre à jour
                      </button>
                  </div>

                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border-b border-gray-50">
                          <div>
                              <p className="font-bold text-gray-900">Dernière connexion</p>
                              <p className="text-xs text-gray-400 mt-0.5">Aujourd'hui à {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}</p>
                          </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                          <div>
                              <p className="font-bold text-gray-900">Appareils autorisés</p>
                              <p className="text-xs text-gray-400 mt-0.5">Vous êtes connecté sur cet appareil uniquement.</p>
                          </div>
                          <button className="text-primary-600 font-bold text-xs hover:underline">Gérer</button>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
