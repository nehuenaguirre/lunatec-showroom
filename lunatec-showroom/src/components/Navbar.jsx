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
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchRef = useRef(null);

  useEffect(() => {
    // Cargar búsquedas recientes de la cookie
    const savedSearches = Cookies.get('lunatec_recent_searches');
    if (savedSearches) {
      try { setRecentSearches(JSON.parse(savedSearches)); } catch(e) {}
    }

    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
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
    <header className="sticky top-0 z-40 shadow-lg font-sans">
      <div className="bg-[#612A53] text-white/90 text-[10px] md:text-[11px] py-1.5 px-4 font-medium hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wider uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-brand-pink" /> Envíos en el día para Tucumán</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-pink" /> Compra 100% Segura</span>
          </div>
          <span className="font-bold">WhatsApp: +54 9 3815 13-5998</span>
        </div>
      </div>

      <div className="bg-gradient-brand">
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
          <div className="w-full flex items-center justify-between md:contents">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 p-2 md:px-3 md:py-2 rounded-full text-white transition-all shadow-sm order-1 md:order-3">
              <Menu size={22} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden lg:inline font-display font-black uppercase text-xs tracking-tight">Categorías</span>
            </button>

            <Link to="/" className="transition-transform hover:scale-105 order-2 md:order-1 flex justify-center">
              <img src="/logo.png" alt="LunaTec Logo" className="h-9 md:h-12 object-contain drop-shadow-lg transform md:scale-150 md:origin-left" />
            </Link>

            <button onClick={handleOpenCart} className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 p-2 md:px-4 md:py-2 rounded-full text-white transition-all shadow-sm group order-3 md:order-4">
              <ShoppingCart size={22} className="md:w-[20px] md:h-[20px] group-hover:scale-110 transition-transform" />
              <span className="font-display font-black text-xs uppercase tracking-tight hidden sm:block">Mi Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-brand-dark text-[10px] md:text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-brand-pink font-display">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div ref={searchRef} className="flex-grow w-full md:max-w-2xl relative order-last md:order-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Estoy buscando..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-white text-gray-900 border-none rounded-full py-2 md:py-2.5 pl-5 pr-12 outline-none focus:ring-4 focus:ring-white/40 shadow-md transition-all text-sm font-medium font-sans"
              />
              {searchQuery.length > 0 ? (
                <button onClick={() => { setSearchQuery(""); setShowDropdown(false); }} className="absolute right-1 top-1 bottom-1 aspect-square bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <X size={16} strokeWidth={3} />
                </button>
              ) : (
                <button onClick={handleSearchSubmit} className="absolute right-1 top-1 bottom-1 aspect-square bg-brand-pink hover:bg-brand-dark text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Search size={16} strokeWidth={3} />
                </button>
              )}
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 flex flex-col">
                
                {/* Lógica de Búsquedas Recientes desde la Cookie */}
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
        </div>
      </div>
    </header>
  );
}