// src/components/ConversionBlock.jsx
import { MessageCircle } from 'lucide-react';

export default function ConversionBlock({ numero }) {
  return (
    <section className="bg-blue-600 py-20 relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        {/* TÍTULO Y SUBTÍTULO ORIGINALES */}
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          ¿Necesitás ayuda o querés comprar?
        </h2>
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          No des más vueltas. Escribinos ahora y te respondemos al instante con precios, stock y envíos.
        </p>
        
        {/* --- NUEVA SECCIÓN DE ASESORES --- */}
        <div className="mt-12 mb-14 bg-blue-700/40 p-6 md:p-8 rounded-[2rem] border border-blue-500/50 inline-block">
          <p className="text-blue-100 text-sm font-semibold mb-6">
            Contactate con nuestros asesores:
          </p>
          
          {/* Contenedor de las 2 imágenes */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* Asesora 1 - Agos */}
            <div className="relative group">
              <img 
                src="/agos.png" 
                alt="Asesora Agos" 
                // Aplicamos proporción 2.5 base x 1 altura. 
                // Alto h-14 (56px) en móvil, h-16 (64px) en PC.
                className="h-14 md:h-16 aspect-[2.5/1] object-contain rounded-xl shadow-lg border-2 border-white/20 transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none'; // Oculta si no encuentra la imagen
                  console.error("No se encontró public/agos.png");
                }}
              />
            </div>

            {/* Asesora 2 - Maria */}
            <div className="relative group">
              <img 
                src="/maria.png" 
                alt="Asesora Maria" 
                className="h-14 md:h-16 aspect-[2.5/1] object-contain rounded-xl shadow-lg border-2 border-white/20 transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.error("No se encontró public/maria.png");
                }}
              />
            </div>
          </div>
        </div>
        {/* --- FIN SECCIÓN ASESORES --- */}
        
        {/* BOTÓN WHATSAPP ORIGINAL */}
        <a 
          href={`https://wa.me/${numero}?text=Hola! Llegué al final de la página y necesito ayuda con un producto.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex bg-[#25D366] hover:bg-white text-white hover:text-[#25D366] px-10 py-5 rounded-full font-black text-lg items-center gap-3 transition-all duration-300 shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.4)] transform hover:-translate-y-1"
        >
          <MessageCircle size={24} /> Hablar por WhatsApp
        </a>
      </div>
    </section>
  );
}