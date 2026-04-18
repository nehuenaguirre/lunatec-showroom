import { supabase } from '../supabase';

// Generar o recuperar un ID de sesión único (Sin librerías extra)
const getSessionId = () => {
  let sessionId = localStorage.getItem('lunatec_session_id');
  
  if (!sessionId) {
    // Usamos la API nativa del navegador. Si por alguna razón es un navegador muy viejo, usamos un generador alternativo seguro.
    sessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'sess-' + Math.random().toString(36).substring(2, 15);
      
    localStorage.setItem('lunatec_session_id', sessionId);
  }
  
  return sessionId;
};

export const trackEvent = async (eventType, pagePath, metadata = {}, productId = null) => {
  try {
    await supabase.from('user_interactions').insert([
      {
        session_id: getSessionId(),
        event_type: eventType,
        page_path: pagePath,
        product_id: productId,
        metadata: metadata
      }
    ]);
  } catch (error) {
    console.error('Error enviando evento de analítica:', error);
  }
};