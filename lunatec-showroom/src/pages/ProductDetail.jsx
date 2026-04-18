import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '../supabase';
import { CartContext } from '../context/CartContext';
import ImagenOptimizada from '../components/ImagenOptimizada';

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
        <h2 className="text-2xl font-display font-black text-gray-800 mb-4 tracking-tighter uppercase">Producto no encontrado</h2>
        <Link to="/" className="px-6 py-3 bg-brand-pink text-white rounded-xl font-display font-black uppercase tracking-tight hover:bg-brand-dark transition-all">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const codigoImagen = (producto.imagen_codigo || producto.sku || "").toString().trim();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 font-sans">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-brand-pink font-display font-black text-xs tracking-widest mb-8 transition-colors group uppercase">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        
        {/* Imagen */}
        <div className="bg-white rounded-3xl p-4 md:p-12 border border-gray-100 shadow-sm flex items-center justify-center aspect-square overflow-hidden">
          <ImagenOptimizada 
            codigo={codigoImagen} 
            alt={producto.nombre} 
            width={800} 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info del Producto */}
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <span className="bg-gray-100 text-gray-500 text-[10px] font-mono font-bold px-2 py-1 rounded uppercase tracking-widest">
              SKU: {producto.sku || 'N/A'}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mt-4 leading-none uppercase tracking-tighter">
              {producto.nombre}
            </h1>
          </div>
          
          {/* Precio Mono */}
          <div className="text-5xl md:text-6xl font-mono font-black text-[#73A839] mb-8 pb-8 border-b border-gray-100 tracking-tighter">
            ${Number(producto.precio_venta).toLocaleString("es-AR")}
          </div>

          <div className="mb-10">
            <h4 className="text-gray-400 uppercase text-[10px] font-display font-black tracking-widest mb-4">Descripción del producto</h4>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium">
              {producto.descripcion || "Este producto no tiene una descripción detallada todavía."}
            </p>
          </div>
          
          <div className="mt-auto space-y-4">
            {producto.stock_actual > 0 ? (
              <>
                <button
                  onClick={() => addToCart(producto, 1)}
                  className="w-full py-5 bg-brand-pink hover:bg-brand-dark text-white rounded-2xl font-display font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-pink/20 uppercase tracking-tighter"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Añadir al carrito
                </button>
                
                <a
                  href={`https://wa.me/5493815135998?text=Hola! Me interesa el producto: ${producto.nombre.toUpperCase()} (SKU: ${producto.sku})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-2xl font-display font-black text-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-tighter"
                >
                  <MessageCircle className="w-6 h-6" />
                  Consultar por WhatsApp
                </a>
              </>
            ) : (
              <div className="w-full py-5 bg-gray-100 text-gray-400 rounded-2xl font-display font-black text-xl text-center cursor-not-allowed uppercase border-2 border-dashed border-gray-200 tracking-tighter">
                Agotado temporalmente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}