import { Link, useLocation } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';
import { trackEvent } from '../utils/analytics';

export default function Footer() {
  const location = useLocation();

  const handleSocialClick = (network) => {
    const sessionId = Cookies.get('lunatec_session_id');
    trackEvent('social_click', location.pathname, { network: network, session_id: sessionId });
  };

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="mb-6 block transition-transform hover:scale-105">
              <img 
                src="/logo.png" 
                alt="LunaTec Logo" 
                className="h-12 md:h-14 w-auto object-contain mx-auto md:mx-0" 
                onError={(e) => e.target.src = "https://via.placeholder.com/200x60/ffffff/E95B7F?text=LUNATEC"}
              />
            </Link>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
              Tu contacto de confianza en Tucumán. Tecnología con garantía y atención personalizada.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-display font-black text-gray-900 uppercase tracking-tighter mb-8 text-lg">
              Links útiles
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Inicio', path: '/' },
                { name: 'Cómo comprar', path: '/como-comprar' },
                { name: 'Garantías', path: '/garantias' },
                { name: 'Política de Cookies', path: '/politica-cookies' } // <-- Nuevo Enlace
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center text-sm font-display font-black text-gray-500 hover:text-brand-pink transition-colors uppercase tracking-tight">
                    <ChevronRight size={14} className="mr-2 text-brand-pink md:opacity-0 md:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-display font-black text-gray-900 uppercase tracking-tighter mb-8 text-lg">
              Contacto
            </h4>
            <div className="flex flex-col gap-5 w-full items-center md:items-start">
              
              <a 
                href="https://wa.me/5493815135998" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('whatsapp_footer')}
                className="group flex items-center gap-3 text-gray-700 hover:text-green-600 transition-all font-display font-black text-sm uppercase tracking-tighter"
              >
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.434h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                +54 9 3815 13-5998
              </a>

              <a 
                href="https://www.instagram.com/lunatec.tuc/" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => handleSocialClick('instagram_footer')}
                className="group flex items-center gap-3 text-gray-700 hover:text-brand-pink transition-all font-display font-black text-sm uppercase tracking-tighter"
              >
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-brand-pink/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                @lunatec.tuc
              </a>

              <div className="flex items-center gap-3 text-gray-700 font-display font-black text-sm uppercase tracking-tighter">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <MapPin size={20} strokeWidth={2.5} className="text-brand-pink" />
                </div>
                <div className="text-left">
                   <p className="leading-tight">San Miguel de Tucumán,</p>
                   <p className="text-[10px] text-gray-400 font-sans font-bold">Tucumán, Argentina</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      <div className="border-t border-gray-100 py-8 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em] text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-brand-pink font-display">LUNATEC</span>. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic font-display">
            Tecnología Mayorista
          </span>
        </div>
      </div>
    </footer>
  );
}