import { useState, useEffect } from 'react';

export default function ImagenCategoria({ id, nombre, isActive }) {
  const extensiones = [".png", ".jpg", ".webp", ".jpeg", ".PNG", ".JPG"];
  const baseUrl = "https://qwyoqfcaepmqzdzzwmlh.supabase.co/storage/v1/object/public/images/categorias";
  
  const [intento, setIntento] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [errorTotal, setErrorTotal] = useState(false);

  useEffect(() => {
    if (id) {
      setErrorTotal(false);
      setIntento(0);
      setImgSrc(`${baseUrl}/${id}${extensiones[0]}`);
    }
  }, [id]);

  const manejarError = () => {
    if (intento < extensiones.length - 1) {
      const proximo = intento + 1;
      setIntento(proximo);
      setImgSrc(`${baseUrl}/${id}${extensiones[proximo]}`);
    } else {
      setErrorTotal(true);
    }
  };

  if (errorTotal || !id) {
    return (
      <span className={`text-3xl font-black uppercase flex items-center justify-center w-full h-full ${isActive ? 'text-brand-pink' : 'text-gray-400'}`}>
        {nombre?.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={nombre}
      // Achicamos el padding a p-1 para que la imagen sea más grande
      className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-110"
      style={{ 
        mixBlendMode: 'multiply',
        // ESTA ES LA MAGIA: Forzamos el gris a blanco puro subiendo brillo y contraste
        filter: isActive ? 'contrast(1.2) brightness(0.95)' : 'contrast(1.2) brightness(1.1)' 
      }}
      onError={manejarError}
    />
  );
}