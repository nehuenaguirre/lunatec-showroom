import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function Failure() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-red-50">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Hubo un problema</h1>
        <p className="text-gray-500 font-medium mb-8">
          No pudimos procesar el pago. Tu dinero no ha sido debitado y tu carrito sigue guardado.
        </p>
        <Link to="/carrito" className="block w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Volver e intentar de nuevo
        </Link>
      </div>
    </div>
  );
}