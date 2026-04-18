import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import { trackEvent } from './utils/analytics'; // <-- IMPORTAMOS LA ANALÍTICA

// Páginas
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import ProductDetail from './pages/ProductDetail';
import CartFull from './pages/CartFull';

// Este componente "invisible" rastrea cada ventana que visita el usuario
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Registra la vista de página con la URL exacta (ej: '/' o '/categoria/auriculares')
    trackEvent('page_view', location.pathname);
  }, [location]);

  return null;
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <RouteTracker /> {/* <-- ACTIVAMOS EL RASTREADOR */}
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
          <Navbar />
          <CartSidebar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categoria/:id" element={<CategoryView />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<CartFull />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;