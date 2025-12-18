import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Truck, Users, MessageSquare, LogOut, Bell, Menu } from 'lucide-react';
import FleetManagement from './FleetManagement';
import AgencyCalendar from './AgencyCalendar';
import SharedInbox from './SharedInbox';
import OnlineUserList from './OnlineUserList';
import { wsService } from '../../services/websocket';

const Workspace: React.FC = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState<string[]>([]);
    
    const isActive = (path: string) => location.pathname === `/workspace${path}` || (path === '' && location.pathname === '/workspace');

    useEffect(() => {
        // Notification Real-time
        wsService.subscribe('incoming_message', (msg: any) => {
            if (msg.isSystem) {
                setNotifications(prev => [msg.content, ...prev]);
                // Auto hide after 5s
                setTimeout(() => setNotifications(prev => prev.slice(0, -1)), 5000);
            }
        });
        return () => wsService.unsubscribe('incoming_message', () => {});
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className={`bg-slate-900 text-slate-300 w-64 flex-shrink-0 transition-all duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-20 h-full'}`}>
                <div className="h-16 flex items-center px-6 bg-slate-950 font-bold text-white text-xl tracking-wider">
                    AGENCE<span className="text-blue-500">PRO</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <Link to="/workspace" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800'}`}>
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                        <Link to="/workspace/calendar" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/calendar') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800'}`}>
                            <Calendar size={20} /> Planning Agence
                        </Link>
                        <Link to="/workspace/fleet" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/fleet') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800'}`}>
                            <Truck size={20} /> Gestion Flotte
                        </Link>
                        <Link to="/workspace/inbox" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/inbox') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800'}`}>
                            <MessageSquare size={20} /> Messagerie <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                        </Link>
                    </nav>

                    <div className="mt-8 px-6">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Collègues en ligne</p>
                        <OnlineUserList />
                    </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Agent Connecté</p>
                            <p className="text-xs text-green-400 truncate">● En ligne</p>
                        </div>
                        <Link to="/" className="text-slate-400 hover:text-white"><LogOut size={18} /></Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${!sidebarOpen ? 'ml-0' : ''}`}>
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                            {notifications.length > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>}
                        </div>
                    </div>
                </header>

                {/* Notifications Toast */}
                <div className="fixed top-20 right-4 z-50 space-y-2">
                    {notifications.map((note, idx) => (
                        <div key={idx} className="bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right fade-in">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">{note}</span>
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<DashboardStats />} />
                        <Route path="/calendar" element={<AgencyCalendar />} />
                        <Route path="/fleet" element={<FleetManagement />} />
                        <Route path="/inbox" element={<SharedInbox />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

// Composant interne pour la page d'accueil du dashboard
const DashboardStats = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Réservations à traiter</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">12</p>
                <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[45%]"></div></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Véhicules en Mission</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">4</p>
                 <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[20%]"></div></div>
            </div>
            {/* Carte Chiffre d'Affaires supprimée pour les workers */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-sm border border-slate-700 text-white flex flex-col justify-center">
                 <p className="text-slate-300 text-sm mb-2">Statut Agence</p>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-bold text-lg">Opérationnel</span>
                 </div>
            </div>
        </div>
    </div>
);

export default Workspace;