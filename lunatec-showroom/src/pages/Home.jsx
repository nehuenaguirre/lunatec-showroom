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

  // URLs de tus banners (Reemplazá con tus links de Supabase)
  const BANNER_PRINCIPAL = "https://qwyoqfcaepmqzdzzwmlh.supabase.co/storage/v1/object/public/images/banner1.webp";
  const BANNER_SECUNDARIO = "https://qwyoqfcaepmqzdzzwmlh.supabase.co/storage/v1/object/public/images/banner3.webp";

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
    <div className="py-8 bg-gray-50 min-h-screen">
      {/* SECCIÓN DE BANNERS */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        {/* Cambiamos flex-col md:flex-row a block md:flex para que en mobile ocupe el ancho completo */}
        <div className="block md:flex gap-4">
          
          {/* Banner Principal (Se adapta al ancho de la imagen gigante) */}
          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-md group border-2 border-brand-pink/20 bg-white mb-4 md:mb-0">
            {/* ACÁ ESTÁ EL CAMBIO: w-full h-auto y object-contain para encuadre total */}
            <img 
              src={BANNER_PRINCIPAL} 
              alt="Promoción Principal" 
              className="w-full h-auto object-contain object-center transition-transform duration-700 group-hover:scale-105"
              loading="eager" // Se carga de inmediato por ser lo primero que se ve
            />
          </div>

          {/* Banner Secundario (Visible en desktop, mantiene un tamaño fijo) */}
          <div className="hidden md:block w-1/3 h-[200px] md:h-auto relative rounded-2xl overflow-hidden shadow-md group">
            <img 
              src={BANNER_SECUNDARIO} 
              alt="Promoción Secundaria" 
              // En este mantenemos object-cover porque es más decorativo
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide">Explorar Categorías</h3>
      </div>

      <CategoryGrid categorias={categorias} />

      <div className="max-w-7xl mx-auto px-4 mt-12 mb-8" id="catalogo">
        <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-wide">
          Catálogo General
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

            {/* Controles de Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className={`p-2 rounded border flex items-center justify-center transition-all ${
                    paginaActual === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-white text-gray-800 hover:border-brand-pink hover:text-brand-pink"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="font-bold text-gray-600 text-sm">
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button
                  onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className={`p-2 rounded border flex items-center justify-center transition-all ${
                    paginaActual === totalPaginas ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-white text-gray-800 hover:border-brand-pink hover:text-brand-pink"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}