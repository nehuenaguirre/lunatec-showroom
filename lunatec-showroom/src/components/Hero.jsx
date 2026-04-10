// src/components/Hero.jsx
import { MessageCircle, ArrowRight } from 'lucide-react'

export default function Hero({ numero }) {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${numero}?text=Hola! Quiero más información sobre los productos.`, '_blank')
  }

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12">
        
        {/* TEXTO - IZQUIERDA */}
        <div className="flex-1 text-center md:text-left z-10">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Catálogo <span className="text-brand">LUNATEC</span> al mejor precio
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Comprá fácil por WhatsApp – atención personalizada y respuesta rápida
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#catalogo" className="bg-brand hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200">
              Ver catálogo <ArrowRight size={20} />
            </a>
            <button 
              onClick={handleWhatsApp}
              className="bg-whatsapp hover:bg-whatsappHover text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
            >
              <MessageCircle size={20} /> Consultar por WhatsApp
            </button>
          </div>
        </div>

        {/* IMAGEN - DERECHA */}
        <div className="flex-1 relative w-full max-w-lg md:max-w-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <img 
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop" 
            alt="Productos destacados"
            className="relative rounded-3xl shadow-2xl object-cover w-full h-[300px] md:h-[500px]"
          />
        </div>

      </div>
    </section>
  )
}