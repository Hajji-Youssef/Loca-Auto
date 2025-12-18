
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Rental, Product, PaymentStatus } from '../../types';
import { ChevronLeft, ChevronRight, RefreshCw, Plus, Edit3, Trash2, ArrowLeftFromLine, CalendarClock, X, Save, CheckCircle2 } from 'lucide-react';
import { wsService } from '../../services/websocket';
import { useAuth } from '../../context/AuthContext';

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
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const [viewDate, setViewDate] = useState(new Date());
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [cars, setCars] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [vehicleSearch, setVehicleSearch] = useState('');
    const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);

    const DAYS_TO_SHOW = 30;
    const DAY_WIDTH = 50; 

    useEffect(() => {
        loadData();
        // Optionnel: rafraîchissement auto toutes les 10 secondes
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, [viewDate]); 

    const loadData = async () => {
        setLoading(true);
        try {
            const [fetchedCars, fetchedRentals] = await Promise.all([
                ApiService.getAllProducts(),
                ApiService.getAllRentalsForCalendar("", "")
            ]);
            
            // On filtre les voitures de location uniquement pour le planning
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

    const filteredCars = cars.filter(c => c.title.toLowerCase().includes(vehicleSearch.toLowerCase()));

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] relative">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">Planning {isAdmin ? 'Global' : 'Agence'}</h2>
                    <div className="flex gap-2 ml-4">
                        <button onClick={loadData} className={`flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-white transition-all ${loading ? 'opacity-50' : ''}`}>
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Rechercher véhicule..." value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="pl-3 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64" />
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        <button onClick={() => shiftView(-7)} className="p-2 hover:bg-slate-100 rounded text-slate-600"><ChevronLeft size={20}/></button>
                        <span className="px-4 font-bold text-slate-700 min-w-[150px] text-center capitalize">{viewDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => shiftView(7)} className="p-2 hover:bg-slate-100 rounded text-slate-600"><ChevronRight size={20}/></button>
                    </div>
                </div>
            </div>

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
                    {filteredCars.map(car => (
                        <div key={car.id} className="flex border-b border-gray-100 hover:bg-slate-50/50 transition-colors h-16 group">
                            <div className="w-48 flex-shrink-0 p-3 border-r border-gray-200 flex items-center gap-3 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10">
                                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden relative">
                                    <img src={car.imageUrl} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-xs text-slate-800 truncate">{car.title}</div>
                                </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden">
                                <div className="flex h-full absolute top-0 left-0" style={{ width: DAYS_TO_SHOW * DAY_WIDTH }}>
                                    {dateColumns.map((date, i) => <div key={i} className={`h-full border-r border-gray-100 flex-shrink-0 ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-slate-50/50' : ''}`} style={{ width: DAY_WIDTH }}></div>)}
                                    {rentals.filter(r => r.productId === car.id && r.status === 'ACTIVE').map(rental => (
                                        <div key={rental.id} className={`absolute top-2 bottom-2 rounded-md shadow-sm cursor-pointer z-0 overflow-hidden px-2 flex flex-col justify-center bg-blue-500 hover:bg-blue-600 transition-all`} style={getRentalStyle(rental.startDate, rental.endDate)}>
                                            <div className="text-xs font-bold text-white truncate">{rental.clientName}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgencyCalendar;
