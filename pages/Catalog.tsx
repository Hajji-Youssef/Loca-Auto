
import React, { useEffect, useState, useMemo } from 'react';
import { ApiService } from '../services/api';
import { Product, ProductCategory } from '../types';
import ProductCard from '../components/ProductCard';
import Calendar from '../components/Calendar';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Car, CalendarClock, AlertCircle, 
  SlidersHorizontal, X, ChevronDown, ChevronUp, RefreshCcw, Calendar as CalendarIcon, Loader2, CheckCircle2, ShieldCheck, Layers, Fuel, Settings2
} from 'lucide-react';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-gray-100 py-4 last:border-0">
    <button onClick={onToggle} className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {isOpen && <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-200">{children}</div>}
  </div>
);

const Catalog: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });

  // Rental Modal
  const [rentingProduct, setRentingProduct] = useState<Product | null>(null);

  const [sectionsOpen, setSectionsOpen] = useState({
    price: true, brand: true, category: true, fuel: false, transmission: false
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllProducts();
      const rentalData = data.filter(p => p.usageCategory === 'FOR_RENT');
      setProducts(rentalData);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const availableBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.title.split(' ')[0]));
    return Array.from(brands).sort();
  }, [products]);

  const fuelTypes = ['Essence', 'Diesel', 'Électrique', 'Hybride'];
  const transmissions = ['Automatique', 'Manuelle'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.title.split(' ')[0]);
    const matchesFuel = selectedFuels.length === 0 || selectedFuels.includes(p.fuelType);
    const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.includes(p.transmission);
    const matchesPrice = p.pricePerDay >= priceRange[0] && p.pricePerDay <= priceRange[1];
    return matchesSearch && matchesCategory && matchesBrand && matchesFuel && matchesTransmission && matchesPrice;
  });

  const resetFilters = () => {
    setSearchTerm(''); setSelectedCategories([]); setSelectedBrands([]);
    setSelectedFuels([]); setSelectedTransmissions([]);
    setPriceRange([0, 500]); setDateRange({ start: '', end: '' });
  };

  const toggleFilter = (item: string, currentList: string[], setter: (l: string[]) => void) => {
    if (currentList.includes(item)) setter(currentList.filter(i => i !== item));
    else setter([...currentList, item]);
  };

  // --- MODAL DE RÉSERVATION ---
  const RentalModal = () => {
    if (!rentingProduct) return null;

    const [startDate, setStartDate] = useState(dateRange.start || '');
    const [endDate, setEndDate] = useState(dateRange.end || '');
    const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
      if (startDate && endDate) {
        setAvailabilityStatus('checking');
        setTimeout(() => {
          setAvailabilityStatus('available');
          const diffDays = Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
          setTotalPrice(diffDays * rentingProduct.pricePerDay);
        }, 300);
      }
    }, [startDate, endDate]);
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await ApiService.createRental({
          productId: rentingProduct.id,
          startDate: startDate,
          endDate: endDate,
          totalPrice: totalPrice,
          clientName: user?.fullName || "Client Web"
        });
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => setRentingProduct(null), 2000);
      } catch (err) {
        alert("Erreur lors de la réservation");
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
             <div><h3 className="text-xl font-bold text-gray-900">Réserver {rentingProduct.title}</h3><p className="text-sm text-gray-500 mt-0.5">Location {rentingProduct.category}</p></div>
             {!isSubmitting && !isSuccess && <button onClick={() => setRentingProduct(null)} className="text-gray-400 hover:text-gray-900 p-2 rounded-full"><X size={24}/></button>}
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">
             {isSuccess ? (
                 <div className="py-12 text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={48} /></div>
                    <h2 className="text-2xl font-bold text-gray-900">Réservation confirmée !</h2>
                 </div>
             ) : (
                <>
                <Calendar carId={rentingProduct.id} onDateSelect={(s, e) => { if(s) setStartDate(s); if(e) setEndDate(e); }} selectedStart={startDate} selectedEnd={endDate} readOnly={isSubmitting} />
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Départ</label>
                                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 font-bold focus:ring-0" />
                            </div>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Retour</label>
                                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 font-bold focus:ring-0" />
                            </div>
                        </div>
                        {availabilityStatus === 'available' && (
                            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm border border-emerald-100 flex justify-between items-center">
                                <span className="font-bold">Véhicule disponible</span>
                                <span className="text-xl font-bold">{totalPrice}€</span>
                            </div>
                        )}
                        <button type="submit" disabled={availabilityStatus !== 'available' || isSubmitting} className="w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg bg-gray-900 hover:bg-primary-600 disabled:opacity-50 active:scale-95">
                            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Confirmer la réservation"}
                        </button>
                    </form>
                </div>
                </>
             )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Chercher un modèle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                
                <FilterSection title="Budget / jour" isOpen={sectionsOpen.price} onToggle={() => setSectionsOpen({...sectionsOpen, price: !sectionsOpen.price})}>
                    <input type="range" min="0" max="500" step="10" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full accent-primary-600" />
                    <div className="flex justify-between text-xs text-gray-600"><span>0€</span><span>{priceRange[1]}€</span></div>
                </FilterSection>

                <FilterSection title="Catégorie" isOpen={sectionsOpen.category} onToggle={() => setSectionsOpen({...sectionsOpen, category: !sectionsOpen.category})}>
                    {Object.values(ProductCategory).map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer p-1 group">
                            <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} className="rounded border-gray-300 text-primary-600" />
                            <span className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">{cat}</span>
                        </label>
                    ))}
                </FilterSection>

                <FilterSection title="Carburant" isOpen={sectionsOpen.fuel} onToggle={() => setSectionsOpen({...sectionsOpen, fuel: !sectionsOpen.fuel})}>
                    <div className="space-y-2">
                        {fuelTypes.map(fuel => (
                            <label key={fuel} className="flex items-center gap-3 cursor-pointer p-1 group">
                                <input type="checkbox" checked={selectedFuels.includes(fuel)} onChange={() => toggleFilter(fuel, selectedFuels, setSelectedFuels)} className="rounded border-gray-300 text-primary-600" />
                                <div className="flex items-center gap-2">
                                    <Fuel size={14} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    <span className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">{fuel}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Boîte de vitesse" isOpen={sectionsOpen.transmission} onToggle={() => setSectionsOpen({...sectionsOpen, transmission: !sectionsOpen.transmission})}>
                    <div className="space-y-2">
                        {transmissions.map(trans => (
                            <label key={trans} className="flex items-center gap-3 cursor-pointer p-1 group">
                                <input type="checkbox" checked={selectedTransmissions.includes(trans)} onChange={() => toggleFilter(trans, selectedTransmissions, setSelectedTransmissions)} className="rounded border-gray-300 text-primary-600" />
                                <div className="flex items-center gap-2">
                                    <Settings2 size={14} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    <span className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">{trans}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Marque" isOpen={sectionsOpen.brand} onToggle={() => setSectionsOpen({...sectionsOpen, brand: !sectionsOpen.brand})}>
                    {availableBrands.map(brand => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer p-1 group">
                            <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)} className="rounded border-gray-300 text-primary-600" />
                            <span className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">{brand}</span>
                        </label>
                    ))}
                </FilterSection>

                <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 text-xs text-red-600 py-2 hover:underline"><RefreshCcw size={12} /> Réinitialiser les filtres</button>
            </div>
          </aside>

          <main className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Car className="text-primary-600" /> Nos Locations Disponibles</h1>
            {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={48}/></div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (<ProductCard key={product.id} product={product} onRent={setRentingProduct} />))}
              </div>
            )}
            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Layers className="mx-auto text-gray-300 mb-4" size={48}/>
                    <h3 className="text-lg font-bold text-gray-900">Aucun véhicule trouvé</h3>
                    <p className="text-gray-500 mt-1">Essayez de modifier vos filtres ou de réinitialiser la recherche.</p>
                </div>
            )}
          </main>
        </div>
      </div>
      <RentalModal />
    </div>
  );
};

export default Catalog;
