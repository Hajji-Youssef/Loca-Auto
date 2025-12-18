import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Rental, RentalStatus } from '../types';
import { Calendar, Package, AlertCircle } from 'lucide-react';

const MyRentals: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getMyRentals()
      .then(setRentals)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: RentalStatus) => {
    switch (status) {
      case RentalStatus.ACTIVE: return 'bg-white text-green-700 border border-green-200';
      case RentalStatus.PENDING: return 'bg-white text-yellow-700 border border-yellow-200';
      case RentalStatus.COMPLETED: return 'bg-white text-gray-700 border border-gray-200';
      case RentalStatus.CANCELLED: return 'bg-white text-red-700 border border-red-200';
      default: return 'bg-white text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Locations</h1>

        {loading ? (
           <div className="animate-pulse space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>)}
           </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucune location</h3>
            <p className="text-gray-500 mt-1">Vous n'avez pas encore effectué de location.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rentals.map((rental) => (
              <div key={rental.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-48 h-32 sm:h-auto bg-gray-200 relative">
                  <img src={rental.productImage} alt={rental.productTitle} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{rental.productTitle}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                        <Calendar size={14} />
                        <span>Du {rental.startDate} au {rental.endDate}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-end border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-semibold">Total</span>
                      <div className="text-xl font-bold text-primary-600">{rental.totalPrice}€</div>
                    </div>
                    
                    {rental.status === RentalStatus.ACTIVE && (
                       <button className="text-sm text-red-600 font-medium hover:text-red-700 flex items-center gap-1">
                         <AlertCircle size={14} /> Signaler un problème
                       </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentals;