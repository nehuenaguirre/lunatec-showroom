import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const PRODUCTOS_POR_PAGINA = 20;
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const BANNER_PRINCIPAL = "https://qwyoqfcaepmqzdzzwmlh.supabase.co/storage/v1/object/public/images/banner1.webp";
  const BANNER_SECUNDARIO = "https://qwyoqfcaepmqzdzzwmlh.supabase.co/storage/v1/object/public/images/banner3.webp";
  const BANNER_FOOTER = "https://qwyoqfcaepmqzdzzwmlh.supabase.co/storage/v1/object/public/images/banner5.webp";

  useEffect(() => {
    async function fetchCategorias() {
      const { data } = await supabase.from('categorias').select('*');
      if (data) setCategorias(data);
    }
    fetchCategorias();
  }, []);

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      const { count } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .gt('stock_actual', 0);
        
      if (count !== null) {
        setTotalPaginas(Math.ceil(count / PRODUCTOS_POR_PAGINA));
      }

      const from = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
      const to = from + PRODUCTOS_POR_PAGINA - 1;

      const { data } = await supabase
        .from('productos')
        .select('*')
        .gt('stock_actual', 0)
        .order('id', { ascending: false })
        .range(from, to);

      if (data) setProductos(data);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    fetchProductos();
  }, [paginaActual]);

  return (
    <div className="py-8 bg-gray-50 min-h-screen font-sans"> {/* Fuente base Inter */}
      
      {/* SECCIÓN DE BANNERS */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="block md:flex gap-4">
          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-md group border-2 border-brand-pink/20 bg-white mb-4 md:mb-0">
            <img 
              src={BANNER_PRINCIPAL} 
              alt="Promoción Principal" 
              className="w-full h-auto object-contain object-center transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
          </div>

          <div className="hidden md:block w-1/3 h-[200px] md:h-auto relative rounded-2xl overflow-hidden shadow-md group">
            <img 
              src={BANNER_SECUNDARIO} 
              alt="Promoción Secundaria" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* TÍTULO SECCIÓN: EXPLORAR CATEGORÍAS */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h3 className="text-xl md:text-2xl font-display font-black text-gray-900 uppercase tracking-tighter">
          Explorar Categorías
        </h3>
      </div>

      <CategoryGrid categorias={categorias} />

      {/* CATÁLOGO GENERAL */}
      <div className="max-w-7xl mx-auto px-4 mt-16 mb-8" id="catalogo">
        {/* TÍTULO SECCIÓN: PRODUCTOS DESTACADOS */}
        <h3 className="text-xl md:text-2xl font-display font-black text-gray-900 mb-8 uppercase tracking-tighter border-l-4 border-brand-pink pl-4">
          Productos Destacados
        </h3>
        
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {productos.map(prod => (
                <ProductCard key={prod.id} producto={prod} />
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16 mb-16">
                <button
                  onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="p-2 rounded-xl border-2 bg-white text-gray-800 hover:border-brand-pink hover:text-brand-pink transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={24} />
                </button>

                <span className="font-display font-bold text-gray-900 text-sm uppercase tracking-widest bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button
                  onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="p-2 rounded-xl border-2 bg-white text-gray-800 hover:border-brand-pink hover:text-brand-pink transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}

            {/* Banner Final */}
            <div className="max-w-7xl mx-auto mt-20 mb-12">
              <div className="w-full overflow-hidden rounded-2xl flex justify-center">
                <img 
                  src={BANNER_FOOTER} 
                  alt="Promoción Final" 
                  className="w-full h-auto block rounded-2xl transition-transform duration-500 hover:scale-[1.01]"
                  loading="lazy"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}