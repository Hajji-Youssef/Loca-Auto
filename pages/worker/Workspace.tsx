
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Truck, Users, MessageSquare, LogOut, Bell, Menu, CarFront, Gauge, ShieldCheck, ShoppingBag } from 'lucide-react';
import FleetManagement from './FleetManagement';
import AgencyCalendar from './AgencyCalendar';
import SharedInbox from './SharedInbox';
import OnlineUserList from './OnlineUserList';
import AdminTeamManagement from './AdminTeamManagement';
import AdminCarManagement from './AdminCarManagement';
import WorkerCarManagement from './WorkerCarManagement';
import WorkerHistory from './WorkerHistory';
import SalesHistory from './SalesHistory';
import { wsService } from '../../services/websocket';
import { useAuth } from '../../context/AuthContext';

const Workspace: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState<string[]>([]);
    
    const isActive = (path: string) => location.pathname === `/workspace${path}` || (path === '' && location.pathname === '/workspace');
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        wsService.subscribe('incoming_message', (msg: any) => {
            if (msg.isSystem) {
                setNotifications(prev => [msg.content, ...prev]);
                setTimeout(() => setNotifications(prev => prev.slice(0, -1)), 5000);
            }
        });
        return () => wsService.unsubscribe('incoming_message', () => {});
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className={`bg-[#0f172a] text-slate-300 w-72 flex-shrink-0 transition-all duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-50 h-full'}`}>
                <div className="h-20 flex items-center px-8 bg-[#020617] font-black text-white text-2xl tracking-tighter">
                    LOCA<span className="text-blue-500">AUTO</span>
                    <span className="ml-2 bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">PRO</span>
                </div>

                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="space-y-1.5 px-4">
                        <Link to="/workspace" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800/50'}`}>
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                        
                        <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Opérations</div>
                        <Link to="/workspace/calendar" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/calendar') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800/50'}`}>
                            <Calendar size={20} /> Planning Global
                        </Link>
                        
                        <Link to="/workspace/fleet" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/fleet') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800/50'}`}>
                            <Truck size={20} /> Missions Flotte
                        </Link>

                        <Link to="/workspace/sales-history" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/sales-history') ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'hover:bg-slate-800/50'}`}>
                            <ShoppingBag size={20} /> Historique Ventes
                        </Link>

                        {!isAdmin && (
                            <Link to="/workspace/cars" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/cars') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800/50'}`}>
                                <Gauge size={20} /> État des Voitures
                            </Link>
                        )}
                        
                        {/* Administration : Visible SEULEMENT pour Admin */}
                        {isAdmin && (
                            <>
                                <div className="pt-8 pb-2 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Administration</div>
                                <Link to="/workspace/admin/team" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/admin/team') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800/50'}`}>
                                    <Users size={20} /> Gestion Équipe
                                </Link>
                                <Link to="/workspace/admin/cars" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/admin/cars') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800/50'}`}>
                                    <CarFront size={20} /> Catalogue & Prix
                                </Link>
                            </>
                        )}

                        <div className="pt-8 pb-2 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Communication</div>
                        <Link to="/workspace/inbox" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive('/inbox') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800/50'}`}>
                            <MessageSquare size={20} /> Messagerie Agence
                        </Link>
                    </nav>

                    <div className="mt-10 px-8">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-5">Collègues actifs</p>
                        <OnlineUserList />
                    </div>
                </div>

                <div className="p-6 bg-[#020617] border-t border-slate-800/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
                            {user?.fullName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate">{user?.fullName}</p>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{user?.role}</p>
                        </div>
                        <Link to="/" className="text-slate-500 hover:text-white transition-colors"><LogOut size={20} /></Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col min-w-0 overflow-hidden`}>
                {/* Header Dashboard */}
                <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <Menu size={28} />
                    </button>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aujourd'hui</p>
                            <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-200 mx-2"></div>
                        <div className="relative">
                            <Bell size={24} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                            {notifications.length > 0 && <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-[8px] font-black text-white flex items-center justify-center animate-bounce">{notifications.length}</span>}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 custom-scrollbar bg-[#f8fafc]">
                    <Routes>
                        <Route path="/" element={<DashboardStats user={user} />} />
                        <Route path="/calendar" element={<AgencyCalendar />} />
                        <Route path="/fleet" element={<FleetManagement />} />
                        <Route path="/sales-history" element={<SalesHistory />} />
                        <Route path="/inbox" element={<SharedInbox />} />
                        <Route path="/cars" element={<WorkerCarManagement />} />
                        
                        {isAdmin && (
                            <>
                                <Route path="/admin/team" element={<AdminTeamManagement />} />
                                <Route path="/admin/team/:workerId" element={<WorkerHistory />} />
                                <Route path="/admin/cars" element={<AdminCarManagement />} />
                            </>
                        )}
                    </Routes>
                </div>
            </main>
        </div>
    );
};

const DashboardStats = ({ user }: { user: any }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-end justify-between">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
                <p className="text-slate-500 font-medium mt-1">Gérez efficacement les flux de l'agence.</p>
            </div>
            {user?.role === 'ADMIN' && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 font-black text-xs uppercase tracking-widest">
                    <ShieldCheck size={16} /> Mode Supervision
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.03)] border border-gray-100 group hover:border-orange-200 transition-all">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <Calendar size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Réservations à traiter</p>
                <p className="text-4xl font-black text-slate-900 mt-2">12</p>
                <div className="mt-6 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[45%] rounded-full"></div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.03)] border border-gray-100 group hover:border-blue-200 transition-all">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <Truck size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flotte en mission</p>
                <p className="text-4xl font-black text-slate-900 mt-2">08</p>
                 <div className="mt-6 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[70%] rounded-full"></div>
                </div>
            </div>

            <div className="bg-[#0f172a] p-8 rounded-3xl shadow-xl border border-slate-800 text-white flex flex-col justify-between">
                 <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Statut Agence</p>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                        <span className="font-black text-2xl tracking-tight">Opérationnel</span>
                    </div>
                 </div>
                 <div className="mt-8 flex items-center justify-between">
                    <div className="flex -space-x-3">
                        {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-[#0f172a] flex items-center justify-center font-bold text-xs">AG</div>)}
                    </div>
                    <span className="text-xs font-bold text-slate-500">3 agents actifs</span>
                 </div>
            </div>
        </div>
    </div>
);

export default Workspace;
