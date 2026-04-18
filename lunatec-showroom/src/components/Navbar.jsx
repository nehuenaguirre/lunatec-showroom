import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Truck, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { cartCount, setIsSidebarOpen } = useContext(CartContext);

  return (
    <header className="sticky top-0 z-40 shadow-lg font-sans"> {/* Fuente base Inter */}
      
      {/* 1. TOP BAR (Franja de confianza superior) */}
      <div className="bg-[#612A53] text-white/90 text-[10px] md:text-[11px] py-1.5 px-4 font-medium hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wider uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-brand-pink" /> Envíos en el día para Tucumán</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-pink" /> Compra 100% Segura</span>
          </div>
          <span className="font-bold">WhatsApp: +54 9 3815 13-5998</span>
        </div>
      </div>

      {/* 2. HEADER PRINCIPAL */}
      <div className="bg-gradient-brand">
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
          
          {/* Fila Superior Mobile: Menú | Logo | Carrito */}
          <div className="w-full flex items-center justify-between md:contents">
            
            {/* Botón Menú */}
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 p-2 md:px-3 md:py-2 rounded-full text-white transition-all shadow-sm order-1 md:order-3">
              <Menu size={22} className="md:w-[18px] md:h-[18px]" />
              {/* Fuente Montserrat + Negrita + Mayúsculas para el botón */}
              <span className="hidden lg:inline font-display font-black uppercase text-xs tracking-tight">Categorías</span>
            </button>

            {/* Logo */}
            <Link to="/" className="transition-transform hover:scale-105 order-2 md:order-1 flex justify-center">
              <img 
                src="/logo.png" 
                alt="LunaTec Logo" 
                className="h-9 md:h-12 object-contain drop-shadow-lg transform md:scale-150 md:origin-left" 
                onError={(e) => e.target.src = "https://via.placeholder.com/200x60/ffffff/E95B7F?text=LUNATEC"}
              />
            </Link>

            {/* Carrito */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 p-2 md:px-4 md:py-2 rounded-full text-white transition-all shadow-sm group order-3 md:order-4"
            >
              <ShoppingCart size={22} className="md:w-[20px] md:h-[20px] group-hover:scale-110 transition-transform" />
              {/* Fuente Montserrat + Negrita + Mayúsculas */}
              <span className="font-display font-black text-xs uppercase tracking-tight hidden sm:block">Mi Carrito</span>
              
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-brand-dark text-[10px] md:text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-brand-pink font-display">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Buscador */}
          <div className="flex-grow w-full md:max-w-2xl relative order-last md:order-2">
            <input 
              type="text" 
              placeholder="Estoy buscando..." 
              /* Fuente Inter para el input, para mejor legibilidad al escribir */
              className="w-full bg-white text-gray-900 border-none rounded-full py-2 md:py-2.5 pl-5 pr-12 outline-none focus:ring-4 focus:ring-white/40 shadow-md transition-all text-sm font-medium font-sans"
            />
            <button className="absolute right-1 top-1 bottom-1 aspect-square bg-brand-pink hover:bg-brand-dark text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
              <Search size={16} strokeWidth={3} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}