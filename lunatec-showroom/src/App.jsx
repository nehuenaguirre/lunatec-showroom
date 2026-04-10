// src/App.jsx
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import Promociones from './components/Promociones';
import Features from './components/Features';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import ConversionBlock from './components/ConversionBlock';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  
  const [paginaActual, setPaginaActual] = useState(1);
  const PRODUCTOS_POR_PAGINA = 24;

  const TELEFONO_VENTAS = "5493810000000"; 
  const MENSAJE_DEFAULT = "Hola! Quiero hacer una consulta sobre los productos de LunaTec.";

  useEffect(() => {
    async function fetchDatos() {
      const { data: catData } = await supabase.from('categorias').select('*');
      if (catData) setCategorias(catData);

      const { data: prodData } = await supabase.from('productos').select('*');
      if (prodData) setProductos(prodData);

      setLoading(false);
    }
    fetchDatos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaActiva]);

  const productosFiltrados = productos.filter(p => {
    const tieneStock = p.stock_actual > 0;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                             p.sku.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === 'Todas' || p.categoria_id === categoriaActiva;
    return tieneStock && coincideBusqueda && coincideCategoria;
  });

  // Para simular "Ofertas", tomamos los primeros 6 productos con stock
  const productosEnOferta = productos.filter(p => p.stock_actual > 0).slice(0, 6);

  const indiceUltimoProducto = paginaActual * PRODUCTOS_POR_PAGINA;
  const indicePrimerProducto = indiceUltimoProducto - PRODUCTOS_POR_PAGINA;
  const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div></div>;

  return (
    <div id="inicio" className="min-h-screen bg-white font-sans flex flex-col scroll-smooth">
      <Header numero={TELEFONO_VENTAS} busqueda={busqueda} setBusqueda={setBusqueda} />
      
      <main className="flex-grow">
        <Hero numero={TELEFONO_VENTAS} />
        
        {/* SECCIÓN OFERTAS / PROMOCIONES */}
        {busqueda === '' && categoriaActiva === 'Todas' && (
          <Promociones ofertas={productosEnOferta} numero={TELEFONO_VENTAS} />
        )}
        
        {categorias.length > 0 && (
          <div id="categorias" className="scroll-mt-24">
            <CategoryGrid 
              categorias={categorias} 
              categoriaActiva={categoriaActiva} 
              setCategoriaActiva={setCategoriaActiva} 
            />
          </div>
        )}
        
        <Features />
        
        {productosFiltrados.length > 0 ? (
          <ProductGrid 
            productos={productosPaginados} 
            numero={TELEFONO_VENTAS}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            setPaginaActual={setPaginaActual}
          />
        ) : (
          <div className="py-32 text-center text-gray-500 bg-gray-50">
            <p className="text-xl font-bold mb-2">No encontramos resultados</p>
            <p>Probá buscando con otras palabras o limpiando los filtros.</p>
            <button 
              onClick={() => {setBusqueda(''); setCategoriaActiva('Todas');}}
              className="mt-4 text-blue-600 underline font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <div id="contacto">
          <ConversionBlock numero={TELEFONO_VENTAS} />
        </div>
      </main>

      <Footer />
      <WhatsAppButton numero={TELEFONO_VENTAS} mensaje={MENSAJE_DEFAULT} />
    </div>
  );
}