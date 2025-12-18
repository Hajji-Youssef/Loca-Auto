
import React, { useEffect, useState, useMemo } from 'react';
import { ApiService } from '../services/api';
import { Product, ProductCategory } from '../types';
import ProductCard from '../components/ProductCard';
import Calendar from '../components/Calendar';
import { 
  Search, Car, CalendarClock, AlertCircle, 
  SlidersHorizontal, X, ChevronDown, ChevronUp, RefreshCcw, Calendar as CalendarIcon, Loader2, CheckCircle2, ShieldCheck
} from 'lucide-react';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen, onToggle, children, headerAction }) => (
  <div className="border-b border-gray-100 py-4 last:border-0">
    <div className="flex items-center justify-between mb-2">
        <button onClick={onToggle} className="flex flex-grow items-center justify-between text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors">
            {title}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {headerAction}
    </div>
    {isOpen && <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-200">{children}</div>}
  </div>
);

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); 
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });
  const [availableProductIds, setAvailableProductIds] = useState<Set<number> | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [optionsSearchTerm, setOptionsSearchTerm] = useState('');

  // Rental Modal
  const [rentingProduct, setRentingProduct] = useState<Product | null>(null);

  // Sections
  const [sectionsOpen, setSectionsOpen] = useState({
    date: true, price: true, brand: true, category: true, fuel: false, transmission: false, options: true
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllProducts();
      setProducts(data);
      if (data.length > 0) {
        const maxPrice = Math.max(...data.map(p => p.pricePerDay));
        setPriceRange([0, maxPrice + 50]);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    const checkAvailability = async () => {
        if (dateRange.start && dateRange.end) {
            if (new Date(dateRange.start) > new Date(dateRange.end)) return;
            setIsCheckingAvailability(true);
            try {
                const ids = await ApiService.findAvailableProducts(dateRange.start, dateRange.end);
                setAvailableProductIds(new Set(ids));
            } catch (e) { console.error(e); } finally { setIsCheckingAvailability(false); }
        } else { setAvailableProductIds(null); }
    };
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [dateRange]);

  const availableBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.title.split(' ')[0]));
    return Array.from(brands).sort();
  }, [products]);

  const availableFuels = useMemo(() => {
    const fuels = new Set(products.map(p => p.fuelType));
    return Array.from(fuels).sort();
  }, [products]);

  const availableOptions: string[] = useMemo(() => {
    const optionsSet = new Set<string>();
    products.forEach(p => { if (p.options) p.options.forEach(opt => optionsSet.add(opt)); });
    return Array.from(optionsSet).sort();
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.title.split(' ')[0]);
    const matchesFuel = selectedFuels.length === 0 || selectedFuels.includes(p.fuelType);
    const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.includes(p.transmission);
    const matchesOptions = selectedOptions.length === 0 || (p.options && selectedOptions.every(opt => p.options.includes(opt)));
    const matchesPrice = p.pricePerDay >= priceRange[0] && p.pricePerDay <= priceRange[1];
    const matchesAvailability = availableProductIds === null || availableProductIds.has(p.id);
    return matchesSearch && matchesCategory && matchesBrand && matchesFuel && matchesTransmission && matchesOptions && matchesPrice && matchesAvailability;
  });

  const resetFilters = () => {
    setSearchTerm(''); setSelectedCategories([]); setSelectedBrands([]); setSelectedFuels([]); setSelectedTransmissions([]); setSelectedOptions([]);
    setDateRange({ start: '', end: '' }); setOptionsSearchTerm('');
  };

  const toggleFilter = (item: string, currentList: string[], setter: (l: string[]) => void) => {
    if (currentList.includes(item)) setter(currentList.filter(i => i !== item));
    else setter([...currentList, item]);
  };

  // --- MODAL DE RÉSERVATION AMÉLIORÉE ---
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
        if (new Date(startDate) > new Date(endDate)) { setAvailabilityStatus('unavailable'); return; }
        const checkDates = async () => {
          setAvailabilityStatus('checking');
          try {
            const isAvailable = await ApiService.checkAvailability(rentingProduct.id, startDate, endDate);
            setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');
            const diffDays = Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
            setTotalPrice(diffDays * rentingProduct.pricePerDay);
          } catch (e) { setAvailabilityStatus('unavailable'); }
        };
        checkDates();
      } else { setAvailabilityStatus('idle'); setTotalPrice(0); }
    }, [startDate, endDate]);
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (availabilityStatus !== 'available' || isSubmitting) return;
      
      setIsSubmitting(true);
      // Simulation paiement sécurisé
      setTimeout(async () => {
          await ApiService.createRental({ productId: rentingProduct.id, startDate, endDate, totalPrice });
          setIsSubmitting(false);
          setIsSuccess(true);
          // Fermeture auto après succès
          setTimeout(() => setRentingProduct(null), 2500);
      }, 2000);
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
             <div><h3 className="text-xl font-bold text-gray-900">Louer {rentingProduct.title}</h3><p className="text-sm text-gray-500 mt-0.5">{rentingProduct.category}</p></div>
             {!isSubmitting && !isSuccess && <button onClick={() => setRentingProduct(null)} className="text-gray-400 hover:text-gray-900 p-2 rounded-full"><X size={24}/></button>}
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">
             {isSuccess ? (
                 <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Réservation confirmée !</h2>
                    <p className="text-gray-500 max-w-xs mx-auto">Votre paiement a été accepté. Retrouvez vos détails dans votre tableau de bord.</p>
                 </div>
             ) : (
                <>
                <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2"><CalendarIcon size={16} className="text-primary-600" /> Sélectionnez vos dates</h4>
                    </div>
                    <Calendar carId={rentingProduct.id} onDateSelect={(s, e) => { if(s) setStartDate(s); if(e) setEndDate(e); }} selectedStart={startDate} selectedEnd={endDate} readOnly={isSubmitting} />
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className={`p-3 rounded-xl border transition-colors ${startDate ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'}`}>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Départ</label>
                        <input type="date" required min={new Date().toISOString().split('T')[0]} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 font-bold focus:ring-0" disabled={isSubmitting} />
                        </div>
                        <div className={`p-3 rounded-xl border transition-colors ${endDate ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'}`}>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Retour</label>
                        <input type="date" required min={startDate || new Date().toISOString().split('T')[0]} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 font-bold focus:ring-0" disabled={isSubmitting} />
                        </div>
                    </div>

                    {availabilityStatus === 'checking' && <div className="text-primary-600 text-sm flex items-center gap-2 font-medium bg-white p-3 rounded-lg border border-primary-100"><Loader2 size={18} className="animate-spin"/> Vérification des tarifs...</div>}
                    
                    {availabilityStatus === 'available' && (
                        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm border border-emerald-100 flex justify-between items-center animate-in zoom-in duration-200">
                            <div className="flex flex-col"><span className="font-bold flex items-center gap-2 text-emerald-700">Disponible</span><span className="text-xs text-emerald-600/80 mt-1">Assurance tous risques incluse</span></div>
                            <div className="text-right"><span className="block text-xs text-emerald-600">Total estimé</span><span className="text-xl font-bold">{totalPrice}€</span></div>
                        </div>
                    )}
                    
                    {availabilityStatus === 'unavailable' && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-in shake duration-200"><AlertCircle size={18}/> Véhicule indisponible.</div>
                    )}
                    
                    <button type="submit" disabled={availabilityStatus !== 'available' || isSubmitting} className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg transform active:scale-95 flex items-center justify-center gap-3 ${isSubmitting ? 'bg-gray-800 cursor-wait' : availabilityStatus === 'available' ? 'bg-gray-900 hover:bg-primary-600 hover:shadow-primary-500/25' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}>
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin" size={20}/> Paiement sécurisé en cours...</>
                        ) : (
                            <><ShieldCheck size={20}/> Confirmer et Payer {totalPrice > 0 ? `(${totalPrice}€)` : ''}</>
                        )}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-medium">Transactions sécurisées par SSL 256-bit</p>
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
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex justify-between items-center">
        <span className="font-semibold text-gray-900">{filteredProducts.length} véhicules</span>
        <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 text-sm font-medium text-primary-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg"><SlidersHorizontal size={16} /> Filtres</button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block lg:w-64 lg:bg-transparent ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full flex flex-col bg-white lg:bg-transparent p-4 lg:p-0">
              <div className="lg:hidden flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-gray-900">Filtres</h2><button onClick={() => setShowMobileFilters(false)} className="p-2"><X size={20} /></button></div>
              <div className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Chercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="bg-white lg:rounded-xl lg:border lg:p-5 space-y-2">
                    <FilterSection title="Disponibilité" isOpen={sectionsOpen.date} onToggle={() => setSectionsOpen({...sectionsOpen, date: !sectionsOpen.date})}>
                        <div className="space-y-3 p-1">
                            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                        </div>
                    </FilterSection>
                    <FilterSection title="Prix par jour" isOpen={sectionsOpen.price} onToggle={() => setSectionsOpen({...sectionsOpen, price: !sectionsOpen.price})}>
                        <input type="range" min="0" max="500" step="10" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full accent-primary-600" />
                        <div className="flex justify-between text-xs text-gray-600"><span>0€</span><span>{priceRange[1]}€+</span></div>
                    </FilterSection>
                    <FilterSection title="Marque" isOpen={sectionsOpen.brand} onToggle={() => setSectionsOpen({...sectionsOpen, brand: !sectionsOpen.brand})}>
                        {availableBrands.map(brand => (
                            <label key={brand} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded">
                                <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)} className="rounded border-gray-300 text-primary-600" />
                                <span className="text-sm text-gray-600">{brand}</span>
                            </label>
                        ))}
                    </FilterSection>
                </div>
                <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 text-xs text-red-600 py-2 hover:underline"><RefreshCcw size={12} /> Réinitialiser</button>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Car className="text-primary-600" /> Notre Flotte</h1>
            {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={48}/></div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (<ProductCard key={product.id} product={product} onRent={setRentingProduct} />))}
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
