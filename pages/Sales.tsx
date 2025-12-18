
import React, { useEffect, useState, useMemo } from 'react';
import { ApiService } from '../services/api';
import { Product, ProductCategory } from '../types';
import ProductCard from '../components/ProductCard';
import { 
  Search, ShoppingCart, SlidersHorizontal, X, ChevronDown, ChevronUp, RefreshCcw, Tag 
} from 'lucide-react';

// Fix: Added explicit props interface and used React.FC to properly handle children
interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}) => (
  <div className="border-b border-gray-100 py-4 last:border-0">
    <button 
      onClick={onToggle}
      className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2"
    >
      {title}
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {isOpen && <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-200">{children}</div>}
  </div>
);

const Sales: React.FC = () => {
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [optionsSearchTerm, setOptionsSearchTerm] = useState('');

  const [sectionsOpen, setSectionsOpen] = useState({
    price: true,
    brand: true,
    category: true,
    fuel: false,
    transmission: false,
    options: true
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllProducts();
      // FILTRE STRICT : Uniquement les ventes
      const salesData = data.filter(p => p.usageCategory === 'FOR_SALE');
      setProducts(salesData);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setLoading(false);
    }
  };

  const availableBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.title.split(' ')[0]));
    return Array.from(brands).sort();
  }, [products]);

  const availableFuels = useMemo(() => {
    const fuels = new Set(products.map(p => p.fuelType));
    return Array.from(fuels).sort();
  }, [products]);

  const availableOptions = useMemo(() => {
    const optionsSet = new Set<string>();
    products.forEach(p => {
      if (p.options) p.options.forEach(opt => optionsSet.add(opt));
    });
    return Array.from(optionsSet).sort();
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const productBrand = p.title.split(' ')[0];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
    const matchesFuel = selectedFuels.length === 0 || selectedFuels.includes(p.fuelType);
    const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.includes(p.transmission);
    const matchesOptions = selectedOptions.length === 0 || (p.options && selectedOptions.every(opt => p.options.includes(opt)));
    
    // Pour la vente, on simule un prix total
    const totalPrice = p.pricePerDay * 250;
    const matchesPrice = totalPrice >= priceRange[0] && totalPrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesFuel && matchesTransmission && matchesOptions && matchesPrice;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedOptions([]);
    setPriceRange([0, 200000]);
  };

  const toggleFilter = (item: string, currentList: string[], setter: (l: string[]) => void) => {
    if (currentList.includes(item)) setter(currentList.filter(i => i !== item));
    else setter([...currentList, item]);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS (Restored) */}
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                
                <FilterSection title="Marque" isOpen={sectionsOpen.brand} onToggle={() => setSectionsOpen({...sectionsOpen, brand: !sectionsOpen.brand})}>
                    <div className="space-y-2">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{brand}</span>
                      </label>
                    ))}
                    </div>
                </FilterSection>

                <FilterSection title="Catégorie" isOpen={sectionsOpen.category} onToggle={() => setSectionsOpen({...sectionsOpen, category: !sectionsOpen.category})}>
                    <div className="space-y-2">
                    {Object.values(ProductCategory).map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{cat}</span>
                      </label>
                    ))}
                    </div>
                </FilterSection>

                <FilterSection title="Options" isOpen={sectionsOpen.options} onToggle={() => setSectionsOpen({...sectionsOpen, options: !sectionsOpen.options})}>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                        {availableOptions.map(opt => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={selectedOptions.includes(opt)} onChange={() => toggleFilter(opt, selectedOptions, setSelectedOptions)} className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600" />
                            <span className="text-xs text-gray-600">{opt}</span>
                        </label>
                        ))}
                    </div>
                </FilterSection>

                <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 text-xs text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"><RefreshCcw size={12} /> Réinitialiser</button>
            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="flex-1">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ShoppingCart className="text-orange-600" /> Véhicules d'occasion</h1>
                <p className="text-sm text-gray-500 mt-1">Découvrez notre sélection de véhicules révisés et garantis.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (<ProductCard key={product.id} product={product} onRent={() => {}} />))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900">Aucun véhicule à la vente trouvé</h3>
                <button onClick={resetFilters} className="mt-4 text-primary-600 hover:underline">Effacer les filtres</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Sales;
