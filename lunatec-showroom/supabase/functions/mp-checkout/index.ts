import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MercadoPagoConfig, Preference } from 'npm:mercadopago'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cartItems, userId } = await req.json()

    if (!cartItems || cartItems.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const token = Deno.env.get('MP_ACCESS_TOKEN');
    if (!token) {
       throw new Error("Falta el token de Mercado Pago en Supabase Secrets");
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const items = cartItems.map((item: any, index: number) => {
      const precio = Number(item.precio_venta);
      if (isNaN(precio) || precio <= 0) {
         throw new Error(`El producto ${item.nombre} tiene un precio inválido: ${item.precio_venta}`);
      }

      return {
        id: item.id ? item.id.toString() : `item-${index}`,
        title: item.nombre || 'Producto sin nombre',
        quantity: Number(item.quantity) || 1,
        unit_price: precio,
        currency_id: 'ARS',
      };
    });

    const body = {
      items: items,
      back_urls: {
        success: "https://lunatec-showroom.onrender.com/success",
        failure: "https://lunatec-showroom.onrender.com/failure",
        pending: "https://lunatec-showroom.onrender.com/pending",
      },
      auto_return: "approved",
      
      metadata: {
        usuario_id: userId
      },
      
      notification_url: "https://qwyoqfcaepmqzdzzwmlh.supabase.co/functions/v1/mp-webhook"
    };

    const response = await preference.create({ body });

    return new Response(
      JSON.stringify({ ok: true, init_point: response.init_point }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, errorDetallado: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})