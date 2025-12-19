
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Rental, Product } from '../../types';
import { ChevronLeft, ChevronRight, Plus, Edit3, Trash2, X, Save, Loader2 } from 'lucide-react';
import { wsService } from '../../services/websocket';
import { useAuth } from '../../context/AuthContext';

const AgencyCalendar: React.FC = () => {
    const { user } = useAuth();
    const isStaff = user?.role === 'ADMIN' || user?.role === 'WORKER';
    
    const [viewDate, setViewDate] = useState(new Date());
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [cars, setCars] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [vehicleSearch, setVehicleSearch] = useState('');
    const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
    const [formData, setFormData] = useState({
        carId: 0,
        clientName: '',
        startDate: '',
        endDate: '',
        price: 0
    });
    const [formError, setFormError] = useState('');

    const DAYS_TO_SHOW = 30;
    const DAY_WIDTH = 50; 

    useEffect(() => {
        loadData();
        wsService.subscribe('calendar_refresh_needed', loadData);
        return () => wsService.unsubscribe('calendar_refresh_needed', loadData);
    }, [viewDate]); 

    const loadData = async () => {
        try {
            const [fetchedCars, fetchedRentals] = await Promise.all([
                ApiService.getAllProducts(),
                ApiService.getAllRentalsForCalendar("", "")
            ]);
            setCars(fetchedCars.filter(c => c.usageCategory === 'FOR_RENT'));
            setRentals(fetchedRentals);
        } catch (e) {
            console.error(e);
        }
    };

    const shiftView = (days: number) => {
        const newDate = new Date(viewDate);
        newDate.setDate(newDate.getDate() + days);
        setViewDate(newDate);
    };

    const dateColumns = [];
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
        const d = new Date(viewDate);
        d.setDate(d.getDate() + i);
        dateColumns.push(d);
    }

    const getRentalStyle = (startStr: string, endStr: string) => {
        const start = new Date(startStr);
        const end = new Date(endStr);
        const viewStart = dateColumns[0];
        const diffStart = Math.ceil((start.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24));
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return { left: `${diffStart * DAY_WIDTH}px`, width: `${duration * DAY_WIDTH}px` };
    };

    const handleCreateClick = () => {
        setFormData({
            carId: cars[0]?.id || 0,
            clientName: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            price: 150
        });
        setFormError('');
        setModalMode('CREATE');
        setIsModalOpen(true);
    };

    const handleEditClick = () => {
        if (!selectedRentalId) return;
        const rental = rentals.find(r => String(r.id) === String(selectedRentalId));
        if (!rental) return;
        setFormData({
            carId: rental.productId,
            clientName: rental.clientName || '',
            startDate: rental.startDate,
            endDate: rental.endDate,
            price: rental.totalPrice
        });
        setFormError('');
        setModalMode('EDIT');
        setIsModalOpen(true);
    };

    const handleDeleteClick = async () => {
        if (!selectedRentalId) return;
        
        if(confirm("Confirmer la suppression définitive de cette réservation ?")) {
            setLoading(true);
            const idToDelete = selectedRentalId;
            try {
                // Appel API
                await ApiService.cancelRental(idToDelete);
                
                // MISE À JOUR OPTIMISTE DU STATE (Pour réactivité immédiate)
                setRentals(prev => prev.filter(r => String(r.id) !== String(idToDelete)));
                setSelectedRentalId(null);
                
                // Refresh data en arrière-plan
                await loadData();
            } catch (err) {
                alert("Erreur lors de la suppression.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (modalMode === 'CREATE') {
                await ApiService.createRental({
                    productId: Number(formData.carId),
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    totalPrice: Number(formData.price),
                    clientName: formData.clientName
                });
            } else if (modalMode === 'EDIT' && selectedRentalId) {
                await ApiService.updateRental(selectedRentalId, {
                    productId: Number(formData.carId),
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    totalPrice: Number(formData.price),
                    clientName: formData.clientName
                });
            }
            setIsModalOpen(false);
            setSelectedRentalId(null);
            await loadData();
        } catch (err) {
            setFormError("Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Planning de l'Agence</h2>
                    {isStaff && (
                        <div className="flex gap-2 ml-4">
                            <button onClick={handleCreateClick} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                <Plus size={18} /> Ajouter
                            </button>
                            <button onClick={handleEditClick} disabled={!selectedRentalId} className={`flex items-center gap-2 px-5 py-2.5 border-2 text-sm font-black rounded-2xl transition-all ${selectedRentalId ? 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'}`}>
                                <Edit3 size={18} /> Modifier
                            </button>
                            <button onClick={handleDeleteClick} disabled={!selectedRentalId || loading} className={`flex items-center gap-2 px-5 py-2.5 border-2 text-sm font-black rounded-2xl transition-all ${selectedRentalId ? 'bg-white border-red-500 text-red-500 hover:bg-red-50 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'}`}>
                                {loading && selectedRentalId ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} Supprimer
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Rechercher..." value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="pl-5 pr-5 py-2.5 text-sm border-2 border-gray-100 rounded-2xl focus:border-blue-600 outline-none w-64 font-bold text-slate-700 shadow-sm" />
                    <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-gray-100 shadow-sm">
                        <button onClick={() => shiftView(-7)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ChevronLeft size={20}/></button>
                        <span className="px-3 font-black text-slate-700 text-sm min-w-[140px] text-center capitalize">{viewDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => shiftView(7)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ChevronRight size={20}/></button>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white border-2 border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm relative z-0">
                <div className="flex border-b border-gray-100 bg-slate-50/50">
                    <div className="w-48 flex-shrink-0 p-5 font-black text-slate-400 border-r border-gray-100 sticky left-0 bg-slate-50 z-10 text-[10px] uppercase tracking-widest">Flotte</div>
                    <div className="flex-1 overflow-hidden relative">
                        <div className="flex" style={{ width: DAYS_TO_SHOW * DAY_WIDTH }}>
                            {dateColumns.map((date, i) => (
                                <div key={i} className={`flex-shrink-0 border-r border-gray-100 text-center py-3 ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-slate-100/50' : ''}`} style={{ width: DAY_WIDTH }}>
                                    <div className="uppercase text-[9px] font-black text-slate-400">{date.toLocaleString('fr-FR', { weekday: 'short' }).replace('.', '')}</div>
                                    <div className="font-black text-slate-900 text-sm">{date.getDate()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar" onClick={() => setSelectedRentalId(null)}>
                    {cars.filter(c => c.title.toLowerCase().includes(vehicleSearch.toLowerCase())).map(car => (
                        <div key={car.id} className="flex border-b border-gray-100 hover:bg-slate-50/20 transition-colors h-16 group">
                            <div className="w-48 flex-shrink-0 p-3 border-r border-gray-100 flex items-center gap-3 sticky left-0 bg-white group-hover:bg-slate-50/20 z-10">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={car.imageUrl} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-black text-[11px] text-slate-800 truncate">{car.title}</div>
                                    <div className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">ID: {car.id}</div>
                                </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden">
                                <div className="flex h-full absolute top-0 left-0" style={{ width: DAYS_TO_SHOW * DAY_WIDTH }}>
                                    {dateColumns.map((date, i) => <div key={i} className={`h-full border-r border-gray-100 flex-shrink-0 ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-slate-50/30' : ''}`} style={{ width: DAY_WIDTH }}></div>)}
                                    {rentals.filter(r => String(r.productId) === String(car.id) && r.status === 'ACTIVE').map(rental => (
                                        <div 
                                            key={rental.id} 
                                            className={`absolute top-2 bottom-2 rounded-xl shadow-sm cursor-pointer z-0 overflow-hidden px-3 flex flex-col justify-center transition-all ${String(selectedRentalId) === String(rental.id) ? 'bg-blue-600 ring-4 ring-blue-900/10 z-20 scale-[1.02]' : 'bg-blue-500 hover:bg-blue-600'}`} 
                                            style={getRentalStyle(rental.startDate, rental.endDate)}
                                            onClick={(e) => { e.stopPropagation(); setSelectedRentalId(Number(rental.id)); }}
                                        >
                                            <div className="text-[10px] font-black text-white truncate">{rental.clientName || 'Réservation'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL AJOUT/MODIF - DESIGN HAUT CONTRASTE */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-slate-900 text-2xl tracking-tight">{modalMode === 'CREATE' ? 'Nouveau dossier' : 'Modifier dossier'}</h3>
                                <p className="text-slate-400 text-sm font-medium mt-1">Saisissez les informations de location.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all shadow-sm"><X size={24}/></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-10 space-y-6">
                            {formError && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black border border-red-100 mb-6">{formError}</div>}
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Véhicule</label>
                                    <select 
                                        className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-base font-black text-slate-900 outline-none transition-all shadow-sm" 
                                        value={formData.carId} 
                                        onChange={e => setFormData({...formData, carId: Number(e.target.value)})}
                                    >
                                        {cars.map(c => <option key={c.id} value={c.id}>{c.title} (ID: {c.id})</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Nom du client</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-base font-black text-slate-900 outline-none transition-all shadow-sm" 
                                        placeholder="Ex: Jean Martin" 
                                        value={formData.clientName} 
                                        onChange={e => setFormData({...formData, clientName: e.target.value})} 
                                        required 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Date Début</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-base font-black text-slate-900 outline-none transition-all shadow-sm" 
                                            value={formData.startDate} 
                                            onChange={e => setFormData({...formData, startDate: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Date Retour</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-base font-black text-slate-900 outline-none transition-all shadow-sm" 
                                            value={formData.endDate} 
                                            onChange={e => setFormData({...formData, endDate: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Montant Total (€)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 text-base font-black text-slate-900 outline-none transition-all shadow-sm" 
                                        value={formData.price} 
                                        onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                                        required 
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[1.5rem] flex justify-center items-center gap-3 mt-6 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={20} />} Enregistrer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgencyCalendar;
