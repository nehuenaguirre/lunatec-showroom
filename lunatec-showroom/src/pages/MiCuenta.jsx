import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Settings, LogOut, ArrowLeft, Eye } from 'lucide-react';

export default function MiCuenta() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  
  // Estado para la vista en detalle de un pedido
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Estados para contraseña
  const [newPassword, setNewPassword] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchPedidos() {
      if (!user) return;
      setLoadingPedidos(true);

      const { data: perfil, error: perfilError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!perfilError && perfil) {
        const { data, error } = await supabase
          .from('ventas')
          .select(`
            id,
            fecha,
            total,
            estado,
            metodo_pago,
            ventas_envios (
              costo_envio
            ),
            ventas_detalle (
              cantidad,
              precio_unitario,
              subtotal,
              productos (nombre)
            )
          `)
          .eq('usuario_id', perfil.id)
          .order('fecha', { ascending: false });

        if (!error) setPedidos(data);
      }
      setLoadingPedidos(false);
    }

    if (activeTab === 'pedidos' && !pedidoSeleccionado) {
      fetchPedidos();
    }
  }, [user, activeTab, pedidoSeleccionado]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    setLoadingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      setPassMessage({ type: 'error', text: error.message });
    } else {
      setPassMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
      setNewPassword('');
    }
    setLoadingPass(false);
  };

  const menuOptions = [
    { id: 'pedidos', label: 'Pedidos', icon: <Package size={18} /> },
    { id: 'direccion', label: 'Dirección', icon: <MapPin size={18} /> },
    { id: 'detalles', label: 'Detalles de la cuenta', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* HEADER TIPO BANNER */}
      <div className="bg-brand-pink py-12 md:py-16 text-center shadow-inner">
        <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">
          Mi cuenta
        </h1>
        <p className="text-white/80 font-medium mt-2 text-sm">
          Inicio / <span className="font-bold text-white">Mi cuenta</span>
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVEGACIÓN */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
            {menuOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => { setActiveTab(option.id); setPedidoSeleccionado(null); }}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-tight transition-colors whitespace-nowrap md:whitespace-normal border-b border-gray-50 last:border-0 ${
                  activeTab === option.id && !pedidoSeleccionado
                    ? 'bg-gray-50 text-brand-pink border-l-4 border-l-brand-pink'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-pink border-l-4 border-l-transparent'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-tight text-red-500 hover:bg-red-50 border-l-4 border-l-transparent transition-colors whitespace-nowrap md:whitespace-normal"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </nav>
        </aside>

        {/* ÁREA DE CONTENIDO */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[500px]">
          
          {/* VISTA: LISTA DE PEDIDOS */}
          {activeTab === 'pedidos' && !pedidoSeleccionado && (
            <div>
              <h2 className="text-2xl font-display font-black uppercase text-gray-900 tracking-tighter mb-6">Historial de Pedidos</h2>
              
              {loadingPedidos ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin"></div>
                </div>
              ) : pedidos.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Aún no has realizado ninguna compra.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Pedido</th>
                        <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha</th>
                        <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                        <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                        <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-sm text-gray-900">#{pedido.id.toString().slice(0, 8)}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Date(pedido.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                              {pedido.estado || 'Completado'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-[#73A839]">
                              ${Number(pedido.total).toLocaleString('es-AR')}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">por {pedido.ventas_detalle?.reduce((acc, curr) => acc + curr.cantidad, 0) || 0} art.</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => setPedidoSeleccionado(pedido)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-pink text-white rounded-lg text-xs font-bold uppercase tracking-tight hover:bg-brand-dark transition-colors"
                            >
                              <Eye size={14} /> Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VISTA: DETALLE DE UN PEDIDO */}
          {activeTab === 'pedidos' && pedidoSeleccionado && (
            <div className="animate-fade-in">
              <button 
                onClick={() => setPedidoSeleccionado(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-pink transition-colors uppercase tracking-tight mb-6"
              >
                <ArrowLeft size={16} /> Volver a Pedidos
              </button>

              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 mb-8 border border-gray-100">
                El pedido <strong className="font-mono text-gray-900">#{pedidoSeleccionado.id.toString().slice(0, 8)}</strong> se realizó el <strong className="text-gray-900">{new Date(pedidoSeleccionado.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> y está actualmente <strong className="uppercase text-brand-pink">{pedidoSeleccionado.estado || 'Completado'}</strong>.
              </div>

              <h3 className="text-lg font-display font-black uppercase text-gray-900 mb-4 tracking-tighter">Detalles del pedido</h3>
              <table className="w-full text-left border-collapse mb-8 text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="py-3 font-bold uppercase tracking-tight">Producto</th>
                    <th className="py-3 font-bold uppercase tracking-tight text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pedidoSeleccionado.ventas_detalle?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-4 text-gray-600">
                        {item.productos?.nombre} <strong className="text-gray-900 mx-1">×</strong> {item.cantidad}
                      </td>
                      <td className="py-4 text-right font-mono font-bold text-gray-900">
                        ${Number(item.subtotal).toLocaleString('es-AR')}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 font-bold text-gray-900">Subtotal:</td>
                    <td className="py-4 text-right font-mono font-bold text-gray-900">
                       ${Number(pedidoSeleccionado.total - (pedidoSeleccionado.ventas_envios?.[0]?.costo_envio || 0)).toLocaleString('es-AR')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-900">Envío:</td>
                    <td className="py-4 text-right text-gray-600">
                      {pedidoSeleccionado.ventas_envios?.[0]?.costo_envio > 0 
                        ? `$${Number(pedidoSeleccionado.ventas_envios[0].costo_envio).toLocaleString('es-AR')}`
                        : 'Retiro en tienda / Envío Gratis'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-900">Método de pago:</td>
                    <td className="py-4 text-right text-gray-600 capitalize">
                      {pedidoSeleccionado.metodo_pago || 'Mercado Pago'}
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-900 bg-gray-50">
                    <td className="py-4 px-2 font-display font-black uppercase text-lg">Total:</td>
                    <td className="py-4 px-2 text-right font-mono font-black text-[#73A839] text-xl">
                      ${Number(pedidoSeleccionado.total).toLocaleString('es-AR')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* VISTA: DIRECCIÓN */}
          {activeTab === 'direccion' && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-display font-black uppercase text-gray-900 tracking-tighter mb-4">Dirección de Envío y Facturación</h2>
              <div className="bg-[#FFF4E5] border-l-4 border-orange-400 p-4 mb-6 rounded-r-xl">
                <p className="text-orange-800 text-sm font-medium leading-relaxed">
                  Para evitar errores de logística, tu dirección de envío exacta se solicitará y gestionará <strong>únicamente al momento de finalizar tu compra (Checkout)</strong> en la pasarela de pagos, garantizando que tu pedido llegue al lugar correcto.
                </p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50">
                <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-tight text-sm">Datos de Facturación Registrados</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Nombre: <strong className="text-gray-900">{user?.user_metadata?.nombre || 'No especificado'}</strong><br/>
                  Email: <strong className="text-gray-900">{user?.email}</strong><br/>
                </p>
              </div>
            </div>
          )}

          {/* VISTA: DETALLES DE LA CUENTA */}
          {activeTab === 'detalles' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-display font-black uppercase text-gray-900 tracking-tighter mb-6">Detalles de la cuenta</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre registrado</label>
                  <input 
                    type="text" 
                    value={user?.user_metadata?.nombre || ''} 
                    disabled 
                    className="w-full p-3 bg-gray-100 rounded-xl border-none text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="w-full p-3 bg-gray-100 rounded-xl border-none text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 mt-8">
                <h3 className="text-lg font-display font-black uppercase text-gray-900 tracking-tighter mb-6">Cambio de contraseña</h3>
                
                {passMessage.text && (
                  <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${passMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {passMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nueva contraseña</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-brand-pink outline-none transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loadingPass || !newPassword}
                    className="px-6 py-3 bg-brand-pink text-white rounded-xl font-bold uppercase tracking-tight hover:bg-brand-dark transition-colors disabled:opacity-50 mt-4"
                  >
                    {loadingPass ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </form>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}