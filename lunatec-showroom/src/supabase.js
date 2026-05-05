import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Ejemplo para agregar en tu lógica de Supabase
export const getColeccion = async (nombreVista) => {
  const { data, error } = await supabase
    .from(nombreVista)
    .select('*');
  
  if (error) {
    console.error(`Error cargando ${nombreVista}:`, error);
    return [];
  }
  return data;
};