// src/components/CategoryGrid.jsx
export default function CategoryGrid({ categorias, categoriaActiva, setCategoriaActiva }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          
          <button 
            onClick={() => setCategoriaActiva('Todas')}
            className={`px-6 py-2.5 rounded-full font-bold transition-all ${categoriaActiva === 'Todas' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Todas
          </button>

          {categorias.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)} // Usamos el ID para filtrar
              className={`px-6 py-2.5 rounded-full font-bold transition-all ${categoriaActiva === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {cat.nombre}
            </button>
          ))}
          
        </div>
      </div>
    </section>
  );
}