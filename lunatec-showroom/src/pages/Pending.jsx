import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function Pending() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-yellow-50">
        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Pago Pendiente</h1>
        <p className="text-gray-500 font-medium mb-8">
          Estamos esperando la confirmación de Mercado Pago. Apenas se acredite, verás tu compra en tu perfil.
        </p>
        <Link to="/mi-cuenta" className="block w-full py-4 bg-yellow-500 text-white font-bold rounded-xl shadow-lg hover:bg-yellow-600 transition-all">
          Ir a mis pedidos
        </Link>
      </div>
    </div>
  );
}