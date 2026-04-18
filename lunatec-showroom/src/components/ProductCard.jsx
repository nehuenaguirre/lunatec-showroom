import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import ImagenOptimizada from './ImagenOptimizada';
import { trackEvent } from '../utils/analytics'; // <-- IMPORTAMOS LA ANALÍTICA

export default function ProductCard({ producto }) {
  const { addToCart } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const location = useLocation(); // Para saber en qué página estaba cuando hizo clic
  const codigoImagen = (producto.imagen_codigo || producto.ean || producto.sku || "").toString().trim();

  // Función para registrar cuando hacen clic en la tarjeta
  const handleProductClick = () => {
    trackEvent('product_click', location.pathname, { 
      product_name: producto.nombre 
    }, producto.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    addToCart(producto, cantidad);
    
    // Función para registrar que añadieron al carrito
    trackEvent('add_to_cart_catalog', location.pathname, { 
      product_name: producto.nombre,
      quantity: cantidad,
      price: producto.precio_venta
    }, producto.id);

    setCantidad(1); 
  };

  return (
    <div className="bg-white group transition-all duration-300 border border-gray-100 hover:border-brand-pink/30 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full relative rounded-xl overflow-hidden">
      
      {/* 1. Contenedor de Imagen (Agregamos onClick) */}
      <Link to={`/producto/${producto.id}`} onClick={handleProductClick} className="block relative aspect-square bg-white border-b border-gray-100 overflow-hidden">
        <ImagenOptimizada 
          codigo={codigoImagen} 
          alt={producto.nombre} 
          width={300} 
          className="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-80 p-2"
        />
        
        {producto.stock_actual <= 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter shadow-md">
              Agotado
            </span>
          </div>
        )}
      </Link>

      {/* 2. Información del Producto */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        {/* Título (Agregamos onClick) */}
        <Link to={`/producto/${producto.id}`} onClick={handleProductClick}>
          <h3 className="font-bold text-gray-800 text-[10px] md:text-xs leading-tight uppercase line-clamp-2 hover:text-brand-pink transition-colors mb-2 min-h-[2rem]">
            {producto.nombre}
          </h3>
        </Link>
        
        {/* 3. Precio */}
        <div className="mt-auto mb-3">
          <span className="font-mono text-lg md:text-xl font-black tracking-tighter text-[#73A839]">
            ${Number(producto.precio_venta || 0).toLocaleString('es-AR')}
          </span>
        </div>

        {/* 4. Selector de Cantidad y Botón */}
        <div className="flex items-stretch h-8 md:h-9 w-full rounded-lg overflow-hidden border border-brand-pink/20">
          {producto.stock_actual > 0 ? (
            <>
              <div className="flex items-center justify-between bg-brand-pink text-white w-14 md:w-16 shrink-0 px-1.5">
                <button onClick={(e) => { e.preventDefault(); setCantidad(Math.max(1, cantidad - 1)); }} className="hover:scale-125 transition-transform">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-[10px] md:text-xs">{cantidad}</span>
                <button onClick={(e) => { e.preventDefault(); setCantidad(Math.min(producto.stock_actual, cantidad + 1)); }} className="hover:scale-125 transition-transform">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart} 
                className="flex-grow bg-brand-pink hover:bg-brand-dark text-white font-bold text-[9px] md:text-[10px] uppercase transition-colors"
              >
                Añadir
              </button>
            </>
          ) : (
            <div className="w-full bg-gray-100 text-gray-400 font-bold text-[9px] flex items-center justify-center uppercase">
              Agotado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}