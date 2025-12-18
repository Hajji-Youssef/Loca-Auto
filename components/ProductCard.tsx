
import React, { useState } from 'react';
import { Product } from '../types';
import { Fuel, Settings2, Users, CalendarDays, ChevronDown, ChevronUp, Ban, Wrench, ShoppingBag, Info, CheckCircle2, Loader2 } from 'lucide-react';
import Calendar from './Calendar';

interface ProductCardProps {
  product: Product;
  onRent: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onRent }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  
  const isForSale = product.usageCategory === 'FOR_SALE';

  const handleAction = () => {
    if (isForSale) {
        if (buySuccess) return;
        setIsBuying(true);
        // Simulation d'envoi de demande d'achat
        setTimeout(() => {
            setIsBuying(false);
            setBuySuccess(true);
            setTimeout(() => setBuySuccess(false), 5000); // Reset après 5s
        }, 1500);
    } else {
        onRent(product);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col h-full ${!product.available ? 'border-orange-200' : 'border-gray-100'}`}>
      <div className="relative h-48 overflow-hidden bg-gray-200 flex-shrink-0">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className={`w-full h-full object-cover transition-transform duration-500 ${product.available ? 'group-hover:scale-105' : 'grayscale'}`}
        />
        
        <div className="absolute top-3 left-3 flex gap-2">
            {isForSale ? (
                <span className="bg-orange-600 text-white px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm">À Vendre</span>
            ) : (
                <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm">Location</span>
            )}
        </div>

        {product.available ? (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 shadow-sm">
                {product.category}
            </div>
        ) : (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform rotate-[-5deg] border-2 border-white flex items-center gap-2">
                    <Wrench size={18} /> EN MAINTENANCE
                </div>
            </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.title}</h3>
          <div className="text-right flex-shrink-0 ml-2">
            <span className="block text-lg font-bold text-primary-600">
                {isForSale ? `${(product.pricePerDay * 250).toLocaleString()}€` : `${product.pricePerDay}€`}
            </span>
            <span className="text-xs text-gray-500">{isForSale ? 'TTC' : '/ jour'}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <Fuel size={14} /> {product.fuelType}
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <Settings2 size={14} /> {product.transmission}
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <Users size={14} /> {product.seats}
          </div>
        </div>

        <div className="mt-auto space-y-3">
          {!isForSale && (
            <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors border ${showCalendar ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-white border-gray-100 text-primary-600 hover:bg-primary-50'}`}
            >
                <CalendarDays size={16} />
                {showCalendar ? "Masquer disponibilités" : "Voir disponibilités"}
                {showCalendar ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
          )}

          {showCalendar && !isForSale && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-200 w-full">
                  <div className="mt-2 w-full">
                      <Calendar carId={product.id} readOnly={true} compact={true} />
                  </div>
              </div>
          )}

          <button 
            onClick={handleAction}
            disabled={(!product.available && !isForSale) || isBuying}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 transform active:scale-95 ${
                buySuccess ? 'bg-emerald-500 text-white' :
                isBuying ? 'bg-orange-400 text-white cursor-wait' :
                product.available || isForSale ? (isForSale ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200' : 'bg-gray-900 hover:bg-primary-600 text-white') : 
                'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isBuying ? (
                <><Loader2 size={16} className="animate-spin"/> Traitement...</>
            ) : buySuccess ? (
                <><CheckCircle2 size={16}/> Demande envoyée !</>
            ) : isForSale ? (
                <><ShoppingBag size={16}/> Acheter ce véhicule</>
            ) : (
                product.available ? "Louer ce véhicule" : <><Ban size={16}/> Indisponible</>
            )}
          </button>
          
          {isForSale && (
              <button className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1 transition-colors">
                  <Info size={14} /> Demander la fiche technique
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
