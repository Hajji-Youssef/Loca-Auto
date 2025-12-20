
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Product, ProductCategory } from '../../types';
import { Plus, Edit2, Trash2, Save, X, Car, Wrench, AlertTriangle, Loader2 } from 'lucide-react';

const AdminCarManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toggle Flow State
    const [toggleCar, setToggleCar] = useState<Product | null>(null);
    const [toggleStep, setToggleStep] = useState<'IDLE' | 'REASON' | 'CONFIRM'>('IDLE');
    const [unavailabilityReason, setUnavailabilityReason] = useState('');

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        title: '', category: ProductCategory.BERLINE, pricePerDay: 50, imageUrl: '', usageCategory: 'FOR_RENT',
        fuelType: 'Essence', transmission: 'Manuelle', seats: 4, available: true, options: [], description: ''
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await ApiService.getAllProducts();
        setProducts(data);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm("⚠️ Êtes-vous sûr de vouloir SUPPRIMER ce véhicule ? Toutes les réservations liées seront également supprimées !")) {
            setIsSubmitting(true);
            try {
                await ApiService.deleteProduct(id);
                // Mise à jour immédiate UI
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch (e) {
                alert("Erreur lors de la suppression.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleEdit = (p: Product) => { setEditingProduct(p); setFormData(p); setIsModalOpen(true); };
    const handleCreate = () => { setEditingProduct(null); setFormData({
        title: '', category: ProductCategory.BERLINE, pricePerDay: 50, imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        usageCategory: 'FOR_RENT', fuelType: 'Essence', transmission: 'Manuelle', seats: 4, available: true, options: [], description: 'Nouveau véhicule'
    }); setIsModalOpen(true); };

    const executeToggle = async (car: Product, newStatus: boolean, reason?: string) => {
        setIsSubmitting(true);
        setTimeout(async () => {
            const updated = products.map(p => p.id === car.id ? { 
                ...p, available: newStatus, currentMission: newStatus ? "" : ((reason) ? "MAINTENANCE : " + reason : p.currentMission) 
            } : p);
            setProducts(updated);
            await ApiService.updateProductStatus(car.id, newStatus, reason);
            setIsSubmitting(false);
            setToggleCar(null);
            setToggleStep('IDLE');
        }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(async () => {
            try {
                if (editingProduct) await ApiService.updateProduct(editingProduct.id, formData);
                else await ApiService.addProduct(formData as Product);
                setIsSubmitting(false);
                setIsModalOpen(false);
                loadData();
            } catch (e) { setIsSubmitting(false); alert("Erreur sauvegarde"); }
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Car className="text-blue-600"/> Gestion Véhicules</h2>
                <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"><Plus size={18}/> Ajouter</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                    <div key={p.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden group hover:shadow-md transition-all ${!p.available ? 'border-orange-300' : 'border-gray-200'}`}>
                        <div className="relative h-48 bg-gray-200">
                            <img src={p.imageUrl} alt={p.title} className={`w-full h-full object-cover ${!p.available ? 'grayscale' : ''}`}/>
                            {!p.available && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                    <div className="bg-orange-500 text-white px-3 py-1 rounded font-bold text-xs flex items-center gap-1 shadow-lg border border-white/20"><Wrench size={12}/> MAINTENANCE</div>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => handleEdit(p)} className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white text-slate-700 hover:text-blue-600 transition-all"><Edit2 size={16}/></button>
                                <button onClick={() => handleDelete(p.id)} className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white text-slate-700 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800 truncate pr-2">{p.title}</h3>
                                <button onClick={() => p.available ? (setToggleCar(p), setUnavailabilityReason(''), setToggleStep('REASON')) : executeToggle(p, true)} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${p.available ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform shadow ${p.available ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-primary-600">{p.pricePerDay}€ / jour</span>
                                <span className={`px-2 py-0.5 rounded font-black ${p.usageCategory === 'FOR_RENT' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>{p.usageCategory === 'FOR_RENT' ? 'LOCATION' : 'VENTE'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de création / édition */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-slate-800">{editingProduct ? 'Modifier' : 'Nouveau Véhicule'}</h3><button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400"/></button></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Modèle</label><input type="text" className="w-full border rounded-lg p-2.5 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prix / Jour</label><input type="number" className="w-full border rounded-lg p-2.5 text-sm" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})} required /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usage</label><select className="w-full border rounded-lg p-2.5 text-sm" value={formData.usageCategory} onChange={e => setFormData({...formData, usageCategory: e.target.value as any})}><option value="FOR_RENT">Location</option><option value="FOR_SALE">Vente</option></select></div>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 mt-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                {isSubmitting ? <><Loader2 className="animate-spin" size={18}/> Enregistrement...</> : <><Save size={18}/> Enregistrer les modifications</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {toggleStep === 'REASON' && toggleCar && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><Wrench className="text-orange-500"/> Mise en maintenance</h3>
                        <textarea className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] mb-4" placeholder="Raison de la mise hors service..." value={unavailabilityReason} onChange={(e) => setUnavailabilityReason(e.target.value)} required autoFocus></textarea>
                        <div className="flex gap-3"><button onClick={() => setToggleStep('IDLE')} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-bold text-slate-500">Annuler</button><button onClick={() => executeToggle(toggleCar, false, unavailabilityReason)} disabled={!unavailabilityReason.trim() || isSubmitting} className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-all">{isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : "Confirmer"}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCarManagement;
