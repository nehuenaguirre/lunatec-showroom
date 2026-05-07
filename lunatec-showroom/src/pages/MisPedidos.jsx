import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, Tag, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MisPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      if (!user) return;

      // 1. Buscamos el ID numérico del usuario en tu tabla
      const { data: perfil, error: perfilError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (perfilError || !perfil) {
        console.error("Error obteniendo perfil:", perfilError);
        setLoading(false);
        return;
      }

      // 2. Usamos el ID numérico para buscar las ventas en el ERP
      const { data, error } = await supabase
        .from('ventas')
        .select(`
          id,
          fecha,
          total,
          estado,
          metodo_pago,
          ventas_detalle (
            cantidad,
            precio_unitario,
            producto_id
          )
        `)
        .eq('usuario_id', perfil.id) // <-- Usamos perfil.id numérico
        .order('fecha', { ascending: false });

      if (!error) {
        setPedidos(data);
      } else {
        console.error("Error cargando pedidos:", error);
      }
      
      setLoading(false);
    }

    fetchPedidos();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">
          Mis Pedidos
        </h1>
        <p className="text-gray-500 font-medium">
          Gestiona tus compras y revisa el estado de tus envíos.
        </p>
      </header>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-display font-black uppercase text-gray-800 mb-4">
            Aún no tienes compras
          </h3>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-brand-pink text-white rounded-2xl font-display font-black uppercase tracking-tight hover:bg-brand-dark transition-all"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div 
              key={pedido.id} 
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                    <Tag className="w-3 h-3" />
                    Pedido #{pedido.id.toString().slice(0, 8)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-900 font-display font-black text-xl uppercase tracking-tighter">
                    <Calendar className="w-5 h-5 text-brand-pink" />
                    {new Date(pedido.fecha).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-gray-500 text-sm font-medium">
                    Método de pago: <span className="capitalize">{pedido.metodo_pago}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-display font-black uppercase tracking-widest ${
                    pedido.estado === 'entregado' || pedido.estado === 'pagado'
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {pedido.estado || 'Procesando'}
                  </span>
                  <div className="text-2xl font-mono font-black text-gray-900 tracking-tighter">
                    ${Number(pedido.total).toLocaleString('es-AR')}
                  </div>
                </div>

                <div className="pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 flex justify-end">
                  <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-brand-pink transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}