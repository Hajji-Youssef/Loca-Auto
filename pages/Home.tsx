
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, MapPin, Key, ShoppingCart, Car, Clock, Phone, Mail } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50/50">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl text-left">
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
                <Link to="/catalog" className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary-200 hover:bg-primary-500 transition-all active:scale-95">
                  <Car size={18}/> Louer une voiture
                </Link>
                <Link to="/sales" className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all active:scale-95">
                  <ShoppingCart size={18}/> Acheter un véhicule
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen relative">
             <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Car" className="rounded-3xl shadow-2xl ring-1 ring-gray-900/10 transform rotate-1" />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-primary-600 mb-4 flex items-center gap-3"><Car size={28}/> Service Location</h3>
                <ul className="space-y-4 text-gray-600">
                    <li className="flex items-center gap-3"><ShieldCheck className="text-green-500"/> Assurance tous risques incluse</li>
                    <li className="flex items-center gap-3"><Key className="text-green-500"/> Réservation immédiate</li>
                </ul>
                <Link to="/catalog" className="mt-8 inline-flex items-center gap-2 text-primary-600 font-bold hover:gap-4 transition-all">Découvrir <ArrowRight size={18}/></Link>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-3"><ShoppingCart size={28}/> Service Vente</h3>
                <ul className="space-y-4 text-gray-600">
                    <li className="flex items-center gap-3"><ShieldCheck className="text-orange-500"/> Garantie 24 mois</li>
                    <li className="flex items-center gap-3"><ArrowRight className="text-orange-500"/> Expertise complète</li>
                </ul>
                <Link to="/sales" className="mt-8 inline-flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all">Voir les ventes <ArrowRight size={18}/></Link>
            </div>
          </div>
        </div>
      </div>

      {/* EXACT DESIGN "Nous trouver" Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-sm font-bold text-primary-600 mb-2">Nous trouver</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Notre Agence à Paris</h2>
            <p className="max-w-2xl mx-auto text-gray-500 mb-16">
                Venez récupérer votre véhicule directement en agence ou rencontrez nos conseillers pour planifier votre location longue durée.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                {/* Informations Pratiques Column */}
                <div className="bg-slate-50/50 rounded-3xl p-8 text-left border border-gray-100 flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-gray-900 mb-8">Informations Pratiques</h3>
                    
                    <div className="space-y-8">
                        {/* Adresse */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-primary-600 shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Adresse</p>
                                <p className="text-gray-500 text-sm">12 Avenue des Champs-Élysées</p>
                                <p className="text-gray-500 text-sm">75008 Paris, France</p>
                            </div>
                        </div>

                        {/* Horaires */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-primary-600 shrink-0">
                                <Clock size={24} />
                            </div>
                            <div className="w-full">
                                <p className="font-bold text-gray-900">Horaires d'ouverture</p>
                                <div className="grid grid-cols-2 gap-x-4 text-sm mt-1">
                                    <span className="text-gray-500">Lundi - Vendredi :</span>
                                    <span className="text-gray-700 font-medium">08h00 - 20h00</span>
                                    <span className="text-gray-500">Samedi :</span>
                                    <span className="text-gray-700 font-medium">09h00 - 19h00</span>
                                    <span className="text-gray-500">Dimanche :</span>
                                    <span className="text-gray-700 font-medium">Fermé</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-primary-600 shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Contact</p>
                                <p className="text-gray-700 font-medium text-sm">+33 1 23 45 67 89</p>
                                <p className="text-gray-500 text-sm">support@locaauto.fr</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Map Column */}
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 h-[500px] border border-gray-100">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src="https://maps.google.com/maps?width=100%25&height=600&hl=fr&q=12%20Avenue%20des%20Champs-Élysées%2075008%20Paris+(LocaAuto%20Paris)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                        className="grayscale hover:grayscale-0 transition-all duration-700"
                    ></iframe>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
