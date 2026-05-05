import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { 
  Users, ShoppingCart, Clock, TrendingUp, Search, 
  AlertCircle, Target, ArrowRight, Eye, Lightbulb, Route, Tags, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  
  // Estados de datos procesados
  const [kpis, setKpis] = useState({ visitantes: 0, tasaConversion: 0, tiempoPromedio: 0, carritos: 0 });
  const [journeyData, setJourneyData] = useState([]);
  const [topCategorias, setTopCategorias] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    async function fetchAnalytics() {
      // Traemos una buena cantidad de eventos para analizar el flujo
      const { data, error } = await supabase
        .from('user_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3000);

      if (error || !data) {
        console.error("Error trayendo analíticas:", error);
        setLoading(false);
        return;
      }

      // --- 1. SETS PARA EL VIAJE DEL CLIENTE (Customer Journey) ---
      const flow = {
        inicio: new Set(),
        categorias: new Set(),
        productos: new Set(),
        carrito: new Set(),
        checkout: new Set()
      };

      const sesionesUnicas = new Set();
      const vistasPorProducto = {};
      const carritosPorProducto = {};
      const busquedas = {};
      const categoriasClics = {};
      let totalSegundos = 0;
      let eventosDeTiempo = 0;
      const actividadPorHora = {};

      // --- 2. PROCESAMIENTO DE EVENTOS ---
      data.forEach(evento => {
        // Priorizamos el ID de la metadata (cookie) si existe
        const sessionId = evento.metadata?.session_id || evento.session_id || 'anonimo';
        sesionesUnicas.add(sessionId);

        // Agrupar actividad por hora (Timeline)
        const hora = new Date(evento.created_at).getHours();
        const etiquetaHora = `${hora}:00`;
        actividadPorHora[etiquetaHora] = (actividadPorHora[etiquetaHora] || 0) + 1;

        // --- MAPEO DEL VIAJE DEL CLIENTE ---
        // 1. Inicio
        if (evento.page_path === '/') flow.inicio.add(sessionId);
        
        // 2. Categorías
        if (evento.event_type === 'category_click' || evento.page_path?.includes('/categoria/')) {
          flow.categorias.add(sessionId);
          const catName = evento.metadata?.category_name;
          if (catName && catName !== 'Todas') {
            categoriasClics[catName] = (categoriasClics[catName] || 0) + 1;
          }
        }

        // 3. Productos (Contando usuarios ÚNICOS por producto)
        if (evento.page_path?.includes('/producto/')) {
          flow.productos.add(sessionId);
        }

        if (evento.event_type === 'product_click' || evento.event_type === 'product_view' || evento.event_type === 'search_result_click') {
          flow.productos.add(sessionId);
          
          const pName = evento.metadata?.product_name || evento.metadata?.product_clicked;
          if (pName) {
            // Guardamos el sessionId en un Set para no contar clics repetidos
            if (!vistasPorProducto[pName]) vistasPorProducto[pName] = new Set();
            vistasPorProducto[pName].add(sessionId);
          }
        }

        // 4. Carrito (Contando usuarios ÚNICOS por producto en carrito)
        if (evento.event_type?.includes('add_to_cart') || evento.page_path?.includes('/carrito')) {
          flow.carrito.add(sessionId);
          
          if (evento.event_type?.includes('add_to_cart')) {
            const pName = evento.metadata?.product_name || 'Producto s/n';
            // Guardamos el sessionId en un Set para no contar clics repetidos
            if (!carritosPorProducto[pName]) carritosPorProducto[pName] = new Set();
            carritosPorProducto[pName].add(sessionId);
          }
        }

        // 5. Checkout / Intención real de compra
        if (evento.event_type === 'checkout_start' || evento.event_type === 'whatsapp_footer') {
          flow.checkout.add(sessionId);
        }

        // Búsquedas
        if (evento.event_type === 'search_query') {
          const query = evento.metadata?.query?.toLowerCase().trim();
          if (query && query.length > 2) busquedas[query] = (busquedas[query] || 0) + 1;
        }

        // Tiempo en pantalla
        if (evento.event_type === 'time_spent') {
          totalSegundos += (evento.metadata?.seconds || 0);
          eventosDeTiempo++;
        }
      });

      const totalVisitantes = sesionesUnicas.size;

      // --- 3. CÁLCULO DE KPIs ---
      const tasaConversion = totalVisitantes > 0 ? ((flow.checkout.size / totalVisitantes) * 100).toFixed(1) : 0;
      const tiempoPromedio = eventosDeTiempo > 0 ? Math.round(totalSegundos / eventosDeTiempo) : 0;

      setKpis({
        visitantes: totalVisitantes,
        tasaConversion: tasaConversion,
        tiempoPromedio: tiempoPromedio,
        carritos: flow.carrito.size
      });

      // --- 4. ARMADO DEL JOURNEY (Paso a Paso) ---
      setJourneyData([
        { step: 'Inicio', desc: 'Entran a la web', users: flow.inicio.size || totalVisitantes },
        { step: 'Exploración', desc: 'Ven Categorías', users: flow.categorias.size },
        { step: 'Interés', desc: 'Abren un Producto', users: flow.productos.size },
        { step: 'Deseo', desc: 'Añaden al Carrito', users: flow.carrito.size },
        { step: 'Acción', desc: 'Van al Checkout/Wpp', users: flow.checkout.size }
      ]);

      // --- 5. TOP CATEGORÍAS ---
      const categoriasArray = Object.keys(categoriasClics)
        .map(nombre => ({ nombre, clics: categoriasClics[nombre] }))
        .sort((a, b) => b.clics - a.clics)
        .slice(0, 5);
      setTopCategorias(categoriasArray);

      // --- 6. RANKING DE PRODUCTOS ---
      const productosArray = Object.keys(vistasPorProducto).map(nombre => {
        // Usamos .size para obtener los usuarios únicos en vez del total de clics
        const vistas = vistasPorProducto[nombre].size; 
        const carritos = carritosPorProducto[nombre]?.size || 0;
        
        const ratio = vistas > 0 ? Math.round((carritos / vistas) * 100) : 0;
        return { nombre, vistas, carritos, ratio };
      }).sort((a, b) => b.vistas - a.vistas).slice(0, 6);
      
      setTopProductos(productosArray);

      // --- 7. BÚSQUEDAS ---
      const topBusquedas = Object.keys(busquedas)
        .map(key => ({ palabra: key, cantidad: busquedas[key] }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 4);
      setSearchData(topBusquedas);

      // --- 8. TIMELINE ---
      const timelineFormateado = Object.keys(actividadPorHora)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(hora => ({ hora, interacciones: actividadPorHora[hora] }));
      setTimelineData(timelineFormateado);

      // --- 9. INSIGHTS AUTOMÁTICOS ---
      const nuevosInsights = [];
      
      if (categoriasArray.length > 0) {
        nuevosInsights.push({
          tipo: 'exito',
          texto: `La categoría "${categoriasArray[0].nombre}" es la más explorada. ¡Asegurate de destacar sus mejores productos en el inicio!`
        });
      }

      if (flow.productos.size > 0 && flow.carrito.size > 0) {
        const dropoffCarrito = Math.round((1 - (flow.carrito.size / flow.productos.size)) * 100);
        if (dropoffCarrito > 80) {
          nuevosInsights.push({
            tipo: 'alerta',
            texto: `El ${dropoffCarrito}% de la gente ve un producto pero NO lo agrega al carrito. Revisá si los precios o las descripciones están claros.`
          });
        }
      }

      const productoEngañoso = productosArray.find(p => p.vistas > 15 && p.ratio < 5);
      if (productoEngañoso) {
        nuevosInsights.push({
          tipo: 'oportunidad',
          texto: `El producto "${productoEngañoso.nombre}" atrae muchas miradas pero pocas ventas. Probá bajándole el precio temporalmente.`
        });
      }

      setInsights(nuevosInsights);
      setLoading(false);
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  // Componente interno para el Customer Journey
  const maxJourneyUsers = Math.max(...journeyData.map(d => d.users), 1);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-brand-pink" /> 
              Inteligencia de Negocio
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Análisis del comportamiento real de los clientes en la tienda.
            </p>
          </div>
        </div>

        {/* RECOMENDACIONES AUTOMÁTICAS */}
        {insights.length > 0 && (
          <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-2xl p-5 md:p-6 shadow-sm">
            <h2 className="text-sm font-display font-black text-brand-dark uppercase tracking-widest flex items-center gap-2 mb-4">
              <Lightbulb className="text-brand-pink" size={18} /> 
              Conclusiones Automáticas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-brand-pink/10 flex items-start gap-3">
                  {insight.tipo === 'alerta' ? <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20}/> : 
                   insight.tipo === 'exito' ? <Target className="text-green-500 shrink-0 mt-0.5" size={20}/> : 
                   <ArrowRight className="text-blue-500 shrink-0 mt-0.5" size={20}/>}
                  <p className="text-sm text-gray-700 font-medium leading-snug">{insight.texto}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TARJETAS DE KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <Users size={18} /> <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Visitantes Únicos</p>
            </div>
            <p className="text-4xl md:text-5xl font-mono font-black text-gray-800 tracking-tighter">{kpis.visitantes}</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-green-500 mb-4">
              <Target size={18} /> <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Conversión Final</p>
            </div>
            <p className="text-4xl md:text-5xl font-mono font-black text-gray-800 tracking-tighter">{kpis.tasaConversion}%</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-brand-pink mb-4">
              <ShoppingCart size={18} /> <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Armaron Carrito</p>
            </div>
            <p className="text-4xl md:text-5xl font-mono font-black text-gray-800 tracking-tighter">{kpis.carritos}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-purple-600 mb-4">
              <Clock size={18} /> <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Tiempo Promedio</p>
            </div>
            <p className="text-4xl md:text-5xl font-mono font-black text-gray-800 tracking-tighter">{kpis.tiempoPromedio}s</p>
          </div>
        </div>

        {/* --- NUEVO: EL VIAJE DEL CLIENTE (USER FLOW) --- */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Route className="text-brand-pink w-6 h-6" />
            <h2 className="text-xl font-display font-black text-gray-800 uppercase tracking-tight">El Viaje del Cliente</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8">¿En qué paso del recorrido estamos perdiendo a los usuarios?</p>
          
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-2">
            {journeyData.map((step, idx) => {
              const porcentaje = Math.round((step.users / maxJourneyUsers) * 100) || 0;
              const dropoff = idx > 0 ? Math.round((1 - (step.users / (journeyData[idx-1].users || 1))) * 100) : 0;
              
              return (
                <div key={idx} className="flex-1 flex flex-col relative group">
                  {/* Flecha conectora (Solo en Desktop) */}
                  {idx < journeyData.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-gray-300">
                      <ChevronRight size={24} />
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-2xl p-4 flex-1 border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors group-hover:bg-brand-pink/5 group-hover:border-brand-pink/30">
                    
                    {/* Barra de progreso de fondo */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-brand-pink/10 -z-0 transition-all duration-1000" 
                      style={{ height: `${porcentaje}%` }}
                    />

                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-pink mb-1 z-10">{step.step}</span>
                    <span className="text-3xl font-mono font-black text-gray-800 mb-1 z-10">{step.users}</span>
                    <span className="text-xs font-bold text-gray-400 z-10">{step.desc}</span>
                  </div>

                  {/* Etiqueta de Drop-off (pérdida) */}
                  {idx > 0 && dropoff > 0 && (
                    <div className="text-center mt-2">
                      <span className="inline-block bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        -{dropoff}% se van
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- MITAD DE PANTALLA: CATEGORÍAS Y BÚSQUEDAS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TOP CATEGORÍAS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Tags className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-display font-black text-gray-800 uppercase tracking-tight">Categorías Más Visitadas</h2>
            </div>
            
            {topCategorias.length > 0 ? (
              <div className="space-y-5">
                {topCategorias.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-gray-700 uppercase tracking-tight">{item.nombre}</span>
                      <span className="font-mono text-brand-pink font-black">{item.clics} visitas</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-dark rounded-full" style={{ width: `${(item.clics / topCategorias[0].clics) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[150px] flex items-center justify-center text-gray-400 font-medium text-sm">Sin datos de categorías aún</div>
            )}
          </div>

          {/* TOP BÚSQUEDAS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-display font-black text-gray-800 uppercase tracking-tight">Top Búsquedas</h2>
            </div>
            
            {searchData.length > 0 ? (
              <div className="space-y-5">
                {searchData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-gray-700 capitalize">{item.palabra}</span>
                      <span className="font-mono text-gray-500 font-bold">{item.cantidad} búsquedas</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-pink rounded-full opacity-80" style={{ width: `${(item.cantidad / searchData[0].cantidad) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[150px] flex items-center justify-center text-gray-400 font-medium text-sm">Sin búsquedas recientes</div>
            )}
          </div>

        </div>

        {/* --- MITAD DE PANTALLA: PRODUCTOS Y TRÁFICO --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TOP PRODUCTOS (Atractivo vs Realidad) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <h2 className="text-lg font-display font-black text-gray-800 uppercase tracking-tight mb-2">Desempeño de Productos</h2>
            <p className="text-xs text-gray-500 mb-6">Usuarios únicos que entran a verlo vs cuántos lo agregan al carrito.</p>
            
            {topProductos.length > 0 ? (
              <div className="space-y-4">
                {topProductos.map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-xs font-bold text-gray-800 uppercase truncate" title={prod.nombre}>{prod.nombre}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium"><Eye size={12}/> {prod.vistas} vistas</span>
                        <span className="flex items-center gap-1 text-[10px] text-brand-pink font-bold"><ShoppingCart size={12}/> {prod.carritos} carritos</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Éxito</span>
                      <span className={`font-mono font-black text-lg ${prod.ratio >= 10 ? 'text-green-500' : prod.ratio < 3 ? 'text-red-500' : 'text-gray-700'}`}>
                        {prod.ratio}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[150px] flex items-center justify-center text-gray-400 font-medium text-sm">Aún no hay visitas a productos</div>
            )}
          </div>

          {/* LÍNEA DE TIEMPO (Gráfico de Área Suave) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-display font-black text-gray-800 uppercase tracking-tight mb-2">Tráfico por Hora (Hoy)</h2>
            <p className="text-xs text-gray-500 mb-6">Identificá en qué momento del día tu tienda está más activa.</p>
            
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorActividad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E95B7F" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E95B7F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                  <YAxis hide />
                  <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="interacciones" stroke="#E95B7F" strokeWidth={3} fillOpacity={1} fill="url(#colorActividad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}