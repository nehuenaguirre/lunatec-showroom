import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function Success() {
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    // Al entrar a esta página, el pago ya fue aprobado, así que limpiamos el carrito
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-green-50">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">¡Compra Exitosa!</h1>
        <p className="text-gray-500 font-medium mb-8">
          Gracias por elegir LunaTec. Ya recibimos tu pedido y estamos preparando todo para vos.
        </p>
        <div className="space-y-3">
          <Link to="/mi-cuenta" className="block w-full py-4 bg-brand-pink text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all">
            Ver mis pedidos
          </Link>
          <Link to="/" className="block w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
            <ShoppingBag size={18} /> Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}