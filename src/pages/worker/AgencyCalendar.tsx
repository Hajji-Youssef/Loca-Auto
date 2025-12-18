import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Rental, Product } from '../../types';
import { ChevronLeft, ChevronRight, AlertCircle, Plus, Edit3, Trash2, ArrowLeftFromLine, CalendarClock, X, Save, CheckCircle2 } from 'lucide-react';
import { wsService } from '../../services/websocket';

// Type pour les demandes entrantes (Mock)
interface IncomingRequest {
    id: number;
    clientName: string;
    carId: number;
    carTitle: string;
    startDate: string;
    endDate: string;
    days: number;
}

const AgencyCalendar: React.FC = () => {
    const [viewDate, setViewDate] = useState(new Date());
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [cars, setCars] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Sélection et Recherche
    const [vehicleSearch, setVehicleSearch] = useState('');
    const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);

    // Gestion du tiroir de demandes
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [previewRental, setPreviewRental] = useState<IncomingRequest | null>(null);

    // Mock Demandes Entrantes (State modifiable)
    // MODIFICATION ICI : Dates décalées à J+6 pour éviter le conflit avec la réservation Mock de J+3
    const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([
        { 
            id: 901, 
            clientName: 'Nouveau Client A', 
            carId: 1, // Tesla
            carTitle: 'Tesla Model 3', 
            startDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0], // J+6
            endDate: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],   // J+9
            days: 3 
        },
        { 
            id: 902, 
            clientName: 'Client VIP', 
            carId: 2, // Peugeot
            carTitle: 'Peugeot 3008', 
            startDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0], // J+15
            endDate: new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],   // J+20
            days: 5 
        },
    ]);

    // État Modal (Création / Edition)
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

    // Paramètres d'affichage
    const DAYS_TO_SHOW = 30;
    const DAY_WIDTH = 50; 

    useEffect(() => {
        loadData();
        wsService.subscribe('calendar_refresh_needed', loadData);
        return () => wsService.unsubscribe('calendar_refresh_needed', loadData);
    }, [viewDate]); 

    const loadData = async () => {
        setLoading(true);
        const startDate = new Date(viewDate);
        startDate.setDate(startDate.getDate() - 5); 
        const endDate = new Date(viewDate);
        endDate.setDate(endDate.getDate() + DAYS_TO_SHOW + 5); 

        try {
            const [fetchedCars, fetchedRentals] = await Promise.all([
                ApiService.getAllProducts(),
                ApiService.getAllRentalsForCalendar(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])
            ]);
            
            setCars(fetchedCars.filter(c => c.usageCategory === 'FOR_RENT'));
            setRentals(fetchedRentals);
        } catch (e) {
            console.error("Erreur chargement calendrier", e);
        } finally {
            setLoading(false);
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

        return {
            left: `${diffStart * DAY_WIDTH}px`,
            width: `${duration * DAY_WIDTH}px`
        };
    };

    // --- LOGIQUE VALIDATION (Chevauchement) ---
    const checkOverlap = (carId: number, start: string, end: string, excludeRentalId?: number) => {
        const s1 = new Date(start).getTime();
        const e1 = new Date(end).getTime();

        return rentals.some(r => {
            if (r.id === excludeRentalId) return false; 
            if (r.productId !== Number(carId)) return false; 
            if (r.status === 'CANCELLED') return false;

            const s2 = new Date(r.startDate).getTime();
            const e2 = new Date(r.endDate).getTime();

            // Chevauchement : (Start1 <= End2) ET (End1 >= Start2)
            return (s1 <= e2 && e1 >= s2);
        });
    };

    // --- ACTIONS DEMANDES ENTRANTES (ACCEPT/REFUSE) ---

    const handleAcceptRequest = async (req: IncomingRequest) => {
        console.log("Tentative acceptation pour :", req);

        // 1. Vérifier si conflit
        if (checkOverlap(req.carId, req.startDate, req.endDate)) {
            alert(`Conflit détecté ! Le véhicule ${req.carTitle} est déjà réservé du ${req.startDate} au ${req.endDate}.`);
            return;
        }

        // 2. Créer la réservation
        try {
            setLoading(true);
            await ApiService.createRental({
                productId: req.carId,
                startDate: req.startDate,
                endDate: req.endDate,
                totalPrice: req.days * 100 // Simulation de prix
            });
            
            // 3. Nettoyer l'interface
            setIncomingRequests(prev => prev.filter(r => r.id !== req.id));
            setPreviewRental(null);
            setIsDrawerOpen(false); // On ferme le tiroir pour voir le résultat sur le calendrier
            
            // 4. Rafraîchir
            await loadData();
            
            // Feedback
            alert(`Réservation acceptée pour ${req.clientName} ! Elle apparait maintenant sur le planning.`);
        } catch (e) {
            console.error(e);
            alert("Erreur technique lors de la création de la réservation.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefuseRequest = (id: number) => {
        if(confirm("Confirmer le refus de cette demande ?")) {
            setIncomingRequests(prev => prev.filter(r => r.id !== id));
            setPreviewRental(null);
        }
    };

    // --- ACTIONS BOUTONS MODAL ---

    const handleCreateClick = () => {
        setFormData({
            carId: cars[0]?.id || 0,
            clientName: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            price: 100
        });
        setFormError('');
        setModalMode('CREATE');
        setIsModalOpen(true);
    };

    const handleEditClick = () => {
        if (!selectedRentalId) return;
        const rental = rentals.find(r => r.id === selectedRentalId);
        if (!rental) return;

        setFormData({
            carId: rental.productId,
            clientName: rental.clientName || 'Client',
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
        if(confirm("Voulez-vous vraiment annuler cette réservation ?")) {
            await ApiService.cancelRental(selectedRentalId);
            setSelectedRentalId(null);
            loadData();
        }
    };

    const handleBlockClick = (e: React.MouseEvent, rental: Rental) => {
        e.stopPropagation(); 
        setSelectedRentalId(rental.id === selectedRentalId ? null : rental.id);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            setFormError("La date de fin doit être après la date de début.");
            return;
        }

        const excludeId = modalMode === 'EDIT' && selectedRentalId ? selectedRentalId : undefined;
        if (checkOverlap(formData.carId, formData.startDate, formData.endDate, excludeId)) {
            setFormError("Ce véhicule est déjà réservé pour ces dates.");
            return;
        }

        try {
            if (modalMode === 'CREATE') {
                await ApiService.createRental({
                    productId: Number(formData.carId),
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    totalPrice: Number(formData.price)
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
            loadData();
        } catch (err) {
            console.error(err);
            setFormError("Une erreur est survenue lors de la sauvegarde.");
        }
    };

    const filteredCars = cars.filter(c => c.title.toLowerCase().includes(vehicleSearch.toLowerCase()));

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] relative">
            
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">Planning Agence</h2>
                    <div className="flex gap-2 ml-4">
                        <button onClick={handleCreateClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus size={16} /> Ajouter
                        </button>
                        <button onClick={handleEditClick} disabled={!selectedRentalId} className={`flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg transition-colors ${selectedRentalId ? 'bg-white text-slate-700 hover:bg-slate-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                            <Edit3 size={16} /> Modifier
                        </button>
                        <button onClick={handleDeleteClick} disabled={!selectedRentalId} className={`flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg transition-colors ${selectedRentalId ? 'bg-white text-red-600 hover:bg-red-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                            <Trash2 size={16} /> Annuler
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input type="text" placeholder="Rechercher véhicule..." value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="pl-3 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64" />
                    </div>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        <button onClick={() => shiftView(-7)} className="p-2 hover:bg-slate-100 rounded text-slate-600"><ChevronLeft size={20}/></button>
                        <span className="px-4 font-bold text-slate-700 min-w-[150px] text-center capitalize">{viewDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => shiftView(7)} className="p-2 hover:bg-slate-100 rounded text-slate-600"><ChevronRight size={20}/></button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm relative z-0">
                <div className="flex border-b border-gray-200 bg-slate-50">
                    <div className="w-48 flex-shrink-0 p-4 font-bold text-slate-500 border-r border-gray-200 sticky left-0 bg-slate-50 z-10 shadow-sm">Véhicule</div>
                    <div className="flex-1 overflow-hidden relative">
                        <div className="flex" style={{ width: DAYS_TO_SHOW * DAY_WIDTH }}>
                            {dateColumns.map((date, i) => (
                                <div key={i} className={`flex-shrink-0 border-r border-gray-100 text-center py-2 text-xs font-medium text-slate-500 ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-slate-100' : ''}`} style={{ width: DAY_WIDTH }}>
                                    <div className="uppercase text-[10px]">{date.toLocaleString('fr-FR', { weekday: 'short' })}</div>
                                    <div className="font-bold text-sm">{date.getDate()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar" onClick={() => setSelectedRentalId(null)}>
                    {loading && <div className="p-4 text-center text-slate-400">Chargement du planning...</div>}
                    
                    {filteredCars.map(car => (
                        <div key={car.id} className="flex border-b border-gray-100 hover:bg-slate-50/50 transition-colors h-16 group">
                            <div className="w-48 flex-shrink-0 p-3 border-r border-gray-200 flex items-center gap-3 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10">
                                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                                    <img src={car.imageUrl} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-xs text-slate-800 truncate">{car.title}</div>
                                    <div className="text-[10px] text-slate-500">{car.category}</div>
                                </div>
                            </div>

                            <div className="flex-1 relative overflow-hidden">
                                <div className="flex h-full absolute top-0 left-0" style={{ width: DAYS_TO_SHOW * DAY_WIDTH }}>
                                    {dateColumns.map((date, i) => (
                                        <div key={i} className={`h-full border-r border-gray-100 flex-shrink-0 ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-slate-50/50' : ''}`} style={{ width: DAY_WIDTH }}></div>
                                    ))}

                                    {rentals.filter(r => r.productId === car.id && r.status === 'ACTIVE').map(rental => {
                                        const style = getRentalStyle(rental.startDate, rental.endDate);
                                        const isSelected = selectedRentalId === rental.id;
                                        return (
                                            <div 
                                                key={rental.id}
                                                className={`absolute top-2 bottom-2 rounded-md shadow-sm cursor-pointer z-0 overflow-hidden px-2 flex flex-col justify-center transition-all ${isSelected ? 'bg-blue-600 ring-2 ring-slate-800 z-20' : 'bg-blue-500 hover:bg-blue-600'}`}
                                                style={style}
                                                onClick={(e) => handleBlockClick(e, rental)}
                                                title={`Client: ${rental.clientName}`}
                                            >
                                                <div className="text-xs font-bold text-white truncate">{rental.clientName}</div>
                                                {isSelected && <div className="text-[9px] text-blue-100 flex items-center gap-1"><CheckCircle2 size={10}/> Sélectionné</div>}
                                            </div>
                                        );
                                    })}

                                    {previewRental && previewRental.carId === car.id && (
                                        <div 
                                            className="absolute top-2 bottom-2 rounded-md bg-slate-400/30 border-2 border-dashed border-slate-500 flex items-center justify-center animate-pulse z-20 pointer-events-none"
                                            style={getRentalStyle(previewRental.startDate, previewRental.endDate)}
                                        >
                                            <span className="text-[10px] font-bold text-slate-700 bg-white/70 px-1 rounded">{previewRental.clientName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredCars.length === 0 && <div className="p-8 text-center text-gray-400 italic">Aucun véhicule ne correspond à votre recherche.</div>}
                </div>
            </div>

            {/* TIROIR DEMANDES ENTRANTES (INCOMING REQUESTS DRAWER) */}
            <div 
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-[calc(100%-1.5rem)]'}`}
                onMouseEnter={() => setIsDrawerOpen(true)}
                onMouseLeave={() => { setIsDrawerOpen(false); setPreviewRental(null); }}
            >
                <div className="absolute left-0 top-1/2 -translate-x-full bg-blue-600 text-white p-2 rounded-l-lg shadow-lg cursor-pointer writing-vertical-rl flex items-center justify-center gap-2 h-32 hover:bg-blue-700 transition-colors" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                    <ArrowLeftFromLine size={16} className={`transition-transform duration-300 ${isDrawerOpen ? 'rotate-180' : ''}`}/>
                    <span className="text-xs font-bold tracking-widest writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>DEMANDES ({incomingRequests.length})</span>
                </div>

                <div className="p-5 bg-slate-50 border-b border-gray-200">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <CalendarClock size={20} className="text-blue-600"/> Demandes entrantes
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Survolez pour prévisualiser dans le planning</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/50">
                    {incomingRequests.map(req => (
                        <div 
                            key={req.id} 
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group"
                            onMouseEnter={() => setPreviewRental(req)}
                            onMouseLeave={() => setPreviewRental(null)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-slate-800">{req.clientName}</span>
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Nouveau</span>
                            </div>
                            <div className="text-sm text-slate-600 font-medium mb-1">{req.carTitle}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded">Du {new Date(req.startDate).toLocaleDateString()}</span>
                                <span>au</span>
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded">{new Date(req.endDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="mt-3 flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleAcceptRequest(req)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded font-medium transition-colors"
                                >
                                    Accepter
                                </button>
                                <button 
                                    onClick={() => handleRefuseRequest(req.id)}
                                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-slate-600 text-xs py-1.5 rounded font-medium transition-colors"
                                >
                                    Refuser
                                </button>
                            </div>
                        </div>
                    ))}
                    {incomingRequests.length === 0 && <div className="text-center text-sm text-gray-400 py-10">Aucune demande en attente.</div>}
                </div>
            </div>
            
            <div className="mt-4 flex gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded"></div> Réservation confirmée</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 ring-2 ring-slate-800 rounded"></div> Sélectionnée</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded"></div> Week-end</div>
                <span className="ml-auto flex items-center gap-1 text-slate-400"><AlertCircle size={12}/> Cliquez sur une réservation pour sélectionner</span>
            </div>

            {/* MODAL DE CRÉATION / ÉDITION */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">
                                {modalMode === 'CREATE' ? 'Nouvelle Réservation' : 'Modifier Réservation'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {formError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-100">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5"/> {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Véhicule</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.carId}
                                    onChange={(e) => setFormData({...formData, carId: Number(e.target.value)})}
                                >
                                    {cars.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Client</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Nom du client"
                                    value={formData.clientName}
                                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Départ</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Retour</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prix Total (€)</label>
                                <input 
                                    type="number" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                                    <Save size={18} /> Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgencyCalendar;