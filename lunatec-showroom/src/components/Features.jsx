// src/components/Features.jsx
import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react'

const beneficios = [
  { icon: <Truck className="text-brand" />, title: "Envíos a todo el país", desc: "Llegamos a donde estés" },
  { icon: <ShieldCheck className="text-brand" />, title: "Garantía Real", desc: "Soporte post-venta" },
  { icon: <CreditCard className="text-brand" />, title: "Precios Mayoristas", desc: "El mejor valor del mercado" },
  { icon: <Headphones className="text-brand" />, title: "Atención 24/7", desc: "Respondemos por WhatsApp" },
]

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {beneficios.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 p-3 bg-blue-50 rounded-2xl">
                {item.icon}
              </div>
              <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}