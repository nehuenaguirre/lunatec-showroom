import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid'; // Recomendado: npm install uuid

// --- IMPORTACIONES DE CONTEXTO ---
import { AuthProvider } from './context/AuthContext'; // <-- Faltaba esto
import { CartProvider } from './context/CartContext';

// --- IMPORTACIONES DE COMPONENTES ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ProtectedRoute from './components/ProtectedRoute';

// --- IMPORTACIONES DE PÁGINAS ---
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import ProductDetail from './pages/ProductDetail';
import CartFull from './pages/CartFull';
import Login from './pages/Login';
import MiCuenta from './pages/MiCuenta';

import { trackEvent } from './utils/analytics';
import Success from './pages/Success';
import Failure from './pages/Failure';
import Pending from './pages/Pending';
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Obtenemos o creamos el ID de sesión usando cookies
    let sessionId = Cookies.get('lunatec_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      // Guardamos la cookie por 30 días
      Cookies.set('lunatec_session_id', sessionId, { expires: 30, path: '/' });
      trackEvent('new_session_started', location.pathname, { session_id: sessionId });
    }

    trackEvent('page_view', location.pathname, { session_id: sessionId });
  }, [location]);

  return null;
}

function App() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    // Solo mostramos el banner si el usuario no lo aceptó antes
    const consent = Cookies.get('lunatec_cookie_consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('lunatec_cookie_consent', 'accepted', { expires: 365, path: '/' });
    setShowCookieBanner(false);
  };

  return (
    <AuthProvider> {/* <-- Aquí envolvemos la app con la Autenticación */}
      <CartProvider>
        <BrowserRouter>
          <RouteTracker />
          <div className="flex flex-col min-h-screen font-sans bg-gray-50 relative">
            <Navbar />
            <CartSidebar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:id" element={<CategoryView />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/carrito" element={<CartFull />} />
                <Route path="/success" element={<Success />} />
                <Route path="/failure" element={<Failure />} />
                <Route path="/pending" element={<Pending />} />
                {/* <-- Aquí agregamos las nuevas rutas que faltaban --> */}
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/mi-cuenta" 
                  element={
                    <ProtectedRoute>
                      <MiCuenta />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>

            <Footer />

            {/* Banner de Cookies */}
            {showCookieBanner && (
              <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-2xl md:flex md:items-center md:justify-between px-6 md:px-12">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm font-medium">
                    Usamos cookies para mejorar tu experiencia, recordar tus preferencias y analizar nuestro tráfico. 
                  </p>
                </div>
                <button 
                  onClick={acceptCookies}
                  className="w-full md:w-auto px-6 py-2 bg-brand-pink hover:bg-brand-dark text-white rounded-xl font-display font-black text-sm uppercase tracking-tight transition-colors whitespace-nowrap"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;