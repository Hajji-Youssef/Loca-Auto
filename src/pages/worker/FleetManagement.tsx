import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Product } from '../../types';
import { Wrench, Tag, Save, X, Search, Filter, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FleetManagement: React.FC = () => {
    const { user } = useAuth();
    const [fleet, setFleet] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editMission, setEditMission] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'FOR_RENT' | 'FOR_SALE'>('ALL');

    useEffect(() => {
        loadFleet();
    }, []);

    const loadFleet = async () => {
        setLoading(true);
        const products = await ApiService.getAllProducts();
        setFleet(products);
        setLoading(false);
    };

    const startEditing = (car: Product) => {
        setEditingId(car.id);
        setEditMission(car.currentMission || '');
    };

    const saveMission = async (carId: number) => {
        // Optimistic update
        const updatedFleet = fleet.map(c => c.id === carId ? { ...c, currentMission: editMission } : c);
        setFleet(updatedFleet);
        setEditingId(null);
        await ApiService.updateProductMission(carId, editMission, user?.fullName || "Agent");
    };

    const filteredFleet = fleet.filter(c => filter === 'ALL' || c.usageCategory === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Gestion de Flotte & Missions</h2>
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
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Mission Actuelle / État</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigné à</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFleet.map(car => (
                                <tr key={car.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img src={car.imageUrl} className="h-full w-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{car.title}</div>
                                                <div className="text-xs text-slate-500">ID: #{car.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{car.category}</td>
                                    <td className="px-6 py-4">
                                        {car.usageCategory === 'FOR_RENT' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <Tag size={12}/> Location
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                <Tag size={12}/> Vente
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {car.usageCategory === 'FOR_RENT' ? (
                                            editingId === car.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        autoFocus
                                                        value={editMission} 
                                                        onChange={(e) => setEditMission(e.target.value)}
                                                        className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 px-2 py-1 border"
                                                        placeholder="Détails de la mission..."
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-700 truncate max-w-xs" title={car.currentMission}>
                                                    {car.currentMission || <span className="text-slate-400 italic">Aucune mission en cours</span>}
                                                </p>
                                            )
                                        ) : (
                                            <span className="text-xs text-slate-400">N/A (Véhicule en vente)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {car.assignedWorker ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{car.assignedWorker[0]}</div>
                                                <span className={car.assignedWorker === user?.fullName ? "font-bold text-blue-600" : ""}>{car.assignedWorker}</span>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {car.usageCategory === 'FOR_RENT' && (
                                            editingId === car.id ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => saveMission(car.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"><Save size={16}/></button>
                                                    <button onClick={() => setEditingId(null)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><X size={16}/></button>
                                                </div>
                                            ) : (
                                                // Logique de permission : Seulement si assigné à l'utilisateur connecté
                                                car.assignedWorker === user?.fullName ? (
                                                    <button onClick={() => startEditing(car)} className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                                                        <Wrench size={14} /> Gérer
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300 inline-flex items-center gap-1 text-xs cursor-not-allowed" title="Non assigné à vous">
                                                        <Lock size={12} /> Verrouillé
                                                    </span>
                                                )
                                            )
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