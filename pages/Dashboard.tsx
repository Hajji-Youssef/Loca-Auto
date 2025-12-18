import React, { useState, useEffect } from 'react';
import { User, Settings, CreditCard, LogOut, Shield, Car, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'security'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Redirection si non connecté
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // État local pour le formulaire d'édition
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: "06 12 34 56 78",
    licenseNumber: "123456789AZ",
    address: "12 Rue de la Paix, 75000 Paris"
  });

  // Mise à jour si l'user charge tardivement
  useEffect(() => {
    if(user) {
        setProfileData(prev => ({...prev, fullName: user.fullName, email: user.email}));
    }
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Espace</h1>
            <p className="mt-1 text-sm text-gray-500">Gérez vos informations et consultez vos activités.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                {user.fullName.charAt(0)}
             </div>
             <div>
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">Membre depuis Octobre 2023</p>
                    {user.role === 'WORKER' && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold">STAFF</span>}
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <nav className="flex flex-col p-2 space-y-1">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Car size={18} /> Vue d'ensemble
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <User size={18} /> Mon Profil
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Shield size={18} /> Sécurité
                </button>
                <div className="border-t border-gray-100 my-2"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={18} /> Déconnexion
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Car size={24} /></div>
                      <div>
                        <p className="text-sm text-gray-500">Locations actives</p>
                        <p className="text-2xl font-bold text-gray-900">1</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg text-green-600"><CreditCard size={24} /></div>
                      <div>
                        <p className="text-sm text-gray-500">Dépenses ce mois</p>
                        <p className="text-2xl font-bold text-gray-900">475 €</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg text-purple-600"><Settings size={24} /></div>
                      <div>
                        <p className="text-sm text-gray-500">Total Locations</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-gray-900">Dernière activité</h3>
                     <Link to="/rentals" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Voir tout</Link>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-green-900">Tesla Model 3</p>
                        <p className="text-sm text-green-700">Du 10 Déc au 15 Déc 2024</p>
                      </div>
                      <span className="text-sm font-bold text-green-800">En cours</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Informations Personnelles</h3>
                  <button 
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {isEditing ? <><Save size={16}/> Enregistrer</> : <><Settings size={16}/> Modifier</>}
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                      <input 
                        type="text" 
                        name="fullName"
                        disabled={!isEditing}
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className={`w-full rounded-lg border p-2.5 ${isEditing ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50 border-transparent text-gray-500'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        disabled={!isEditing}
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className={`w-full rounded-lg border p-2.5 ${isEditing ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50 border-transparent text-gray-500'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        disabled={!isEditing}
                        value={profileData.phoneNumber}
                        onChange={handleProfileChange}
                        className={`w-full rounded-lg border p-2.5 ${isEditing ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50 border-transparent text-gray-500'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Permis</label>
                      <input 
                        type="text" 
                        name="licenseNumber"
                        disabled={!isEditing}
                        value={profileData.licenseNumber}
                        onChange={handleProfileChange}
                        className={`w-full rounded-lg border p-2.5 ${isEditing ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50 border-transparent text-gray-500'}`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Postale</label>
                      <input 
                        type="text" 
                        name="address"
                        disabled={!isEditing}
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className={`w-full rounded-lg border p-2.5 ${isEditing ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50 border-transparent text-gray-500'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Mot de passe et Sécurité</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Mot de passe</p>
                      <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">Modifier</button>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                      <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
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