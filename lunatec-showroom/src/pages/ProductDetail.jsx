import { useEffect, useState, useContext, useMemo, useRef, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';
import { supabase } from '../supabase';
import { CartContext } from '../context/CartContext';
import { trackEvent } from '../utils/analytics';

const BUCKET = 'images';
const LARGE_FOLDER = '800';
const MAX_IMAGE_SLOTS = 12;

const buildFileName = (sku, index) => {
  if (!sku) return '';
  return index === 0 ? `${sku}.webp` : `${sku}-${index}.webp`;
};

const getPublicUrl = (folder, fileName) => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${folder}/${fileName}`);
  return data?.publicUrl || '';
};

const doesImageExist = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  const [imageUrls, setImageUrls] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const carouselRef = useRef(null);
  const dragRef = useRef(null);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    async function fetchProducto() {
      const { data } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProducto(data);

        const sessionId = Cookies.get('lunatec_session_id');

        let recentProducts = [];
        const savedRecent = Cookies.get('lunatec_recent_products');
        if (savedRecent) {
          try {
            recentProducts = JSON.parse(savedRecent);
          } catch (e) {}
        }

        recentProducts = [data.id, ...recentProducts.filter((pid) => pid !== data.id)].slice(0, 5);
        Cookies.set('lunatec_recent_products', JSON.stringify(recentProducts), { expires: 7, path: '/' });

        trackEvent(
          'product_view',
          `/producto/${data.id}`,
          {
            product_name: data.nombre,
            session_id: sessionId,
          },
          String(data.id)
        );
      }

      setLoading(false);
    }

    fetchProducto();
  }, [id]);

  useEffect(() => {
    if (!producto) return;

    const startTime = Date.now();
    const sessionId = Cookies.get('lunatec_session_id');

    return () => {
      const endTime = Date.now();
      const timeSpentInSeconds = Math.round((endTime - startTime) / 1000);

      trackEvent(
        'time_spent',
        location.pathname,
        {
          seconds: timeSpentInSeconds,
          product_name: producto.nombre,
          session_id: sessionId,
        },
        producto.id
      );
    };
  }, [producto, location.pathname]);

  useEffect(() => {
    let cancelled = false;

    async function loadProductImages() {
      if (!producto) return;

      const codigoImagen = (producto.imagen_codigo || producto.sku || '').toString().trim();

      if (!codigoImagen) {
        setImageUrls([]);
        setActiveImageIndex(0);
        setImageLoading(false);
        return;
      }

      setImageLoading(true);

      const found = [];

      for (let i = 0; i < MAX_IMAGE_SLOTS; i++) {
        const fileName = buildFileName(codigoImagen, i);
        const url = getPublicUrl(LARGE_FOLDER, fileName);
        const exists = await doesImageExist(url);

        if (cancelled) return;

        if (exists) {
          found.push(url);
        } else if (i > 0 && found.length > 0) {
          break;
        }
      }

      if (cancelled) return;

      setImageUrls(found);
      setActiveImageIndex(0);
      setImageLoading(false);
    }

    loadProductImages();

    return () => {
      cancelled = true;
    };
  }, [producto]);

  const handleAddToCart = () => {
    addToCart(producto, 1);
    const sessionId = Cookies.get('lunatec_session_id');
    trackEvent(
      'add_to_cart_detail',
      location.pathname,
      {
        product_name: producto.nombre,
        price: producto.precio_venta,
        session_id: sessionId,
      },
      producto.id
    );
  };

  const hasMultipleImages = imageUrls.length > 1;

  const goToImage = useCallback(
    (nextIndex) => {
      if (!imageUrls.length) return;
      const clamped = Math.max(0, Math.min(nextIndex, imageUrls.length - 1));
      setActiveImageIndex(clamped);
    },
    [imageUrls.length]
  );

  const changeImage = useCallback(
    (delta) => {
      setActiveImageIndex((prev) => {
        const next = prev + delta;
        return Math.max(0, Math.min(next, imageUrls.length - 1));
      });
    },
    [imageUrls.length]
  );

  const goPrev = useCallback(() => {
    changeImage(-1);
  }, [changeImage]);

  const goNext = useCallback(() => {
    changeImage(1);
  }, [changeImage]);

  const handlePointerDown = useCallback(
    (e) => {
      if (!hasMultipleImages) return;

      dragRef.current = {
        startX: e.clientX,
        width: e.currentTarget.getBoundingClientRect().width,
      };

      dragOffsetRef.current = 0;
      setIsDragging(true);
      setDragOffset(0);

      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    [hasMultipleImages]
  );

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    dragOffsetRef.current = dx;
    setDragOffset(dx);
  }, []);

  const finishDrag = useCallback(
    (e) => {
      if (!dragRef.current) return;

      const dx = dragOffsetRef.current;
      const width = dragRef.current.width || 1;
      const threshold = Math.min(120, width * 0.18);

      if (dx < -threshold) {
        goToImage(activeImageIndex + 1);
      } else if (dx > threshold) {
        goToImage(activeImageIndex - 1);
      }

      dragRef.current = null;
      dragOffsetRef.current = 0;
      setIsDragging(false);
      setDragOffset(0);

      e.currentTarget.releasePointerCapture?.(e.pointerId);
    },
    [activeImageIndex, goToImage]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!hasMultipleImages) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasMultipleImages, goPrev, goNext]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-display font-black text-gray-800 mb-4 tracking-tighter uppercase">
          Producto no encontrado
        </h2>
        <Link
          to="/"
          className="px-6 py-3 bg-brand-pink text-white rounded-xl font-display font-black uppercase tracking-tight hover:bg-brand-dark transition-all"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 font-sans">
      <Link
        to="/"
        className="inline-flex items-center text-gray-400 hover:text-brand-pink font-display font-black text-xs tracking-widest mb-8 transition-colors group uppercase"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="bg-white rounded-3xl p-4 md:p-12 border border-gray-100 shadow-sm flex items-center justify-center aspect-square overflow-hidden">
          <div className="w-full">
            <div
              ref={carouselRef}
              className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-50 select-none"
              style={{
                touchAction: 'pan-y',
                cursor: hasMultipleImages ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
            >
              {imageLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin" />
                </div>
              ) : imageUrls.length > 0 ? (
                <div
                  className="flex h-full w-full"
                  style={{
                    transform: `translate3d(calc(${-activeImageIndex * 100}% + ${dragOffset}px), 0, 0)`,
                    transition: isDragging
                      ? 'none'
                      : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                    willChange: 'transform',
                  }}
                >
                  {imageUrls.map((url, index) => (
                    <div key={url} className="min-w-full h-full flex items-center justify-center bg-white">
                      <img
                        src={url}
                        alt={`${producto.nombre} - imagen ${index + 1}`}
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm text-center px-6">
                  No hay imágenes cargadas para este producto
                </div>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={goPrev}
                    disabled={activeImageIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-sm flex items-center justify-center transition-opacity disabled:opacity-30 z-20 pointer-events-auto"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={goNext}
                    disabled={activeImageIndex === imageUrls.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-sm flex items-center justify-center transition-opacity disabled:opacity-30 z-20 pointer-events-auto"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {hasMultipleImages && (
                <>
                  <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white/25 to-transparent pointer-events-none" />
                  <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white/25 to-transparent pointer-events-none" />
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-2">
                  {imageUrls.map((_, index) => {
                    const isActive = index === activeImageIndex;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => goToImage(index)}
                        aria-label={`Ver imagen ${index + 1}`}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: isActive ? '22px' : '8px',
                          height: '8px',
                          background: isActive ? '#111827' : '#D1D5DB',
                        }}
                      />
                    );
                  })}
                </div>

                <div className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
                  Desliza para ver más imágenes
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="mb-6">
            <span className="bg-gray-100 text-gray-500 text-[10px] font-mono font-bold px-2 py-1 rounded uppercase tracking-widest">
              SKU: {producto.sku || 'N/A'}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mt-4 leading-none uppercase tracking-tighter">
              {producto.nombre}
            </h1>
          </div>

          <div className="text-5xl md:text-6xl font-mono font-black text-[#73A839] mb-8 pb-8 border-b border-gray-100 tracking-tighter">
            ${Number(producto.precio_venta).toLocaleString('es-AR')}
          </div>

          <div className="mb-10">
            <h4 className="text-gray-400 uppercase text-[10px] font-display font-black tracking-widest mb-4">
              Descripción del producto
            </h4>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium">
              {producto.descripcion || 'Este producto no tiene una descripción detallada todavía.'}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            {producto.stock_actual > 0 ? (
              <>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-5 bg-brand-pink hover:bg-brand-dark text-white rounded-2xl font-display font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-pink/20 uppercase tracking-tighter"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Añadir al carrito
                </button>

                <a
                  href={`https://wa.me/5493815135998?text=Hola! Me interesa el producto: ${producto.nombre.toUpperCase()} (SKU: ${producto.sku})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-2xl font-display font-black text-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-tighter"
                >
                  <MessageCircle className="w-6 h-6" />
                  Consultar por WhatsApp
                </a>
              </>
            ) : (
              <div className="w-full py-5 bg-gray-100 text-gray-400 rounded-2xl font-display font-black text-xl text-center cursor-not-allowed uppercase border-2 border-dashed border-gray-200 tracking-tighter">
                Agotado temporalmente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}