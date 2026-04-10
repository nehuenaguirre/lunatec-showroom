// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h3 className="text-xl font-black text-white mb-4">LunaTec</h3>
          <p className="text-sm text-gray-400">
            Tu tecnología al mejor precio. Venta directa por WhatsApp con atención personalizada y envíos rápidos.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
            <li><a href="#catalogo" className="hover:text-white transition-colors">Catálogo</a></li>
            <li><a href="#ofertas" className="hover:text-white transition-colors">Ofertas</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Contacto</h4>
          <ul className="space-y-2 text-sm">
            <li>Yerba Buena, Tucumán</li>
            <li>Envíos a todo el país</li>
            <li className="mt-4">
              <span className="bg-gray-800 text-xs px-3 py-1 rounded-full border border-gray-700">
                Lunes a Sábados - 9hs a 20hs
              </span>
            </li>
          </ul>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} LunaTec Showroom. Todos los derechos reservados.
      </div>
    </footer>
  )
}