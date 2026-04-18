import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row justify-between gap-8">
        
        {/* Info Marca */}
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <img 
              src="/logo1.png" 
              alt="LunaTec Logo" 
              className="h-10 w-auto object-contain" 
            />
          </div>

          {/* Instagram - SVG Manual */}
          <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <a 
              href="https://www.instagram.com/lunatec.tuc/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#E95B7F] transition-colors font-medium"
            >
              @lunatec.tuc
            </a>
          </div>

          
          {/* WhatsApp - Icono Oficial */}
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <svg 
              viewBox="0 0 24 24" 
              width="18" 
              height="18" 
              fill="currentColor" 
              className="text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.434h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <a 
              href="https://wa.me/5493815135998" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-600 transition-colors font-medium"
            >
              +54 9 3815 13-5998
            </a>
          </div>
        </div>

        {/* Links Útiles */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Links útiles</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-[#E95B7F] transition-colors">Inicio</Link></li>
            <li><Link to="/como-comprar" className="hover:text-[#E95B7F] transition-colors">Cómo comprar</Link></li>
            <li><Link to="/garantias" className="hover:text-[#E95B7F] transition-colors">Garantías</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} LUNATEC. Todos los derechos reservados.
      </div>
    </footer>
  );
}