import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si el usuario venía del carrito, lo devolvemos ahí tras el login
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        // Al enviar el 'nombre' en la metadata, el Trigger de SQL lo captura
        const { error } = await signUp(email, password, { nombre });
        if (error) throw error;
        
        // Supabase requiere confirmación de email por defecto. 
        // Si tienes esto desactivado en Supabase, el login es directo.
        navigate(from); 
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        navigate(from);
      }
    } catch (err) {
      console.error(err);
      // Mensajes de error amigables
      if (err.message.includes('Password should be')) {
        setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.message.includes('Invalid login')) {
        setErrorMsg('Email o contraseña incorrectos.');
      } else if (err.message.includes('already registered')) {
        setErrorMsg('Este email ya está registrado. Intenta ingresar.');
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 font-sans">
      <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-6 text-gray-900">
        {isRegister ? 'Crear Cuenta' : 'Ingresar'}
      </h2>
      
      {errorMsg && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <input
            type="text"
            placeholder="Tu Nombre completo"
            className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-brand-pink focus:bg-white outline-none transition-all"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={loading}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-brand-pink focus:bg-white outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-brand-pink focus:bg-white outline-none transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-pink hover:bg-brand-dark text-white rounded-xl font-display font-black uppercase tracking-tight transition-colors disabled:opacity-50 flex justify-center items-center h-14"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isRegister ? 'Registrarme y Comprar' : 'Entrar'
          )}
        </button>
      </form>
      
      <button 
        type="button"
        onClick={() => {
          setIsRegister(!isRegister);
          setErrorMsg('');
        }}
        disabled={loading}
        className="w-full mt-6 text-sm text-gray-500 hover:text-brand-pink font-medium transition-colors"
      >
        {isRegister ? '¿Ya tienes cuenta? Ingresa aquí' : '¿Eres nuevo? Crea tu cuenta'}
      </button>
    </div>
  );
}