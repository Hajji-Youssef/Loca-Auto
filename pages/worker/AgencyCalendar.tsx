
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Rental, Product } from '../../types';
import { ChevronLeft, ChevronRight, RefreshCw, ShoppingBag, Car, Calendar as CalendarIcon, Filter, Layers, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AgencyCalendar: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const [viewDate, setViewDate] = useState(new Date());
    const [transactions, setTransactions] = useState<Rental[]>([]);
    const [cars, setCars] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [vehicleSearch, setVehicleSearch] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'RENTAL' | 'SALE'>('ALL');

    const DAYS_TO_SHOW = 30;
    const DAY_WIDTH = 50; 

    useEffect(() => {
        loadData();
    }, [viewDate]); 

    const loadData = async () => {
        setLoading(true);
        try {
            const [fetchedCars, fetchedTransactions] = await Promise.all([
                ApiService.getAllProducts(),
                ApiService.getAllRentalsForCalendar("", "")
            ]);
            
            setCars(fetchedCars);
            setTransactions(fetchedTransactions);
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
        const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

        return {
            left: `${diffStart * DAY_WIDTH}px`,
            width: `${duration * DAY_WIDTH}px`
        };
    };

    const filteredCars = cars.filter(c => 
        c.title.toLowerCase().includes(vehicleSearch.toLowerCase()) &&
        (filterType === 'ALL' || (filterType === 'RENTAL' && c.usageCategory === 'FOR_RENT') || (filterType === 'SALE' && c.usageCategory === 'FOR_SALE'))
    );

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">Planning Synchronisé</h2>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100">
                        <Layers size={12}/> {isAdmin ? 'Admin View' : 'Agency View'}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                        <button onClick={() => setFilterType('ALL')} className={`px-2 py-1 text-xs font-bold rounded ${filterType === 'ALL' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}>Tous</button>
                        <button onClick={() => setFilterType('RENTAL')} className={`px-2 py-1 text-xs font-bold rounded ${filterType === 'RENTAL' ? 'bg-blue-100 text-blue-700' : 'text-slate-500'}`}>Locations</button>
                        <button onClick={() => setFilterType('SALE')} className={`px-2 py-1 text-xs font-bold rounded ${filterType === 'SALE' ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}`}>Demandes Vente</button>
                    </div>
                    <input type="text" placeholder="Véhicule..." value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="pl-3 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-40" />
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        <button onClick={() => shiftView(-7)} className="p-1 hover:bg-slate-100 rounded text-slate-600"><ChevronLeft size={16}/></button>
                        <span className="px-2 font-bold text-slate-700 text-xs capitalize">{viewDate.toLocaleString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                        <button onClick={() => shiftView(7)} className="p-1 hover:bg-slate-100 rounded text-slate-600"><ChevronRight size={16}/></button>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm relative z-0">
                <div className="flex border-b border-gray-200 bg-slate-50">
                    <div className="w-48 flex-shrink-0 p-4 font-bold text-slate-500 border-r border-gray-200 sticky left-0 bg-slate-50 z-10 shadow-sm text-xs">Flotte</div>
                    <div className="flex-1 overflow-hidden relative">
                        <div className="flex" style={{ width: DAYS_TO_SHOW * DAY_WIDTH }}>
                            {dateColumns.map((date, i) => (
                                <div key={i} className={`flex-shrink-0 border-r border-gray-100 text-center py-2 text-xs font-medium text-slate-500 ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-slate-100' : ''}`} style={{ width: DAY_WIDTH }}>
                                    <div className="uppercase text-[9px]">{date.toLocaleString('fr-FR', { weekday: 'short' })}</div>
                                    <div className="font-bold">{date.getDate()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredCars.map(car => (
                        <div key={car.id} className="flex border-b border-gray-100 hover:bg-slate-50/50 transition-colors h-14 group">
                            <div className="w-48 flex-shrink-0 p-3 border-r border-gray-200 flex items-center gap-2 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10">
                                <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <img src={car.imageUrl} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-[10px] text-slate-800 truncate">{car.title}</div>
                                    <div className={`text-[8px] font-black uppercase ${car.usageCategory === 'FOR_RENT' ? 'text-blue-500' : 'text-orange-500'}`}>
                                        {car.usageCategory === 'FOR_RENT' ? 'LOCATION' : 'VENTE'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden">
                                <div className="flex h-full absolute top-0 left-0" style={{ width: DAYS_TO_SHOW * DAY_WIDTH }}>
                                    {dateColumns.map((date, i) => <div key={i} className={`h-full border-r border-gray-100 flex-shrink-0 ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-slate-50/50' : ''}`} style={{ width: DAY_WIDTH }}></div>)}
                                    {transactions.filter(r => r.productId === car.id && r.status !== 'CANCELLED').map(transaction => {
                                        const isSale = transaction.type === 'SALE';
                                        return (
                                            <div 
                                                key={transaction.id} 
                                                className={`absolute top-2 bottom-2 rounded shadow-sm cursor-pointer z-0 overflow-hidden px-1 flex items-center gap-1.5 border border-white/20 transition-all ${isSale ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-500 hover:bg-blue-600'}`} 
                                                style={getRentalStyle(transaction.startDate, transaction.endDate)}
                                                title={`${isSale ? 'DEMANDE VENTE' : 'RÉSERVATION'}: ${transaction.clientName}`}
                                            >
                                                {isSale ? <ShoppingBag size={10} className="text-white shrink-0" /> : <Car size={10} className="text-white shrink-0" />}
                                                <div className="text-[9px] font-bold text-white truncate">{transaction.clientName}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredCars.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Layers size={40} className="mb-2 opacity-20"/>
                            <p className="text-sm font-medium">Aucun véhicule affiché</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div> Locations Confirmées</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-600 rounded"></div> Demandes de Vente</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded"></div> Weekend</div>
                <div className="ml-auto flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-200">
                    <RefreshCw size={10} className={loading ? 'animate-spin' : ''} /> 
                    <span>Base de données synchronisée</span>
                </div>
            </div>
        </div>
    );
};

export default AgencyCalendar;
