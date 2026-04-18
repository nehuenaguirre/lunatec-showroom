import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';

export default function CategoryView() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [categorias, setCategorias] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Traer todas las categorías para el Grid
      const { data: catData } = await supabase.from('categorias').select('*');
      if (catData) {
        setCategorias(catData);
        const currentCat = catData.find(c => c.id.toString() === id);
        setCategoriaActual(currentCat);
      }

      // Traer productos SOLO de esta categoría
      const { data: prodData } = await supabase
        .from('productos')
        .select('*')
        .eq('categoria_id', id)
        .gt('stock_actual', 0)
        .order('id', { ascending: false });

      if (prodData) setProductos(prodData);
      setLoading(false);
    }
    
    fetchData();
  }, [id]); // Se vuelve a ejecutar si cambia el ID en la URL

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-8 pt-0">
      {/* Fondo de color para la cabecera de la categoría */}
      <div className="bg-gradient-to-b from-brand-pink/10 to-transparent pt-8 pb-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-2">
            {categoriaActual?.nombre || 'Categoría'}
          </h1>
          <p className="text-gray-500 font-medium">
            {productos.length} productos disponibles
          </p>
        </div>
      </div>

      <CategoryGrid categorias={categorias} />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {productos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productos.map(prod => (
              <ProductCard key={prod.id} producto={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-xl font-bold text-gray-800">No hay productos aquí</h3>
            <p className="text-gray-500 mt-2">Pronto agregaremos nuevo stock a esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}