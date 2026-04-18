import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Truck, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { cartCount, setIsSidebarOpen } = useContext(CartContext);

  return (
    <header className="sticky top-0 z-40 shadow-lg">
      
      {/* 1. TOP BAR (Franja de confianza superior) */}
      <div className="bg-[#612A53] text-white/90 text-[11px] py-1.5 px-4 font-medium hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wide">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-brand-pink" /> Envíos en el día para San Miguel de Tucumán y alrededores</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-pink" /> Compra 100% Segura</span>
          </div>
          <span>Atención personalizada | WhatsApp: +54 9 3815 13-5998</span>
        </div>
      </div>

      {/* 2. HEADER PRINCIPAL (Degradado fluido sin cortes) */}
      <div className="bg-gradient-brand">
        {/* Layout en 1 sola fila para Desktop, 2 filas para Mobile */}
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Flotante */}
          <Link to="/" className="shrink-0 transition-transform hover:scale-105 order-1">
            <img 
              src="/logo.png" 
              alt="LunaTec Logo" 
              className="h-10 md:h-12 object-contain drop-shadow-lg transform scale-150 origin-left" 
              onError={(e) => e.target.src = "https://via.placeholder.com/200x60/ffffff/E95B7F?text=LUNATEC"}
            />
          </Link>

          {/* Buscador Píldora Moderno */}
          <div className="flex-grow w-full md:max-w-2xl relative order-3 md:order-2">
            <input 
              type="text" 
              placeholder="Estoy buscando..." 
              className="w-full bg-white text-gray-900 border-none rounded-full py-2.5 pl-5 pr-12 outline-none focus:ring-4 focus:ring-white/40 shadow-md transition-all text-sm font-medium"
            />
            {/* Botón de lupa integrado */}
            <button className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-brand-pink hover:bg-brand-dark text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
              <Search size={16} strokeWidth={3} />
            </button>
          </div>

          {/* Controles: Categorías y Carrito */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0 order-2 md:order-3 w-full md:w-auto justify-between md:justify-end">
            
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-full text-white text-sm font-bold transition-all shadow-sm">
              <Menu size={18} />
              <span className="hidden lg:inline">Categorías</span>
            </button>

            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full text-white transition-all shadow-sm group"
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm tracking-wide hidden sm:block">Mi Carrito</span>
              
              {/* Badge del carrito flotante */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-brand-dark text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-brand-pink">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}