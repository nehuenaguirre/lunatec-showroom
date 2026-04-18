import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '../supabase';
import { CartContext } from '../context/CartContext';
import ImagenOptimizada from '../components/ImagenOptimizada'; // Importamos tu componente

export default function ProductDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchProducto() {
      const { data } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data) setProducto(data);
      setLoading(false);
    }
    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">Producto no encontrado</h2>
        <Link to="/" className="px-6 py-3 bg-brand-pink text-white rounded-xl font-bold hover:bg-brand-dark transition-all">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // Definimos qué código usar para la imagen (SKU o imagen_codigo)
  const codigoImagen = (producto.imagen_codigo || producto.sku || "").toString().trim();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-brand-pink font-bold mb-8 transition-colors group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
        VOLVER AL CATÁLOGO
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        
        {/* Imagen Optimizada para Detalle (Usa la carpeta /800/) */}
        <div className="bg-white rounded-3xl p-4 md:p-12 border border-gray-100 shadow-sm flex items-center justify-center aspect-square overflow-hidden">
          <ImagenOptimizada 
            codigo={codigoImagen} 
            alt={producto.nombre} 
            width={800} // Esto le dice al componente que busque en la carpeta /800/
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info del Producto */}
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
              SKU: {producto.sku || 'N/A'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-4 leading-tight uppercase tracking-tight">
              {producto.nombre}
            </h1>
          </div>
          
          {/* Precio con fuente mono (estilo ticket) como pediste antes */}
          <div className="text-5xl font-mono font-black text-[#73A839] mb-8 pb-8 border-b border-gray-100 tracking-tighter">
            ${Number(producto.precio_venta).toLocaleString("es-AR")}
          </div>

          <div className="prose prose-sm mb-10">
            <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">Descripción</h4>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
              {producto.descripcion || "Este producto no tiene una descripción detallada todavía."}
            </p>
          </div>
          
          <div className="mt-auto space-y-4">
            {producto.stock_actual > 0 ? (
              <>
                <button
                  onClick={() => addToCart(producto, 1)}
                  className="w-full py-5 bg-brand-pink hover:bg-brand-dark text-white rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-pink/20 uppercase tracking-wide"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Añadir al carrito
                </button>
                
                <a
                  href={`https://wa.me/5493810000000?text=Hola! Me interesa el producto: ${producto.nombre.toUpperCase()} (SKU: ${producto.sku})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-6 h-6" />
                  Consultar por WhatsApp
                </a>
              </>
            ) : (
              <div className="w-full py-5 bg-gray-100 text-gray-400 rounded-2xl font-black text-xl text-center cursor-not-allowed uppercase border-2 border-dashed border-gray-200">
                Agotado temporalmente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}