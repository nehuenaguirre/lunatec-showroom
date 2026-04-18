import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react'; // Quitamos el ícono Check porque ya no mostramos el stock
import { CartContext } from '../context/CartContext';
import ImagenOptimizada from './ImagenOptimizada';

export default function ProductCard({ producto }) {
  const { addToCart } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const codigoImagen = (producto.imagen_codigo || producto.ean || producto.sku || "").toString().trim();

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    addToCart(producto, cantidad);
    setCantidad(1); 
  };

  return (
    /* NUEVA ANIMACIÓN: hover:-translate-y-1 eleva la tarjeta sutilmente hacia arriba en lugar de hacer zoom */
    <div className="bg-white group transition-all duration-300 border border-gray-100 hover:border-brand-pink/30 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full relative rounded-xl overflow-hidden">
      
      {/* 1. Contenedor de Imagen */}
      <Link to={`/producto/${producto.id}`} className="block relative aspect-square bg-white border-b border-gray-100 overflow-hidden">
        <ImagenOptimizada 
          codigo={codigoImagen} 
          alt={producto.nombre} 
          width={300} 
          // Quitamos el scale que rompía los bordes. Ahora solo baja un poco la opacidad al pasar el mouse
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
        <Link to={`/producto/${producto.id}`}>
          <h3 className="font-bold text-gray-800 text-[10px] md:text-xs leading-tight uppercase line-clamp-2 hover:text-brand-pink transition-colors mb-2 min-h-[2rem]">
            {producto.nombre}
          </h3>
        </Link>
        
        {/* Aquí eliminamos por completo la sección que decía la cantidad de stock */}

        {/* 3. Precio con Nueva Fuente */}
        <div className="mt-auto mb-3">
          {/* font-mono le da un estilo de números de caja registradora, tracking-tighter los junta para que impacte más */}
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