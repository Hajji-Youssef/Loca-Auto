
import React, { useState, useEffect, useMemo } from 'react';
import { ApiService } from '../../services/api';
import { Rental, PaymentStatus } from '../../types';
import { ShoppingBag, Search, Filter, DollarSign, Calendar, User, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const SalesHistory: React.FC = () => {
    const [sales, setSales] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        setLoading(true);
        try {
            const allTransactions = await ApiService.getAllRentalsForCalendar("", "");
            // On filtre uniquement les ventes
            setSales(allTransactions.filter(t => t.type === 'SALE'));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const totalAmount = sales.reduce((sum, s) => sum + s.totalPrice, 0);
        const paidCount = sales.filter(s => s.paymentStatus === PaymentStatus.PAID).length;
        const pendingAmount = sales
            .filter(s => s.paymentStatus !== PaymentStatus.PAID)
            .reduce((sum, s) => sum + s.totalPrice, 0);
            
        return { totalAmount, paidCount, pendingAmount, totalCount: sales.length };
    }, [sales]);

    const filteredSales = sales.filter(s => 
        s.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPaymentBadge = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-wider"><CheckCircle2 size={12}/> Payé</span>;
            case PaymentStatus.PENDING:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-wider"><Clock size={12}/> Attente</span>;
            case PaymentStatus.UNPAID:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 uppercase tracking-wider"><AlertCircle size={12}/> Impayé</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-gray-100 text-gray-700 uppercase tracking-wider">Inconnu</span>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER ET STATS RAPIDES */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ShoppingBag className="text-orange-500" size={32} /> Historique des Ventes
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Registre complet des transactions de vente de véhicules.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[180px]">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">C.A. Total</p>
                            <p className="text-lg font-black text-slate-900">{stats.totalAmount.toLocaleString()}€</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[180px]">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Attente</p>
                            <p className="text-lg font-black text-slate-900">{stats.pendingAmount.toLocaleString()}€</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un client ou un modèle de voiture..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-slate-700"
                    />
                </div>
                <button className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                    <Filter size={16} /> Filtres Avancés
                </button>
            </div>

            {/* TABLEAU DES VENTES */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Véhicule</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acheteur</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date de Vente</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Montant</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paiement</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={6} className="px-8 py-10 text-center"><p className="text-slate-400 font-bold animate-pulse">Chargement de l'historique financier...</p></td></tr>
                            ) : filteredSales.length === 0 ? (
                                <tr><td colSpan={6} className="px-8 py-10 text-center text-slate-400 italic font-medium">Aucune vente enregistrée.</td></tr>
                            ) : filteredSales.map(sale => (
                                <tr key={sale.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img src={sale.productImage} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm">{sale.productTitle}</p>
                                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">Ref: #{sale.productId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs border border-gray-100">
                                                {sale.clientName?.charAt(0)}
                                            </div>
                                            <p className="font-bold text-slate-700 text-sm">{sale.clientName}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                            <Calendar size={14} className="text-slate-400"/>
                                            {new Date(sale.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-black text-slate-900 text-lg">{sale.totalPrice.toLocaleString()}€</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        {getPaymentBadge(sale.paymentStatus)}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2.5 bg-slate-100 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all shadow-sm group-hover:scale-110">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* FOOTER RÉCAPITULATIF */}
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center shadow-inner">
                        <ShoppingBag size={32} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black tracking-tight">Performances Commerciales</h4>
                        <p className="text-slate-400 text-sm font-medium">Résumé analytique des {stats.totalCount} ventes réalisées cette année.</p>
                    </div>
                </div>
                <div className="flex gap-10">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Moyenne Vente</p>
                        <p className="text-2xl font-black">{(stats.totalAmount / (stats.totalCount || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}€</p>
                    </div>
                    <div className="w-[1px] h-12 bg-slate-800"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ratio Payé</p>
                        <p className="text-2xl font-black text-emerald-500">{Math.round((stats.paidCount / (stats.totalCount || 1)) * 100)}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesHistory;
