// src/components/Promociones.jsx
import { MessageCircle, Zap } from 'lucide-react';

export default function Promociones({ ofertas, numero }) {
  if (!ofertas || ofertas.length === 0) return null;

  return (
    <section id="ofertas" className="py-12 bg-gradient-to-b from-red-50 to-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="text-red-500 fill-red-500" size={28} />
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase">Ofertas por Tiempo Limitado</h3>
        </div>
        
        {/* Carrusel horizontal (Swipeable en celulares) */}
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory">
          {ofertas.map((p) => (
            <div key={`oferta-${p.id}`} className="snap-start flex-shrink-0 w-64 md:w-72 bg-white rounded-3xl p-3 md:p-4 border-2 border-red-100 shadow-lg relative flex flex-col group">
              
              {/* Etiqueta de Fuego */}
              <div className="absolute -top-3 -right-3 bg-red-500 text-white font-black text-xs px-4 py-1 rounded-full shadow-md z-10 transform rotate-3">
                LIQUIDACIÓN
              </div>

              <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden mb-4 relative">
                <img 
                  src={`/productos/${p.sku}.png`} 
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/400?text=LunaTec'}}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={p.nombre} 
                />
              </div>
              
              <div className="flex-grow flex flex-col">
                <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1 line-clamp-2">{p.nombre}</h4>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-xl md:text-2xl font-black text-red-600">${p.precio_venta.toLocaleString('es-AR')}</span>
                </div>
              </div>
              
              <a 
                href={`https://wa.me/${numero}?text=Hola! Quiero aprovechar la OFERTA del producto: ${p.nombre} (SKU: ${p.sku})`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-sm"
              >
                <MessageCircle size={18} /> Lo quiero
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}