import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import ImagenCategoria from './ImagenCategoria';
import { trackEvent } from '../utils/analytics'; // <-- IMPORTAMOS LA ANALÍTICA

export default function CategoryGrid({ categorias }) {
  const scrollRef = useRef(null);
  const location = useLocation();

  const scroll = (direccion) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direccion === 'izq' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // <-- EVENTO DE RASTREO: Registramos si usan las flechas para mover el carrusel
      trackEvent('category_scroll', location.pathname, { direction: direccion });
    }
  };

  const isAllActive = location.pathname === '/';

  // Función para registrar los clics en las categorías
  const handleCategoryClick = (categoryName, categoryId = 'todas') => {
    trackEvent('category_click', location.pathname, { 
      category_name: categoryName,
      category_id: categoryId
    });
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 mb-10">
      
      {/* Botón Scroll Izquierda */}
      <button 
        onClick={() => scroll('izq')} 
        className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur rounded-full p-2.5 shadow-md border border-gray-100 text-gray-500 hover:text-brand-pink transition-all"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>
      
      {/* Botón Scroll Derecha */}
      <button 
        onClick={() => scroll('der')} 
        className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur rounded-full p-2.5 shadow-md border border-gray-100 text-gray-500 hover:text-brand-pink transition-all"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>

      <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 px-2 [&::-webkit-scrollbar]:hidden scroll-smooth">
        
        {/* Botón Todas */}
        <Link 
          to="/" 
          onClick={() => handleCategoryClick('Todas')} // <-- EVENTO DE RASTREO
          className={`flex flex-col items-center gap-3 min-w-[85px] group transition-all ${isAllActive ? 'scale-105' : 'opacity-80'}`}
        >
          <div className={`w-[76px] h-[76px] md:w-[92px] md:h-[92px] rounded-2xl flex items-center justify-center transition-all ${
            isAllActive ? 'bg-brand-pink text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-brand-pink'
          }`}>
            <LayoutGrid size={36} strokeWidth={isAllActive ? 2.5 : 2} />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wide ${isAllActive ? 'text-brand-dark' : 'text-gray-500'}`}>
            Todas
          </span>
        </Link>

        {/* Categorías Dinámicas */}
        {categorias.map((cat) => {
          const isActive = location.pathname === `/categoria/${cat.id}`;
          return (
            <Link 
              key={cat.id} 
              to={`/categoria/${cat.id}`} 
              onClick={() => handleCategoryClick(cat.nombre, cat.id)} // <-- EVENTO DE RASTREO
              className={`flex flex-col items-center gap-3 min-w-[85px] group transition-all ${isActive ? 'scale-105' : 'opacity-80'}`}
            >
              <div className={`w-[76px] h-[76px] md:w-[92px] md:h-[92px] rounded-2xl flex items-center justify-center transition-all overflow-hidden ${
                isActive ? 'bg-brand-pink/10 border-2 border-brand-pink shadow-md' : 'bg-white border border-gray-200 group-hover:border-brand-pink'
              }`}>
                <ImagenCategoria id={cat.id} nombre={cat.nombre} isActive={isActive} />
              </div>
              <span className={`text-[10px] font-bold text-center leading-tight uppercase tracking-wide ${isActive ? 'text-brand-dark' : 'text-gray-600'}`}>
                {cat.nombre}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}