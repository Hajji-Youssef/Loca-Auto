
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, MapPin, Key, ShoppingCart, Car } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50/50">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold leading-6 text-primary-600 ring-1 ring-inset ring-primary-600/20 shadow-sm">
                    Location & Vente Premium
                  </span>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Le véhicule idéal pour <br/>
                  <span className="text-primary-600">tous vos projets.</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Besoin d'une voiture pour quelques jours ou d'investir dans votre prochain véhicule ? LocaAuto vous propose les meilleures solutions.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    to="/catalog"
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary-200 hover:bg-primary-500 transition-all active:scale-95"
                  >
                    <Car size={18}/> Louer une voiture
                  </Link>
                  <Link
                    to="/sales"
                    className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all active:scale-95"
                  >
                    <ShoppingCart size={18}/> Acheter un véhicule
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen relative">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-50 -z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
               alt="Voiture premium" 
               className="rounded-3xl shadow-2xl ring-1 ring-gray-900/10 transform rotate-1 hover:rotate-0 transition-transform duration-700"
             />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-primary-600 mb-4 flex items-center gap-3"><Car size={28}/> Service Location</h3>
                <ul className="space-y-4 text-gray-600">
                    <li className="flex items-center gap-3"><ShieldCheck className="text-green-500"/> Assurance tous risques incluse</li>
                    <li className="flex items-center gap-3"><Key className="text-green-500"/> Réservation immédiate en ligne</li>
                    <li className="flex items-center gap-3"><MapPin className="text-green-500"/> Retrait rapide en agence</li>
                </ul>
                <Link to="/catalog" className="mt-8 inline-flex items-center gap-2 text-primary-600 font-bold hover:gap-4 transition-all">Découvrir les locations <ArrowRight size={18}/></Link>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-3"><ShoppingCart size={28}/> Service Vente</h3>
                <ul className="space-y-4 text-gray-600">
                    <li className="flex items-center gap-3"><ShieldCheck className="text-orange-500"/> Garantie 24 mois sur occasions</li>
                    <li className="flex items-center gap-3"><Key className="text-orange-500"/> Contrôle technique 100 points</li>
                    <li className="flex items-center gap-3"><MapPin className="text-orange-500"/> Livraison à domicile possible</li>
                </ul>
                <Link to="/sales" className="mt-8 inline-flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all">Voir les véhicules en vente <ArrowRight size={18}/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
