
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { WorkerSession } from '../../types';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const WorkerHistory: React.FC = () => {
    const { workerId } = useParams();
    const [sessions, setSessions] = useState<WorkerSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'WEEK' | 'MONTH' | 'ALL'>('ALL');

    useEffect(() => {
        loadHistory();
    }, [workerId]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getWorkerSessions(Number(workerId));
            setSessions(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = (login: string, logout?: string) => {
        const start = new Date(login).getTime();
        const end = logout ? new Date(logout).getTime() : Date.now();
        const diff = end - start;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${h}h ${m}m`;
    };

    const filteredSessions = sessions.filter(s => {
        if (filterType === 'ALL') return true;
        const date = new Date(s.date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (filterType === 'WEEK') return diffDays <= 7;
        if (filterType === 'MONTH') return diffDays <= 30;
        return true;
    });

    const workerName = sessions.length > 0 ? sessions[0].workerName : "Employé";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/workspace/admin/team" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-600 transition-colors">
                    <ArrowLeft size={20}/>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Historique de Connexion</h2>
                    <p className="text-sm text-slate-500">Détails pour : <span className="font-bold text-blue-600">{workerName}</span></p>
                </div>
                <div className="ml-auto flex bg-white p-1 rounded-lg border border-gray-200">
                    <button onClick={() => setFilterType('WEEK')} className={`px-3 py-1 text-xs font-bold rounded ${filterType === 'WEEK' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>Semaine</button>
                    <button onClick={() => setFilterType('MONTH')} className={`px-3 py-1 text-xs font-bold rounded ${filterType === 'MONTH' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>Mois</button>
                    <button onClick={() => setFilterType('ALL')} className={`px-3 py-1 text-xs font-bold rounded ${filterType === 'ALL' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>Tout</button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Arrivée (Login)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Départ (Logout)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Durée Totale</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut Fin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                             <tr><td colSpan={5} className="p-8 text-center text-slate-400">Chargement de l'historique...</td></tr>
                        ) : filteredSessions.length === 0 ? (
                             <tr><td colSpan={5} className="p-8 text-center text-slate-400">Aucune donnée sur cette période.</td></tr>
                        ) : filteredSessions.map(session => (
                            <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400"/>
                                    <span className="font-medium text-slate-700">{session.date}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {new Date(session.loginTime).toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {session.logoutTime ? new Date(session.logoutTime).toLocaleTimeString() : <span className="text-green-600 font-bold text-xs">En cours</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded w-fit">
                                        <Clock size={14} className="text-slate-400"/> {calculateDuration(session.loginTime, session.logoutTime)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {session.logoutTime ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Terminé</span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Actif</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkerHistory;
