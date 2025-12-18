import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">© 2024 LocaAuto. Tous droits réservés.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">Mentions légales</a>
          <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">Confidentialité</a>
          <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;