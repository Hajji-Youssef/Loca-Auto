
import React, { useEffect, useState, useMemo } from 'react';
import { ApiService } from '../services/api';
import { Product, ProductCategory } from '../types';
import ProductCard from '../components/ProductCard';
import { 
  Search, ShoppingCart, SlidersHorizontal, X, ChevronDown, ChevronUp, RefreshCcw, Tag, Layers, Loader2, Fuel, Settings2
} from 'lucide-react';

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
      className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors mb-2"
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

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);

  const [sectionsOpen, setSectionsOpen] = useState({
    price: true,
    brand: true,
    category: true,
    fuel: false,
    transmission: false
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllProducts();
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

  const fuelTypes = ['Essence', 'Diesel', 'Électrique', 'Hybride'];
  const transmissions = ['Automatique', 'Manuelle'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const productBrand = p.title.split(' ')[0];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
    const matchesFuel = selectedFuels.length === 0 || selectedFuels.includes(p.fuelType);
    const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.includes(p.transmission);
    
    const totalPrice = p.pricePerDay * 250;
    const matchesPrice = totalPrice >= priceRange[0] && totalPrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesFuel && matchesTransmission && matchesPrice;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
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
          
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                
                <FilterSection title="Budget Max" isOpen={sectionsOpen.price} onToggle={() => setSectionsOpen({...sectionsOpen, price: !sectionsOpen.price})}>
                    <input type="range" min="0" max="200000" step="1000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full accent-orange-600" />
                    <div className="flex justify-between text-xs text-gray-600"><span>0€</span><span>{priceRange[1].toLocaleString()}€</span></div>
                </FilterSection>

                <FilterSection title="Catégorie" isOpen={sectionsOpen.category} onToggle={() => setSectionsOpen({...sectionsOpen, category: !sectionsOpen.category})}>
                    <div className="space-y-2">
                    {Object.values(ProductCategory).map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                        <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">{cat}</span>
                      </label>
                    ))}
                    </div>
                </FilterSection>

                <FilterSection title="Carburant" isOpen={sectionsOpen.fuel} onToggle={() => setSectionsOpen({...sectionsOpen, fuel: !sectionsOpen.fuel})}>
                    <div className="space-y-2">
                        {fuelTypes.map(fuel => (
                            <label key={fuel} className="flex items-center gap-3 cursor-pointer p-1 group">
                                <input type="checkbox" checked={selectedFuels.includes(fuel)} onChange={() => toggleFilter(fuel, selectedFuels, setSelectedFuels)} className="rounded border-gray-300 text-orange-600" />
                                <div className="flex items-center gap-2">
                                    <Fuel size={14} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                                    <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">{fuel}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Boîte de vitesse" isOpen={sectionsOpen.transmission} onToggle={() => setSectionsOpen({...sectionsOpen, transmission: !sectionsOpen.transmission})}>
                    <div className="space-y-2">
                        {transmissions.map(trans => (
                            <label key={trans} className="flex items-center gap-3 cursor-pointer p-1 group">
                                <input type="checkbox" checked={selectedTransmissions.includes(trans)} onChange={() => toggleFilter(trans, selectedTransmissions, setSelectedTransmissions)} className="rounded border-gray-300 text-orange-600" />
                                <div className="flex items-center gap-2">
                                    <Settings2 size={14} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                                    <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">{trans}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Marque" isOpen={sectionsOpen.brand} onToggle={() => setSectionsOpen({...sectionsOpen, brand: !sectionsOpen.brand})}>
                    <div className="space-y-2">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)} className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                        <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">{brand}</span>
                      </label>
                    ))}
                    </div>
                </FilterSection>

                <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 text-xs text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"><RefreshCcw size={12} /> Réinitialiser les filtres</button>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ShoppingCart className="text-orange-600" /> Véhicules d'occasion</h1>
                <p className="text-sm text-gray-500 mt-1">Découvrez notre sélection de véhicules révisés et garantis.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" size={48}/></div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (<ProductCard key={product.id} product={product} onRent={() => {}} />))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                <Layers className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-900">Aucun résultat</h3>
                <p className="text-gray-500 mt-1">Modifiez vos critères pour trouver votre bonheur.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Sales;
