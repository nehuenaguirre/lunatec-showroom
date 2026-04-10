import os
from flask import Flask, render_template_string
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)

# Conexión a Supabase
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def consultar_datos_finales():
    try:
        # Traemos los datos crudos de las tres tablas
        res_prod = supabase.table("productos").select("*").execute()
        res_cat = supabase.table("categorias").select("*").execute()
        res_sub = supabase.table("subcategorias").select("*").execute()

        # Mapeos de nombres para IDs {id: "Nombre"}
        mapa_cats = {c['id']: c['nombre'] for c in res_cat.data}
        mapa_subs = {s['id']: s['nombre'] for s in res_sub.data}

        productos_finales = []
        for p in res_prod.data:
            # Usamos el nombre correcto de tu columna: stock_actual
            # Si es None, lo tratamos como 0.
            stock = p.get('stock_actual') or 0
            
            # FILTRO CRÍTICO: Solo mostramos si hay stock > 0
            if stock > 0:
                # Agregamos los nombres de cat y subcat al producto
                p['cat_nombre'] = mapa_cats.get(p.get('categoria_id'), "General")
                p['sub_nombre'] = mapa_subs.get(p.get('subcategoria_id'), "-")
                p['stock_para_ver'] = int(stock)
                productos_finales.append(p)
        
        print(f"DEBUG: Cargados {len(productos_finales)} productos con stock.")
        
        # Generamos la lista única de categorías para los filtros superiores
        categorias_lista = sorted(list(set(p['cat_nombre'] for p in productos_finales)))
        
        return productos_finales, categorias_lista

    except Exception as e:
        print(f"Error real en la base de datos: {e}")
        return [], []

@app.route('/')
def index():
    productos, categorias = consultar_datos_finales()
    return render_template_string(HTML_MODERNO, productos=productos, categorias=categorias)

# --- PLANTILLA HTML (Limpia y con Logo) ---
HTML_MODERNO = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LunaTec | Showroom Digital</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-100 font-sans" x-data="{ filtro: 'Todas', busqueda: '' }">

    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            
            <a href="/">
                <img src="/static/logo.png" alt="LunaTec Logo" class="h-12 w-auto object-contain">
            </a>
            <div class="relative w-full max-w-sm">
                <input type="text" x-model="busqueda" placeholder="Buscar por nombre o SKU..." 
                       class="bg-gray-100 border-none rounded-full px-10 py-2 w-full focus:ring-2 focus:ring-blue-500 transition-all">
                <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto p-6">
        <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button @click="filtro = 'Todas'" 
                    :class="filtro === 'Todas' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'"
                    class="px-5 py-2 rounded-full shadow-sm text-sm font-bold transition-all">Todas</button>
            {% for cat in categorias %}
            <button @click="filtro = '{{ cat }}'" 
                    :class="filtro === '{{ cat }}' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'"
                    class="px-5 py-2 rounded-full shadow-sm text-sm font-bold transition-all">{{ cat }}</button>
            {% endfor %}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {% for p in productos %}
            <div x-show="(filtro === 'Todas' || '{{ p.cat_nombre }}' === filtro) && ('{{ p.nombre }} {{ p.sku }}'.toLowerCase().includes(busqueda.toLowerCase()))"
                 class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-blue-100">
                
                <div class="aspect-square bg-gray-100 relative overflow-hidden">
                    <img src="https://via.placeholder.com/400?text={{ p.nombre|urlencode }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                    <div class="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur font-bold">
                        {{ p.sub_nombre }}
                    </div>
                </div>

                <div class="p-4">
                    <p class="text-[10px] text-gray-400 font-mono">SKU: {{ p.sku }}</p>
                    <h3 class="font-bold text-gray-800 text-base truncate">{{ p.nombre }}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[32px]">{{ p.descripcion }}</p>
                    
                    <div class="mt-4 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] text-gray-400 block uppercase font-bold">Precio</span>
                            <span class="text-2xl font-black text-gray-900">${{ "{:,.0f}".format(p.precio_venta) }}</span>
                        </div>
                        <div class="text-right">
                            <span class="block text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold uppercase">Stock: {{ p.stock_para_ver }}</span>
                        </div>
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
    </main>

</body>
</html>
"""

if __name__ == '__main__':
    app.run(port=5000, debug=True)