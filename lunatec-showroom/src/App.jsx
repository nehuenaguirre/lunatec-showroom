import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

// Páginas (Las crearemos en la siguiente parte)
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import ProductDetail from './pages/ProductDetail';
import CartFull from './pages/CartFull';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
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