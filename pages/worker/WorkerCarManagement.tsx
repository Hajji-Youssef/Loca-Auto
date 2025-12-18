
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Product } from '../../types';
import { Gauge, CheckCircle2, AlertTriangle, Search, Wrench, X, AlertCircle } from 'lucide-react';

const WorkerCarManagement: React.FC = () => {
    const [fleet, setFleet] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Flow State
    const [selectedCar, setSelectedCar] = useState<Product | null>(null);
    const [flowStep, setFlowStep] = useState<'IDLE' | 'REASON' | 'CONFIRM'>('IDLE');
    const [unavailabilityReason, setUnavailabilityReason] = useState('');

    useEffect(() => {
        loadFleet();
    }, []);

    const loadFleet = async () => {
        setLoading(true);
        const products = await ApiService.getAllProducts();
        setFleet(products);
        setLoading(false);
    };

    const initiateToggle = (car: Product) => {
        if (car.available) {
            // Vers Indisponible -> Flow modal
            setSelectedCar(car);
            setUnavailabilityReason('');
            setFlowStep('REASON');
        } else {
            // Vers Disponible -> Confirmation simple
            if(window.confirm(`Confirmez-vous que le véhicule ${car.title} est prêt et disponible ? Cela supprimera la mission de maintenance.`)) {
                executeToggle(car, true);
            }
        }
    };

    const handleReasonSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!unavailabilityReason.trim()) return;
        setFlowStep('CONFIRM'); 
    };

    const executeToggle = async (car: Product, newStatus: boolean, reason?: string) => {
        // Optimistic UI update
        const updatedFleet = fleet.map(p => p.id === car.id ? { 
            ...p, 
            available: newStatus,
            // Si on rend dispo, on vide la mission (logic côté serveur simulé aussi pour l'UI immédiate)
            currentMission: newStatus ? "" : ((reason) ? "MAINTENANCE : " + reason : p.currentMission) 
        } : p);
        setFleet(updatedFleet);

        try {
            await ApiService.updateProductStatus(car.id, newStatus, reason);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la mise à jour du statut");
            loadFleet(); 
        }
        
        // Reset flow
        setSelectedCar(null);
        setFlowStep('IDLE');
    };

    const filteredFleet = fleet.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Gauge className="text-blue-600"/> État des Véhicules
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                    <input 
                        type="text" 
                        placeholder="Rechercher un véhicule..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500"
                    />
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
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut Actuel / Raison</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action Disponibilité</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFleet.map(car => (
                                <tr key={car.id} className={`hover:bg-slate-50/50 transition-colors ${!car.available ? 'bg-orange-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                                                <img src={car.imageUrl} className={`h-full w-full object-cover ${!car.available ? 'grayscale' : ''}`} alt="" />
                                                {!car.available && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Wrench className="text-white drop-shadow-md" size={16}/></div>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{car.title}</div>
                                                <div className="text-xs text-slate-500">#{car.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{car.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${car.usageCategory === 'FOR_RENT' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {car.usageCategory === 'FOR_RENT' ? 'Location' : 'Vente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {car.available ? (
                                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                                <CheckCircle2 size={18}/> Disponible
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                                                    <AlertTriangle size={18}/> Indisponible
                                                </div>
                                                {car.currentMission && car.currentMission.includes("MAINTENANCE") && (
                                                    <p className="text-xs text-slate-500 mt-1 italic pl-6">{car.currentMission}</p>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => initiateToggle(car)}
                                            className={`
                                                relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                                ${car.available ? 'bg-green-500' : 'bg-gray-300'}
                                            `}
                                            title={car.available ? "Mettre en maintenance" : "Rendre disponible"}
                                        >
                                            <span className="sr-only">Changer disponibilité</span>
                                            <span
                                                className={`
                                                    inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow
                                                    ${car.available ? 'translate-x-6' : 'translate-x-1'}
                                                `}
                                            />
                                        </button>
                                        <span className="ml-2 text-xs text-slate-500 font-medium">
                                            {car.available ? 'Actif' : 'Bloqué'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL ETAPE 1 : RAISON */}
            {flowStep === 'REASON' && selectedCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Indisponibilité : {selectedCar.title}</h3>
                            <button onClick={() => { setFlowStep('IDLE'); setSelectedCar(null); }}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                        </div>
                        <form onSubmit={handleReasonSubmit} className="p-6 space-y-4">
                            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-sm text-orange-800 flex items-start gap-2">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0"/>
                                <p>Ce véhicule n'apparaîtra plus comme disponible pour les clients. Veuillez indiquer la raison (interne).</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Raison de l'indisponibilité</label>
                                <textarea 
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                    placeholder="Ex: Panne moteur, Contrôle technique, Nettoyage..."
                                    value={unavailabilityReason}
                                    onChange={(e) => setUnavailabilityReason(e.target.value)}
                                    required
                                    autoFocus
                                ></textarea>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                                    Suivant
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ETAPE 2 : CONFIRMATION */}
            {flowStep === 'CONFIRM' && selectedCar && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} className="text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Confirmer l'indisponibilité ?</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Le véhicule <span className="font-bold">{selectedCar.title}</span> sera marqué comme indisponible pour la raison suivante :
                            </p>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 italic mb-6">
                                "{unavailabilityReason}"
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setFlowStep('REASON')} 
                                    className="flex-1 py-2.5 border border-gray-300 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Modifier
                                </button>
                                <button 
                                    onClick={() => executeToggle(selectedCar, false, unavailabilityReason)}
                                    className="flex-1 py-2.5 bg-red-600 rounded-lg text-white font-bold hover:bg-red-700 transition-colors"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerCarManagement;
