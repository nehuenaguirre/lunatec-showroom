import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import ImagenOptimizada from './ImagenOptimizada';

export default function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, cartTotal, isSidebarOpen, setIsSidebarOpen } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Fondo oscuro más suave, sin blur pesado que traba el navegador */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Panel con animación súper rápida y fluida */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
            transition={{ type: 'tween', duration: 0.3, ease: 'circOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Tu Carrito</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium text-lg">Tu carrito está vacío</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden p-1">
                      <ImagenOptimizada codigo={item.imagen_codigo || item.sku} alt={item.nombre} width={300} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="text-sm font-bold leading-snug text-gray-800 line-clamp-2">{item.nombre}</h3>
                      <p className="text-brand-pink font-black text-lg">${Number(item.precio_venta).toLocaleString('es-AR')}</p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-brand-pink transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-brand-pink transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-gray-500">Total a pagar:</span>
                  <span className="font-black text-2xl text-gray-900">${Number(cartTotal).toLocaleString('es-AR')}</span>
                </div>
                <button 
                  onClick={() => { setIsSidebarOpen(false); navigate('/carrito'); }}
                  className="w-full py-4 bg-gradient-brand text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all tracking-wide"
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}