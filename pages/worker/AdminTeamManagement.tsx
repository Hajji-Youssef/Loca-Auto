
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Worker, WorkerSession } from '../../types';
import { Clock, UserCheck, Search, Plus, Edit2, Trash2, CalendarDays, X, Save, Banknote, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminTeamManagement: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [sessions, setSessions] = useState<WorkerSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const [formData, setFormData] = useState<Partial<Worker>>({ fullName: '', email: '', role: 'WORKER', salary: 0 });

    useEffect(() => {
        loadData();
        const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [workersData, sessionsData] = await Promise.all([
                ApiService.getAllWorkers(),
                ApiService.getWorkerSessions()
            ]);
            setWorkers(workersData);
            setSessions(sessionsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = (session?: WorkerSession) => {
        if (!session) return '-';
        const loginTime = new Date(session.loginTime).getTime();
        const endTime = session.logoutTime ? new Date(session.logoutTime).getTime() : currentTime;
        const diffMs = endTime - loginTime;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const handleCreate = () => {
        setEditingWorker(null);
        setFormData({ fullName: '', email: '', role: 'WORKER', salary: 2000 });
        setIsModalOpen(true);
    };

    const handleEdit = (worker: Worker) => {
        setEditingWorker(worker);
        setFormData(worker);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if(window.confirm("🗑️ Supprimer définitivement cet employé ? Cette action est irréversible.")) {
            setLoading(true);
            await ApiService.deleteWorker(id);
            await loadData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            // On simule un petit délai pour le feeling "Pro"
            await new Promise(resolve => setTimeout(resolve, 600));
            await ApiService.saveWorker({ ...formData, id: editingWorker?.id });
            setIsModalOpen(false);
            await loadData();
        } catch(e) { 
            console.error(e); 
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setIsSaving(false);
        }
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
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                    <UserCheck className="text-blue-600" size={28}/> Gestion Équipe & Salaires
                </h2>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-3 py-2 border-2 border-gray-100 rounded-xl text-sm w-full focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                        />
                    </div>
                    <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                        <Plus size={18}/> Ajouter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employé</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Salaire Mensuel</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dernière Connexion</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temps de Travail</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-bold animate-pulse tracking-widest uppercase text-xs">Synchronisation de la base...</td></tr>
                            ) : filteredWorkers.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-400 italic">Aucun employé trouvé.</td></tr>
                            ) : filteredWorkers.map(worker => {
                                const session = sessions.find(s => s.workerId === worker.id);
                                return (
                                    <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-sm shadow-inner group-hover:scale-110 transition-transform">
                                                    {worker.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 text-sm tracking-tight">{worker.fullName}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{worker.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(worker.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 font-black text-slate-900 text-base">
                                                <Banknote size={16} className="text-emerald-500" />
                                                {worker.salary.toLocaleString()} €
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-slate-600">
                                            {session ? new Date(session.loginTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : '-'}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full w-fit border border-gray-200 shadow-inner">
                                                <Clock size={14} className="text-slate-400"/> {calculateDuration(session)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/workspace/admin/team/${worker.id}`} className="p-2.5 bg-white border border-gray-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all hover:shadow-sm" title="Historique">
                                                    <CalendarDays size={18}/>
                                                </Link>
                                                <button onClick={() => handleEdit(worker)} className="p-2.5 bg-white border border-gray-100 rounded-xl text-slate-400 hover:text-orange-600 hover:border-orange-200 transition-all hover:shadow-sm" title="Éditer">
                                                    <Edit2 size={18}/>
                                                </button>
                                                <button onClick={() => handleDelete(worker.id)} className="p-2.5 bg-white border border-gray-100 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-200 transition-all hover:shadow-sm" title="Supprimer">
                                                    <Trash2 size={18}/>
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

            {/* Modal CRUD avec UI Ultra-Net */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-slate-900 text-xl tracking-tight">{editingWorker ? 'Édition Profil' : 'Nouveau Collaborateur'}</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Données confidentielles</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-white text-slate-400 hover:text-slate-900 rounded-full shadow-sm transition-all"><X size={24}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Identité Complète</label>
                                <input type="text" className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all shadow-inner" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required placeholder="Prénom Nom" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Adresse Email Pro</label>
                                <input type="email" className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all shadow-inner" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="email@locaauto.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Rôle Système</label>
                                    <select className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all shadow-inner appearance-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                                        <option value="WORKER">AGENT FLOTTE</option>
                                        <option value="ADMIN">ADMINISTRATEUR</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Salaire (€)</label>
                                    <input type="number" className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all shadow-inner" value={formData.salary} onChange={e => setFormData({...formData, salary: Number(e.target.value)})} required />
                                </div>
                            </div>
                            <button type="submit" disabled={isSaving} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[1.5rem] flex justify-center items-center gap-3 mt-4 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50">
                                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                                {/* Fix: Use 'editingWorker' instead of undefined 'editingProduct' */}
                                {isSaving ? "TRAITEMENT..." : (editingWorker ? "METTRE À JOUR" : "ENREGISTRER L'EMPLOYÉ")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeamManagement;
