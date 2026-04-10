// src/components/Header.jsx
import { Search } from 'lucide-react';

export default function Header({ numero, busqueda, setBusqueda }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <a href="#inicio" className="flex items-center flex-shrink-0">
          <img src="/logo.png" alt="LunaTec" className="h-8 md:h-12 w-auto object-contain" />
        </a>

        {/* MENÚ DE TEXTO (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 font-bold text-gray-600 text-sm">
          <a href="#inicio" className="hover:text-blue-600 transition-colors">Inicio</a>
          <a href="#ofertas" className="hover:text-red-500 transition-colors">Ofertas</a>
          <a href="#catalogo" className="hover:text-blue-600 transition-colors">Catálogo</a>
          <a href="#contacto" className="hover:text-blue-600 transition-colors">Contacto</a>
        </nav>

        {/* BUSCADOR (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-sm relative ml-auto">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>

        {/* BOTÓN WHATSAPP */}
        <a 
          href={`https://wa.me/${numero}?text=Hola!%20Vengo%20de%20la%20web,%20quiero%20hacer%20una%20consulta`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-sm flex-shrink-0"
        >
          <span>WhatsApp</span>
        </a>
      </div>
      
      {/* SECCIÓN MÓVIL (Buscador + Menú deslizable) */}
      <div className="md:hidden bg-white/95 px-4 pb-3 border-t border-gray-50 pt-2">
        <div className="relative mb-3">
          <input 
            type="text" 
            placeholder="Buscar por nombre o SKU..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
        
        {/* Menú horizontal deslizable para celulares */}
        <nav className="flex items-center gap-6 overflow-x-auto text-xs font-bold text-gray-500 pb-1 snap-x">
          <a href="#inicio" className="snap-start whitespace-nowrap hover:text-blue-600">Inicio</a>
          <a href="#ofertas" className="snap-start whitespace-nowrap text-red-500">🔥 Ofertas</a>
          <a href="#catalogo" className="snap-start whitespace-nowrap hover:text-blue-600">Catálogo</a>
          <a href="#contacto" className="snap-start whitespace-nowrap hover:text-blue-600">Contacto</a>
        </nav>
      </div>
    </header>
  );
}