
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Product } from '../../types';
import { Wrench, Tag, Save, X, Lock, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FleetManagement: React.FC = () => {
    const { user } = useAuth();
    const [fleet, setFleet] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editMission, setEditMission] = useState('');
    const [editStartDate, setEditStartDate] = useState('');
    const [editEndDate, setEditEndDate] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'FOR_RENT' | 'FOR_SALE'>('ALL');
    const [isSaving, setIsSaving] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState<number | null>(null);

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => { loadFleet(); }, []);

    const loadFleet = async () => {
        setLoading(true);
        const products = await ApiService.getAllProducts();
        setFleet(products);
        setLoading(false);
    };

    const startEditing = (car: Product) => {
        setEditingId(car.id);
        setEditMission(car.currentMission || '');
        setEditStartDate(car.missionStartDate || '');
        setEditEndDate(car.missionEndDate || '');
    };

    const saveMission = async (carId: number) => {
        setIsSaving(true);
        setTimeout(async () => {
            const updatedFleet = fleet.map(c => c.id === carId ? { ...c, currentMission: editMission, missionStartDate: editStartDate, missionEndDate: editEndDate, assignedWorker: c.assignedWorker || user?.fullName } : c);
            setFleet(updatedFleet);
            await ApiService.updateProductMission(carId, editMission, user?.fullName || "Agent", editStartDate, editEndDate);
            setIsSaving(false);
            setEditingId(null);
            setSaveFeedback(carId);
            setTimeout(() => setSaveFeedback(null), 3000);
        }, 800);
    };

    const filteredFleet = fleet.filter(c => filter === 'ALL' || c.usageCategory === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Missions de Flotte {isAdmin && <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1"><ShieldCheck size={10}/> ADMIN OMNIPOTENT</span>}</h2>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                    <button onClick={() => setFilter('ALL')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'ALL' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Tout</button>
                    <button onClick={() => setFilter('FOR_RENT')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'FOR_RENT' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>Location</button>
                    <button onClick={() => setFilter('FOR_SALE')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'FOR_SALE' ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:text-slate-700'}`}>Vente</button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Véhicule</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Mission Actuelle</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates Mission</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFleet.map(car => (
                                <tr key={car.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-16 bg-gray-100 rounded-md overflow-hidden relative">
                                                <img src={car.imageUrl} className="h-full w-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{car.title}</div>
                                                <div className="text-[10px] text-slate-400">ID: #{car.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {car.usageCategory === 'FOR_RENT' ? <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">LOCATION</span> : <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">VENTE</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === car.id ? (
                                            <input type="text" autoFocus value={editMission} onChange={(e) => setEditMission(e.target.value)} className="w-full text-sm border-gray-300 rounded-md px-2 py-1 border" />
                                        ) : (
                                            <p className="text-sm text-slate-700 truncate max-w-xs">{car.currentMission || <span className="text-slate-300 italic">Aucune mission</span>}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {editingId === car.id ? (
                                            <div className="flex flex-col gap-1"><input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} className="text-[10px] border rounded px-1" /><input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} className="text-[10px] border rounded px-1" /></div>
                                        ) : (
                                            car.missionStartDate ? `${new Date(car.missionStartDate).toLocaleDateString()} ➔ ${car.missionEndDate ? new Date(car.missionEndDate).toLocaleDateString() : '?'}` : '-'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {car.assignedWorker ? <span className={car.assignedWorker === user?.fullName ? "text-blue-600" : "text-slate-600"}>{car.assignedWorker}</span> : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === car.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => saveMission(car.id)} disabled={isSaving} className="p-1.5 bg-blue-600 text-white rounded-md shadow-sm">{isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}</button>
                                                <button onClick={() => setEditingId(null)} className="p-1.5 bg-white border border-gray-200 text-slate-400 rounded-md"><X size={16}/></button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end items-center gap-2">
                                                {saveFeedback === car.id && <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse"><CheckCircle size={10}/> OK</span>}
                                                {/* ADMIN PEUT TOUT GERER, WORKER SEULEMENT LES SIENS */}
                                                {(isAdmin || car.assignedWorker === user?.fullName) ? (
                                                    <button onClick={() => startEditing(car)} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"><Wrench size={14} /> GÉRER</button>
                                                ) : <Lock size={14} className="text-slate-300"/>}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FleetManagement;
