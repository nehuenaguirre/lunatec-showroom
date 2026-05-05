import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Truck, ShieldCheck, X, Clock } from 'lucide-react';
import Cookies from 'js-cookie';
import { CartContext } from '../context/CartContext';
import { trackEvent } from '../utils/analytics';
import { supabase } from '../supabase'; 
import ImagenOptimizada from './ImagenOptimizada'; 

export default function Navbar() {
  const { cartCount, setIsSidebarOpen } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estados para la Búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Estados para las Categorías
  const [categorias, setCategorias] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    async function fetchCategorias() {
      const { data, error } = await supabase.from('categorias').select('*');
      if (!error && data) {
        setCategorias(data);
      }
    }
    fetchCategorias();
  }, []);

  useEffect(() => {
    const savedSearches = Cookies.get('lunatec_recent_searches');
    if (savedSearches) {
      try { setRecentSearches(JSON.parse(savedSearches)); } catch(e) {}
    }

    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearchToCookie = (query) => {
    if (!query || query.length < 2) return;
    let searches = [...recentSearches];
    searches = [query, ...searches.filter(q => q.toLowerCase() !== query.toLowerCase())].slice(0, 3);
    setRecentSearches(searches);
    Cookies.set('lunatec_recent_searches', JSON.stringify(searches), { expires: 30, path: '/' });
  };

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);

      const textoLimpio = searchQuery.trim();
      const sessionId = Cookies.get('lunatec_session_id');

      if (textoLimpio.length >= 2) {
        trackEvent('search_query', location.pathname, { query: textoLimpio, session_id: sessionId });
      }

      const termino = `%${textoLimpio}%`;

      const { data, error } = await supabase
        .from('productos')
        .select('*') 
        .or(`nombre.ilike.${termino},sku.ilike.${termino}`)
        .gt('stock_actual', 0)
        .limit(6);

      if (!error) setSearchResults(data || []);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, location.pathname]);

  const handleOpenCart = () => {
    setIsSidebarOpen(true);
    const sessionId = Cookies.get('lunatec_session_id');
    trackEvent('cart_open', location.pathname, { cart_count: cartCount, session_id: sessionId });
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== "") {
      const sessionId = Cookies.get('lunatec_session_id');
      trackEvent('search_query', location.pathname, { query: searchQuery.trim(), manual: true, session_id: sessionId });
      saveSearchToCookie(searchQuery.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const handleProductClick = (producto) => {
    setShowDropdown(false);
    saveSearchToCookie(searchQuery.trim());
    const sessionId = Cookies.get('lunatec_session_id');
    trackEvent('search_result_click', location.pathname, { 
      query_searched: searchQuery,
      product_clicked: producto.nombre,
      session_id: sessionId
    });
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-40 shadow-lg font-sans w-full">
      
      {/* BARRA SUPERIOR (Escritorio) */}
      <div className="bg-[#612A53] text-white/90 text-[10px] md:text-[11px] py-1.5 hidden md:block w-full">
        <div className="w-full px-4 md:px-6 flex justify-between items-center tracking-wider uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-brand-pink" /> Envíos en el día para Tucumán</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-pink" /> Compra 100% Segura</span>
          </div>
          <span className="font-bold">WhatsApp: +54 9 3815 13-5998</span>
        </div>
      </div>

      {/* NAVBAR PRINCIPAL */}
      <div className="bg-gradient-brand w-full">
        <div className="w-full px-4 md:px-6 py-3 md:py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3 md:gap-x-6">
          
          {/* LADO IZQUIERDO (Escritorio) / FILA SUPERIOR (Móvil) */}
          <div className="flex items-center justify-between md:justify-start w-full md:w-[25%] order-1 shrink-0 gap-2 md:gap-6">
            
            {/* 1. Botón Categorías (Izquierda en móvil, a la derecha del Logo en Escritorio usando 'order') */}
            <div className="relative shrink-0 order-1 md:order-2" ref={categoryRef}>
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`flex items-center justify-center gap-2 border w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 rounded-full text-white transition-all duration-300 shadow-sm outline-none ${
                  isCategoryOpen 
                    ? 'bg-white/20 border-white/40 ring-2 ring-white/20 scale-95' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20 hover:scale-105'
                }`}
              >
                <Menu size={20} className={`md:w-[18px] md:h-[18px] transition-transform duration-300 ${isCategoryOpen ? 'rotate-90' : ''}`} />
                <span className="hidden lg:inline font-display font-black uppercase text-xs tracking-tight">Categorías</span>
              </button>

              {/* Menú Desplegable de Categorías */}
              <div 
                className={`absolute top-full mt-3 w-[260px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] left-0 ${
                  isCategoryOpen 
                    ? 'opacity-100 scale-100 translate-y-0 visible' 
                    : 'opacity-0 scale-95 -translate-y-2 invisible'
                }`}
              >
                <div className="p-2">
                  <Link 
                    to="/" 
                    onClick={() => setIsCategoryOpen(false)}
                    className="block px-4 py-3 text-sm font-black text-brand-dark hover:bg-brand-pink/5 hover:text-brand-pink rounded-xl transition-colors uppercase tracking-tight"
                  >
                    Ver Todo el Catálogo
                  </Link>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  
                  {categorias.length > 0 ? (
                    <div className="max-h-[50vh] md:max-h-[350px] overflow-y-auto scrollbar-hide">
                      {categorias.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/categoria/${cat.id}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-brand-pink hover:bg-gray-50 rounded-xl transition-colors uppercase tracking-tight"
                        >
                          {cat.nombre}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-xs text-gray-400 font-medium flex flex-col items-center justify-center">
                      <div className="w-5 h-5 border-2 border-gray-200 border-t-brand-pink rounded-full animate-spin mb-2"></div>
                      Cargando categorías...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Logo (Centro absoluto en móvil gracias a flex-1, a la izquierda en Escritorio) */}
            <Link to="/" className="flex-1 md:flex-none flex justify-center md:justify-start order-2 md:order-1 transition-transform hover:scale-105 shrink-0 block">
              <img src="/logo.png" alt="LunaTec Logo" className="h-7 md:h-12 object-contain drop-shadow-lg" />
            </Link>

            {/* 3. Botón Carrito MÓVIL (Aparece a la derecha en celular, completamente oculto en Escritorio) */}
            <button onClick={handleOpenCart} className="md:hidden order-3 relative flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all shadow-sm shrink-0">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-brand-dark text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg border border-brand-pink font-display">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* CENTRO: Buscador */}
          <div ref={searchRef} className="w-full md:w-[50%] relative order-3 md:order-2 px-0 md:px-4">
            <div className="relative w-full max-w-3xl mx-auto">
              <input 
                type="text" 
                placeholder="Estoy buscando..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-white text-gray-900 border-none rounded-full py-2.5 md:py-2.5 pl-5 pr-12 outline-none focus:ring-4 focus:ring-white/40 shadow-md transition-all text-sm font-medium font-sans"
              />
              {searchQuery.length > 0 ? (
                <button onClick={() => { setSearchQuery(""); setShowDropdown(false); }} className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <X size={16} strokeWidth={3} />
                </button>
              ) : (
                <button onClick={handleSearchSubmit} className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-brand-pink hover:bg-brand-dark text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Search size={16} strokeWidth={3} />
                </button>
              )}
            </div>

            {/* Dropdown Resultados... */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 flex flex-col max-w-3xl mx-auto">
                {searchQuery.length === 0 && recentSearches.length > 0 && (
                  <div className="p-2 border-b border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1">Búsquedas recientes</p>
                    {recentSearches.map((query, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => { setSearchQuery(query); setShowDropdown(true); }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-pink flex items-center gap-2 rounded-lg"
                      >
                        <Clock size={14} /> {query}
                      </button>
                    ))}
                  </div>
                )}

                {isSearching ? (
                  <div className="p-4 text-center text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Buscando...</div>
                ) : searchQuery.length > 0 && searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-50 max-h-[350px] overflow-y-auto">
                    {searchResults.map(prod => (
                      <Link key={prod.id} to={`/producto/${prod.id}`} onClick={() => handleProductClick(prod)} className="flex items-center gap-4 p-3 hover:bg-brand-pink/5 transition-colors group">
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex-shrink-0 p-1 overflow-hidden group-hover:border-brand-pink/30">
                           <ImagenOptimizada codigo={prod.imagen_codigo || prod.sku} alt={prod.nombre} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 text-left">
                           <p className="text-xs font-bold text-gray-800 line-clamp-1 uppercase tracking-tight group-hover:text-brand-pink transition-colors">{prod.nombre}</p>
                           <p className="text-[#73A839] font-mono font-black text-sm tracking-tighter mt-0.5">${Number(prod.precio_venta || 0).toLocaleString('es-AR')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.length > 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm font-bold text-gray-800 uppercase tracking-tight mb-1">Sin resultados con stock</p>
                    <p className="text-xs text-gray-500 font-medium">No encontramos nada disponible para "{searchQuery}"</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* LADO DERECHO: Carrito ESCRITORIO (Oculto en celular, aparece como pastilla grande a la derecha en PC) */}
          <div className="hidden md:flex items-center justify-end w-full md:w-[25%] order-2 md:order-3 shrink-0">
            <button onClick={handleOpenCart} className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 p-2 md:px-5 md:py-2.5 rounded-full text-white transition-all shadow-sm group">
              <ShoppingCart size={22} className="md:w-[20px] md:h-[20px] group-hover:scale-110 transition-transform" />
              <span className="font-display font-black text-xs uppercase tracking-tight hidden sm:block">Mi Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-brand-dark text-[10px] md:text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-brand-pink font-display">
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