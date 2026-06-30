"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, X, Trash2, CheckCircle2 } from "lucide-react";
import { useProductStore } from "../../store/product";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function CartDrawer({ size = 24, className = "" }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [lastTrackingId, setLastTrackingId] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration-guard pattern
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchParams && searchParams.get("checkout") === "true") {
      setIsOpen(true);
      setIsCheckoutOpen(true);
      
      const params = new URLSearchParams(window.location.search);
      params.delete("checkout");
      const newQuery = params.toString() ? `?${params.toString()}` : "";
      router.replace(window.location.pathname + newQuery);
    }
  }, [searchParams, router]);

  const cart = useProductStore((state) => state.cart);
  const fetchCart = useProductStore((state) => state.fetchCart);
  const removeFromCart = useProductStore((state) => state.removeFromCart);
  const clearCart = useProductStore((state) => state.clearCart);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    
    // Create simulated order
    const trackingNo = `SHIRTSY-${Math.floor(10000 + Math.random() * 90000)}`;
    setLastTrackingId(trackingNo);

    // Get user address if exists
    let shippingAddress = "123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110";
    try {
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.address) {
          shippingAddress = profile.address;
        }
      }
    } catch (err) {
      console.error(err);
    }

    const newOrder = {
      trackingNumber: trackingNo,
      date: new Date().toLocaleDateString("th-TH"),
      paymentMethod: paymentMethod,
      total: cartTotal,
      status: "placed", // Default start status
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingAddress: shippingAddress
    };

    // Save order history in localStorage
    try {
      const existing = localStorage.getItem("shirtsy_orders");
      const orders = existing ? JSON.parse(existing) : [];
      orders.unshift(newOrder);
      localStorage.setItem("shirtsy_orders", JSON.stringify(orders));
    } catch (err) {
      console.error(err);
    }

    // Simulate payment process
    setIsCheckoutOpen(false);
    setIsOpen(false);
    clearCart();
    setIsSuccessModalOpen(true);
  };

  const closeAll = () => {
    setIsOpen(false);
    setIsCheckoutOpen(false);
  };

  if (!isMounted) {
    return (
      <button className={`relative inline-flex ${className}`}>
        <ShoppingCart size={size} />
      </button>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative inline-flex ${className}`}
      >
        <ShoppingCart size={size} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-all duration-300"
          onClick={closeAll}
        />
      )}

      {/* Main Cart Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-semibold text-slate-800">Your Cart</h2>
          <button 
            onClick={closeAll}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto text-slate-600">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingCart size={48} className="text-slate-300" />
              <p>Your cart is currently empty.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4 border-slate-100">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-2 text-slate-800">{item.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{item.price}.00 AUD x {item.quantity}</p>
                    <p className="font-semibold mt-1 text-slate-800">{(item.price * item.quantity)}.00 AUD</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 self-start p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex justify-between items-center mb-4 font-semibold text-lg text-slate-800">
            <span>Total:</span>
            <span>{cartTotal}.00 AUD</span>
          </div>
          <button 
            className="w-full bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
          >
            Checkout
          </button>
        </div>

        {/* Sub Drawer (Checkout Form) */}
        <div 
          className={`absolute bottom-4 -left-4 h-[480px] w-full bg-white shadow-[-5px_0_15px_rgba(0,0,0,0.05)] border-slate-200 rounded-lg overflow-hidden  transform transition-all duration-300 ease-in-out flex flex-col z-[-1] ${
            isCheckoutOpen ? "-translate-x-full opacity-100" : "translate-x-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="text-xl font-semibold text-slate-800">Checkout</h2>
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 flex-1 ">
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === "transfer"}
                      onChange={() => setPaymentMethod("transfer")}
                    />
                    โอนเงิน / บัตรเครดิต
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    เก็บเงินปลายทาง (COD)
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex justify-between items-center mb-4 font-semibold text-lg text-slate-800">
              <span>{paymentMethod === "cod" ? "ยอดชำระปลายทาง:" : "Pay:"}</span>
              <span>{cartTotal}.00 AUD</span>
            </div>
            <button
              type="submit"
              form="checkout-form"
              className="w-full bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition-colors"
            >
              {paymentMethod === "cod" ? "ยืนยันคำสั่งซื้อ" : "Confirm Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center transform transition-all">
            <CheckCircle2 size={64} className="text-green-500 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
            <p className="text-slate-600 mb-2">Thank you for your purchase.</p>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 w-full mb-6">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">หมายเลขพัสดุสำหรับติดตามสินค้า</span>
              <p className="text-sm font-mono font-bold text-slate-800 mt-0.5">{lastTrackingId}</p>
            </div>
            
            <div className="flex flex-col gap-2 w-full">
              <Link 
                href={`/tracking?id=${lastTrackingId}`}
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition-colors block text-center text-sm"
              >
                ติดตามการส่งสินค้า
              </Link>
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-md font-medium hover:bg-slate-200 transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
