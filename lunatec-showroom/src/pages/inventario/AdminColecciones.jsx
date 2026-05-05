import { useState, useEffect } from 'react';
import { supabase } from '../../api'; // Ajusta la ruta a tu cliente de Supabase del ERP

export default function AdminColecciones() {
  const [config, setConfig] = useState({
    oferta_dias_min: 14,
    oferta_ventas_max: 3,
    destacado_ventas_min: 15,
    nuevo_dias_max: 7
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Cargar la configuración actual al abrir el menú
  useEffect(() => {
    async function cargarConfig() {
      const { data, error } = await supabase
        .from('config_colecciones')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data) setConfig(data);
      if (error) console.error("Error cargando config:", error);
      setLoading(false);
    }
    cargarConfig();
  }, []);

  // Función para guardar los cambios en Supabase
  const guardarCambios = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('config_colecciones')
      .update({
        oferta_dias_min: config.oferta_dias_min,
        oferta_ventas_max: config.oferta_ventas_max,
        destacado_ventas_min: config.destacado_ventas_min,
        nuevo_dias_max: config.nuevo_dias_max
      })
      .eq('id', 1);

    setSaving(false);
    if (!error) {
      setMensaje('✅ Reglas actualizadas. La web ya refleja los cambios.');
      setTimeout(() => setMensaje(''), 4000);
    } else {
      setMensaje('❌ Error al guardar.');
    }
  };

  const handleChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: parseInt(e.target.value) || 0
    });
  };

  if (loading) return <div className="p-8">Cargando panel...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        ⚙️ Motor de Colecciones Dinámicas
      </h2>
      
      <p className="text-gray-600 mb-8 text-sm">
        Ajusta las reglas aquí. Tu página web actualizará las categorías automáticamente
        basándose en estos parámetros y el stock actual.
      </p>

      <div className="grid gap-8">
        {/* PANEL: OFERTAS */}
        <div className="bg-red-50 p-5 rounded-lg border border-red-100">
          <h3 className="font-bold text-red-700 text-lg mb-4">🔥 Categoría: Ofertas Especiales</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Días de antigüedad mínimos
              </label>
              <input 
                type="number" name="oferta_dias_min" 
                value={config.oferta_dias_min} onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
              />
              <span className="text-xs text-gray-500">Un lote debe tener más de estos días.</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ventas máximas permitidas
              </label>
              <input 
                type="number" name="oferta_ventas_max" 
                value={config.oferta_ventas_max} onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
              />
              <span className="text-xs text-gray-500">Si vendió más que esto, no es clavo/oferta.</span>
            </div>
          </div>
        </div>

        {/* PANEL: DESTACADOS */}
        <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-100">
          <h3 className="font-bold text-yellow-700 text-lg mb-4">⭐ Categoría: Destacados</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ventas totales mínimas
            </label>
            <input 
              type="number" name="destacado_ventas_min" 
              value={config.destacado_ventas_min} onChange={handleChange}
              className="w-full md:w-1/2 p-2 border rounded focus:ring-yellow-500 focus:border-yellow-500"
            />
            <span className="block text-xs text-gray-500 mt-1">Para ser destacado, debe haber vendido esta cantidad histórica.</span>
          </div>
        </div>

        {/* PANEL: NUEVOS */}
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-700 text-lg mb-4">✨ Categoría: Nuevos Ingresos</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Días máximos de novedad
            </label>
            <input 
              type="number" name="nuevo_dias_max" 
              value={config.nuevo_dias_max} onChange={handleChange}
              className="w-full md:w-1/2 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="block text-xs text-gray-500 mt-1">Cuántos días un producto retiene la etiqueta de "Nuevo".</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <button 
          onClick={guardarCambios}
          disabled={saving}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Reglas'}
        </button>
        
        {mensaje && <span className="font-semibold text-green-600">{mensaje}</span>}
      </div>
    </div>
  );
}