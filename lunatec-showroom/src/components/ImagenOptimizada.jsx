import { useState, useEffect } from 'react';

export default function ImagenOptimizada({ codigo, alt, className, width = 300 }) {
  const extensiones = [".webp", ".jpg", ".png", ".jpeg", ".JPG", ".PNG"];
  const carpeta = width >= 800 ? '800' : '300';
  const baseUrl = `https://qwyoqfcaepmqzdzzwmlh.supabase.co/storage/v1/object/public/images/${carpeta}`;
  
  // ACÁ DEFINIMOS TU IMAGEN PERSONALIZADA
  // Si la guardaste en la carpeta public, solo pones el nombre con la barra adelante
  const imagenFallback = "https://qwyoqfcaepmqzdzzwmlh.supabase.co/storage/v1/object/public/images/sin-foto.webp";

  const [intento, setIntento] = useState(0);
  const [imgSrc, setImgSrc] = useState(imagenFallback);

  useEffect(() => {
    if (codigo) {
      setIntento(0);
      setImgSrc(`${baseUrl}/${codigo}${extensiones[0]}`);
    } else {
      // Si no hay código, mostramos tu imagen personalizada
      setImgSrc(imagenFallback);
    }
  }, [codigo, baseUrl]);

  const manejarError = () => {
    if (intento < extensiones.length - 1) {
      const proximo = intento + 1;
      setIntento(proximo);
      setImgSrc(`${baseUrl}/${codigo}${extensiones[proximo]}`);
    } else {
      // Si fallaron todas las extensiones, mostramos tu imagen personalizada
      setImgSrc(imagenFallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className} rounded-t-xl`} 
      onError={manejarError}
      loading="lazy"
      style={{ 
        mixBlendMode: 'multiply',
        filter: 'contrast(1.1) brightness(1.05)'
      }}
    />
  );
}