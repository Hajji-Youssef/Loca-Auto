import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, MapPin, Key, Clock, Phone } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50/50">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold leading-6 text-primary-600 ring-1 ring-inset ring-primary-600/20 shadow-sm">
                    Nouveaux Modèles Disponibles
                  </span>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Prenez la route <br/>
                  <span className="text-primary-600">en toute liberté.</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  De la citadine agile au SUV familial, trouvez la voiture idéale pour votre prochain trajet.
                  Réservation simple, assurance incluse, départ immédiat.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    to="/catalog"
                    className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Choisir un véhicule
                  </Link>
                  <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1">
                    Se connecter <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen relative">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-50 -z-10"></div>
             
             <img 
               src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
               alt="Voiture de sport sur route" 
               className="rounded-xl shadow-2xl ring-1 ring-gray-900/10 transform rotate-1 hover:rotate-0 transition-transform duration-700"
             />
          </div>
        </div>
      </div>

      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">L'expérience LocaAuto</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Plus qu'une simple location
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Assurance Tous Risques
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Roulez l'esprit tranquille. Chaque location inclut une couverture complète et une assistance 24/7.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <Key className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Accès Simplifié
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Plus de files d'attente au comptoir. Réservez en ligne, récupérez vos clés et partez.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <MapPin className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Partout en France
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Des agences disponibles dans toutes les grandes villes et gares pour faciliter vos départs.
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Nous trouver</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Notre Agence à Paris
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Venez récupérer votre véhicule directement en agence ou rencontrez nos conseillers pour planifier votre location longue durée.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Informations Pratiques</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-xl text-primary-600 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Adresse</p>
                    <p className="text-gray-600 leading-relaxed">
                      12 Avenue des Champs-Élysées<br/>
                      75008 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-xl text-primary-600 shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Horaires d'ouverture</p>
                    <div className="text-gray-600 space-y-1">
                      <p className="flex justify-between w-48"><span>Lundi - Vendredi :</span> <span>08h00 - 20h00</span></p>
                      <p className="flex justify-between w-48"><span>Samedi :</span> <span>09h00 - 19h00</span></p>
                      <p className="flex justify-between w-48"><span>Dimanche :</span> <span>Fermé</span></p>
                    </div>
                  </div>
                </div>

                 <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-xl text-primary-600 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Contact</p>
                    <p className="text-gray-600 font-medium">+33 1 23 45 67 89</p>
                    <p className="text-gray-500 text-sm">support@locaauto.fr</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.215573428278!2d2.305711776437651!3d48.87323490035071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc4f8f8f8f7%3A0x4b66b4b4b4b4b4b4!2sChamps-%C3%89lys%C3%A9es!5e0!3m2!1sfr!2sfr!4v1709649963560!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Agence LocaAuto Paris"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;