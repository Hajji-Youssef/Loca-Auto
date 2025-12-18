
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Sales from './pages/Sales';
import Dashboard from './pages/Dashboard';
import MyRentals from './pages/MyRentals';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Workspace from './pages/worker/Workspace';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rentals" element={<MyRentals />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Worker Workspace Route - Contains its own sub-routes */}
              <Route path="/workspace/*" element={<Workspace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
