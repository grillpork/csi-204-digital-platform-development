import { useEffect, useState } from "react";
import { X, ShoppingCart, Heart } from "lucide-react";
import { useProductStore } from "../../store/product";

export default function ProductDetailDrawer({ product, isOpen, onClose }) {
  const addToCart = useProductStore((state) => state.addToCart);
  const favorites = useProductStore((state) => state.favorites);
  const toggleFavorite = useProductStore((state) => state.toggleFavorite);

  // States to handle animation properly
  const [displayProduct, setDisplayProduct] = useState(product);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (product) setDisplayProduct(product);
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "unset";
      setShow(false);
      const t = setTimeout(() => setDisplayProduct(null), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!displayProduct) return null;

  const isFavorited = favorites.includes(displayProduct.id);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 backdrop-blur-[2px] ${show ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Bottom Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 mx-auto w-full h-[90vh] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl z-[70] transform transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${show ? "translate-y-0" : "translate-y-full"
          }`}
      >
        {/* Header / Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-6 text-slate-800"
          >
            <X size={32} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col sm:flex-row p-6 sm:p-10 gap-8 sm:gap-12 relative items-start">

          {/* Left Column: Title and Description (Sticky & Centered) */}
          <div className="w-full sm:w-1/3 flex flex-col order-2 sm:order-1 sm:sticky sm:top-10 sm:h-[calc(90vh-8rem)] justify-center pb-6 sm:pb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 leading-tight">{displayProduct.name}</h2>

            <div className="space-y-4 text-slate-600 leading-relaxed">
              <h3 className="font-semibold text-slate-900 text-2xl">Product Description</h3>
              <p>
                Experience premium comfort and style with this carefully crafted piece.
                Perfect for any occasion, it seamlessly blends modern aesthetics with timeless design.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-1 mt-4 text-sm">
                <li>High-quality premium materials</li>
                <li>Comfortable, tailored fit</li>
                <li>Durable construction for everyday wear</li>
                <li>Easy care instructions included</li>
              </ul>
            </div>
          </div>

          <div className="w-full sm:w-1/3 flex flex-col gap-4 order-1 sm:order-2">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="relative w-full bg-slate-50 rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center shadow-sm border border-slate-100">
                <img src={displayProduct.image} alt={`${displayProduct.name} view ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Right Column: Price & Add to Cart (Sticky & Centered) */}
          <div className="w-full sm:w-1/3 flex flex-col order-3 sm:sticky sm:top-10 sm:h-[calc(90vh-8rem)] justify-center">
            <div className="p-8 flex flex-col">
              <p className="text-black uppercase font-semibold mb-2 text-2xl">{displayProduct.name}</p>
              <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">Price</p>

              <p className="text-4xl font-bold text-slate-900 mb-8">{displayProduct.price}.00 <span className="text-xl text-slate-500 font-medium">AUD</span></p>

              <div className="mt-auto">
                <button
                  onClick={() => {
                    addToCart(displayProduct);
                    onClose();
                  }}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleFavorite(displayProduct.id)}
                  className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold text-lg hover:bg-slate-50 hover:border-slate-400 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                >
                  <Heart
                    strokeWidth={isFavorited ? 0 : 2}
                    size={20}
                    className={`transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-800"}`}
                  />
                  Add to Favorites
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">Free shipping on orders over 150 AUD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
