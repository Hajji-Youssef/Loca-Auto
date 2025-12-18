
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Worker, WorkerSession } from '../../types';
import { Clock, UserCheck, Search, Plus, Edit2, Trash2, CalendarDays, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminTeamManagement: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [sessions, setSessions] = useState<WorkerSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const [formData, setFormData] = useState<Partial<Worker>>({ fullName: '', email: '', role: 'WORKER' });

    useEffect(() => {
        loadData();
        // Update current time every minute for duration calculation
        const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [workersData, sessionsData] = await Promise.all([
                ApiService.getAllWorkers(),
                ApiService.getWorkerSessions() // Gets latest session per worker
            ]);
            setWorkers(workersData);
            setSessions(sessionsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC CALCUL DURÉE ---
    const calculateDuration = (session?: WorkerSession) => {
        if (!session) return '-';
        
        const loginTime = new Date(session.loginTime).getTime();
        // Si logout existe, on l'utilise, sinon on utilise l'heure actuelle (System)
        const endTime = session.logoutTime ? new Date(session.logoutTime).getTime() : currentTime;
        
        const diffMs = endTime - loginTime;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    // --- CRUD ---
    const handleCreate = () => {
        setEditingWorker(null);
        setFormData({ fullName: '', email: '', role: 'WORKER' });
        setIsModalOpen(true);
    };

    const handleEdit = (worker: Worker) => {
        setEditingWorker(worker);
        setFormData(worker);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if(confirm("Confirmer la suppression définitive de cet employé ?")) {
            await ApiService.deleteWorker(id);
            loadData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!confirm("Voulez-vous enregistrer ces informations ?")) return;

        try {
            await ApiService.saveWorker({ ...formData, id: editingWorker?.id });
            setIsModalOpen(false);
            loadData();
        } catch(e) { console.error(e); }
    };

    const filteredWorkers = workers.filter(w => w.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ONLINE': return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700"><div className="w-2 h-2 rounded-full bg-green-500"></div> Actif</span>;
            case 'BUSY': return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Occupé</span>;
            default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <UserCheck className="text-blue-600"/> Gestion Équipe & Pointages
                </h2>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors">
                        <Plus size={18}/> Ajouter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employé</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut Actuel</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dernier Login (Auj)</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dernier Logout (Auj)</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Durée Session</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-4 text-center text-slate-400">Chargement...</td></tr>
                            ) : filteredWorkers.map(worker => {
                                const session = sessions.find(s => s.workerId === worker.id);
                                return (
                                    <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                    {worker.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{worker.fullName}</div>
                                                    <div className="text-[10px] text-slate-400">{worker.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(worker.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {session ? new Date(session.loginTime).toLocaleTimeString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {session?.logoutTime ? new Date(session.logoutTime).toLocaleTimeString() : <span className="text-green-600 text-xs font-medium">En cours</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded w-fit">
                                                <Clock size={14} className="text-slate-400"/> {calculateDuration(session)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/workspace/admin/team/${worker.id}`} className="bg-white border border-gray-200 p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors" title="Voir Historique Complet">
                                                    <CalendarDays size={16}/>
                                                </Link>
                                                <button onClick={() => handleEdit(worker)} className="bg-white border border-gray-200 p-1.5 rounded-md text-slate-600 hover:text-orange-600 hover:border-orange-200 transition-colors" title="Modifier">
                                                    <Edit2 size={16}/>
                                                </button>
                                                <button onClick={() => handleDelete(worker.id)} className="bg-white border border-gray-200 p-1.5 rounded-md text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors" title="Supprimer">
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">{editingWorker ? 'Modifier Employé' : 'Nouvel Employé'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom Complet</label>
                                <input type="text" className="w-full border rounded-lg p-2 text-sm" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                <input type="email" className="w-full border rounded-lg p-2 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rôle</label>
                                <select className="w-full border rounded-lg p-2 text-sm" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                                    <option value="WORKER">Employé (Worker)</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
                                <Save size={18}/> Enregistrer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeamManagement;
