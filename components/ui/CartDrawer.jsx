"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, X, Trash2, CheckCircle2 } from "lucide-react";
import { useProductStore } from "../../store/product";

export default function CartDrawer({ size = 24, className = "" }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");

  useEffect(() => {
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

  const cart = useProductStore((state) => state.cart);
  const removeFromCart = useProductStore((state) => state.removeFromCart);
  const clearCart = useProductStore((state) => state.clearCart);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
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
      <button className={`relative flex items-center justify-center ${className}`}>
        <ShoppingCart size={size} />
      </button>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className={`relative flex items-center justify-center ${className}`}
      >
        <ShoppingCart size={size} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full pointer-events-none">
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
          <h2 className="text-xl font-semibold text-slate-800">ตะกร้าสินค้า</h2>
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
              <p>ตะกร้าสินค้าของคุณยังว่างเปล่า</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4 border-slate-100">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-2 text-slate-800">{item.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{item.price} บาท x {item.quantity}</p>
                    <p className="font-semibold mt-1 text-slate-800">{(item.price * item.quantity)} บาท</p>
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
            <span>ยอดรวม:</span>
            <span>{cartTotal} บาท</span>
          </div>
          <button 
            className="w-full bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
          >
            ชำระเงิน
          </button>
        </div>

        {/* Sub Drawer (Checkout Form) */}
        <div 
          className={`absolute bottom-4 -left-4 h-[480px] w-full bg-white shadow-[-5px_0_15px_rgba(0,0,0,0.05)] border-slate-200 rounded-lg overflow-hidden  transform transition-all duration-300 ease-in-out flex flex-col z-[-1] ${
            isCheckoutOpen ? "-translate-x-full opacity-100" : "translate-x-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="text-xl font-semibold text-slate-800">ชำระเงิน</h2>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">ช่องทางการชำระเงิน</label>
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
              <span>{paymentMethod === "cod" ? "ยอดชำระปลายทาง:" : "ยอดชำระ:"}</span>
              <span>{cartTotal} บาท</span>
            </div>
            <button
              type="submit"
              form="checkout-form"
              className="w-full bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition-colors"
            >
              {paymentMethod === "cod" ? "ยืนยันคำสั่งซื้อ" : "ยืนยันการชำระเงิน"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center transform transition-all">
            <CheckCircle2 size={64} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ชำระเงินสำเร็จ!</h2>
            <p className="text-slate-600 mb-8">ขอบคุณสำหรับการสั่งซื้อ เราจะส่งใบเสร็จให้คุณทางอีเมลเร็วๆ นี้</p>
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition-colors"
            >
              เลือกซื้อสินค้าต่อ
            </button>
          </div>
        </div>
      )}
    </>
  );
}
