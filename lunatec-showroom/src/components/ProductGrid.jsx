// src/components/ProductGrid.jsx
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGrid({ productos, numero, paginaActual, totalPaginas, setPaginaActual }) {
  
  const irArribaCatalogo = () => {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="catalogo" className="py-12 md:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 md:mb-12 text-center">NUESTROS PRODUCTOS</h3>
        
        {/* GRILLA CORREGIDA: grid-cols-2 para móviles, gap más chico en móviles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mb-12">
          {productos.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl md:rounded-3xl p-2 md:p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              
              <div className="aspect-square rounded-xl md:rounded-2xl bg-gray-100 overflow-hidden mb-3 md:mb-5 relative">
                <img 
                  src={`/productos/${p.sku}.png`} 
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/400?text=LunaTec'}}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  alt={p.nombre} 
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-green-600 text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-sm">
                  Stock
                </div>
              </div>
              
              <div className="flex-grow flex flex-col">
                <p className="text-[9px] md:text-[10px] font-mono text-gray-400 mb-1 line-clamp-1">SKU: {p.sku}</p>
                {/* Título más chico en celular */}
                <h4 className="font-bold text-gray-900 text-xs md:text-lg mb-1 md:mb-2 line-clamp-2 leading-tight">{p.nombre}</h4>
                <p className="hidden md:block text-gray-500 text-xs line-clamp-2 mb-4">{p.descripcion}</p>
                
                <div className="mt-auto pt-2 md:pt-4 border-t border-gray-50">
                  <span className="text-lg md:text-2xl font-black text-gray-900">${p.precio_venta.toLocaleString('es-AR')}</span>
                </div>
              </div>
              
              <a 
                href={`https://wa.me/${numero}?text=Hola! Me interesa el producto: ${p.nombre} (SKU: ${p.sku})`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 md:mt-4 w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-2 md:py-3 rounded-lg md:rounded-xl font-bold flex items-center justify-center gap-1 md:gap-2 transition-all shadow-md text-xs md:text-base"
              >
                <MessageCircle size={16} className="w-4 h-4 md:w-5 md:h-5" /> 
                <span className="hidden sm:inline">Consultar</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </div>
          ))}
        </div>

        {/* CONTROLES DE PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 md:gap-6 mt-8">
            <button 
              onClick={() => { if (paginaActual > 1) { setPaginaActual(paginaActual - 1); irArribaCatalogo(); } }}
              disabled={paginaActual === 1}
              className={`p-2 md:p-3 rounded-full flex items-center justify-center transition-all ${paginaActual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 shadow-md hover:shadow-lg hover:text-blue-600 border border-gray-200'}`}
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="font-bold text-gray-600 bg-gray-100 px-4 md:px-6 py-2 rounded-full text-xs md:text-base">
              Pág. {paginaActual} de {totalPaginas}
            </span>
            
            <button 
              onClick={() => { if (paginaActual < totalPaginas) { setPaginaActual(paginaActual + 1); irArribaCatalogo(); } }}
              disabled={paginaActual === totalPaginas}
              className={`p-2 md:p-3 rounded-full flex items-center justify-center transition-all ${paginaActual === totalPaginas ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 shadow-md hover:shadow-lg hover:text-blue-600 border border-gray-200'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}