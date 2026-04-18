import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, Store, Truck, X } from 'lucide-react';
import Cookies from 'js-cookie'; // <-- IMPORTAMOS LAS COOKIES
import { CartContext } from '../context/CartContext';
import ImagenOptimizada from '../components/ImagenOptimizada';
import { trackEvent } from '../utils/analytics'; // <-- IMPORTAMOS LA ANALÍTICA

export default function CartFull() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
  const [metodoEnvio, setMetodoEnvio] = useState('tienda'); // 'tienda' o 'domicilio'
  const location = useLocation(); // <-- Necesitamos location para el rastreo
  const numeroWhatsApp = "5493815135998";

  const enviarPedido = () => {
    // --- 1. REGISTRO EN ANALÍTICAS ANTES DE SALIR A WHATSAPP ---
    const sessionId = Cookies.get('lunatec_session_id');
    trackEvent('checkout_start', location.pathname, {
      cart_total: cartTotal,
      item_count: cart.length,
      shipping_method: metodoEnvio,
      session_id: sessionId
    });

    // --- 2. LÓGICA DE ARMADO DEL MENSAJE DE WHATSAPP ---
    let texto = "🛒 *NUEVO PEDIDO - LUNATEC*\n\n";
    cart.forEach(item => {
      texto += `▪ ${item.quantity}x ${item.nombre} ($${item.precio_venta})\n`;
    });
    texto += `\n📦 Envío: ${metodoEnvio === 'tienda' ? 'Retiro en sucursal' : 'Envío a domicilio'}`;
    texto += `\n💰 *TOTAL ESTIMADO: $${cartTotal.toLocaleString('es-AR')}*\n\n`;
    texto += "Hola, quiero avanzar con esta compra.";
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8 font-medium">¿No sabés qué comprar? ¡Mirá nuestro catálogo!</p>
        <Link to="/" className="px-8 py-4 bg-gradient-brand text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
          Descubrir productos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb / Pasos */}
        <div className="flex justify-center mb-10 text-sm font-bold tracking-widest uppercase">
          <span className="text-brand-pink border-b-2 border-brand-pink pb-1">Carrito</span>
          <span className="text-gray-400 mx-4">→</span>
          <span className="text-gray-400">Finalizar Compra</span>
          <span className="text-gray-400 mx-4">→</span>
          <span className="text-gray-400">Pedido Completado</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Columna Izquierda: Tabla de Productos */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right pr-4">Subtotal</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.map(item => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center group relative">
                  
                  {/* Info Producto */}
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors hidden md:block">
                      <X className="w-5 h-5" />
                    </button>
                    <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <ImagenOptimizada codigo={item.imagen_codigo || item.sku} alt={item.nombre} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-2 text-sm">{item.nombre}</h3>
                    </div>
                  </div>

                  {/* Precio (Desktop) */}
                  <div className="hidden md:block col-span-2 text-center text-gray-500 font-medium">
                    ${Number(item.precio_venta).toLocaleString('es-AR')}
                  </div>

                  {/* Controles y Subtotal */}
                  <div className="col-span-1 md:col-span-4 flex items-center justify-between md:grid md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 md:col-span-2 mx-auto w-fit">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-brand-pink"><Minus className="w-4 h-4" /></button>
                      <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-brand-pink"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="font-black text-brand-dark text-lg md:col-span-2 text-right">
                      ${(item.precio_venta * item.quantity).toLocaleString('es-AR')}
                    </div>
                  </div>

                  {/* Botón borrar en mobile */}
                  <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 md:hidden">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Totales</h2>
            
            <div className="flex justify-between items-center mb-6 text-gray-600 font-medium">
              <span>Subtotal</span>
              <span>${cartTotal.toLocaleString('es-AR')}</span>
            </div>

            {/* Opciones de Envío */}
            <div className="border-t border-gray-100 py-6 space-y-4">
              <span className="text-sm font-bold text-gray-900 block mb-2">Método de entrega</span>
              
              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${metodoEnvio === 'tienda' ? 'border-brand-pink bg-brand-pink/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="envio" value="tienda" checked={metodoEnvio === 'tienda'} onChange={() => setMetodoEnvio('tienda')} className="mt-1 accent-brand-pink" />
                <div>
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-2"><Store className="w-4 h-4 text-brand-pink"/> Retiro presencial</div>
                  <p className="text-xs text-gray-500 mt-1">Coordinar por Whatsapp</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${metodoEnvio === 'domicilio' ? 'border-brand-pink bg-brand-pink/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="envio" value="domicilio" checked={metodoEnvio === 'domicilio'} onChange={() => setMetodoEnvio('domicilio')} className="mt-1 accent-brand-pink" />
                <div>
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-2"><Truck className="w-4 h-4 text-brand-pink"/> Envío a domicilio</div>
                  <p className="text-xs text-gray-500 mt-1">Coordinar por WhatsApp.</p>
                </div>
              </label>
            </div>

            <div className="flex justify-between items-center py-6 border-t border-gray-100 mb-2">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-brand-dark">${cartTotal.toLocaleString('es-AR')}</span>
            </div>

            <button onClick={enviarPedido} className="w-full py-4 bg-gradient-brand text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all tracking-wide">
              FINALIZAR COMPRA
            </button>
            
            <Link to="/" className="mt-6 flex justify-center items-center text-sm font-bold text-gray-400 hover:text-brand-pink transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Seguir comprando
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}