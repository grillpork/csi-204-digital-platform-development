"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, X, Trash2, CheckCircle2, CreditCard, QrCode, Truck, Loader2 } from "lucide-react";
import { useProductStore } from "../../store/product";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { formatThaiPhone } from "@/lib/phone";

export default function CartDrawer({ size = 24, className = "" }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer"); // transfer (PromptPay), card (Credit Card), cod
  const [lastTrackingId, setLastTrackingId] = useState("");
  
  // Shipping States
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  // Card States
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState("");
  const [cardExpiryYear, setCardExpiryYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Payment Process States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [promptPayQr, setPromptPayQr] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [paymentExpiresAt, setPaymentExpiresAt] = useState(null);
  const [isPendingPayment, setIsPendingPayment] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(0);


  useEffect(() => {
    setIsMounted(true);
    
    // Load Omise.js dynamically
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.omise.co/omise.js";
      script.async = true;
      script.onload = () => {
        if (window.Omise) {
          const pubKey = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "";
          window.Omise.setPublicKey(pubKey);
        }
      };
      document.body.appendChild(script);
      return () => {
        const existingScript = document.querySelector(`script[src="https://cdn.omise.co/omise.js"]`);
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
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

  // Helper to tokenize card using Omise.js
  const tokenizeCard = () => {
    return new Promise((resolve, reject) => {
      if (!window.Omise) {
        reject(new Error("Omise SDK ยังโหลดไม่เสร็จ กรุณารอสักครู่"));
        return;
      }

      const card = {
        number: cardNumber.replace(/\s?/g, ""),
        name: cardName,
        expiration_month: parseInt(cardExpiryMonth, 10),
        expiration_year: parseInt(cardExpiryYear, 10),
        security_code: parseInt(cardCvv, 10),
      };

      window.Omise.createToken("card", card, (statusCode, response) => {
        if (statusCode === 200) {
          resolve(response.id);
        } else {
          reject(new Error(response.message || "ข้อมูลบัตรไม่ถูกต้อง"));
        }
      });
    });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsProcessing(true);

    try {
      let cardToken = null;

      // 1. ถ้าจ่ายด้วยบัตรเครดิต ให้สร้าง Token ก่อน
      if (paymentMethod === "card") {
        if (!cardNumber || !cardName || !cardExpiryMonth || !cardExpiryYear || !cardCvv) {
          throw new Error("กรุณากรอกข้อมูลบัตรเครดิตให้ครบถ้วน");
        }
        cardToken = await tokenizeCard();
      }

      // 2. ส่งข้อมูลไปยัง Backend API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          shippingName,
          shippingAddress,
          shippingPhone,
          cardToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "เกิดข้อผิดพลาดในการสั่งซื้อ");
      }

      // 3. จัดการผลลัพธ์
      if (paymentMethod === "transfer" && result.qrCodeUrl) {
        // แสดง QR Code PromptPay ให้สแกน
        setPurchaseAmount(cartTotal);
        setPromptPayQr(result.qrCodeUrl);
        setCreatedOrderId(result.orderId);
        setPaymentExpiresAt(result.expiresAt);
        clearCart();
      } else if (result.authorizeUri) {
        // กรณีต้องผ่าน 3D Secure บัตรเครดิต ให้เปลี่ยนเส้นทางไปยืนยัน
        window.location.href = result.authorizeUri;
      } else {
        // ชำระเงินสำเร็จ (บัตรเครดิตแบบธรรมดา หรือ COD)
        setPurchaseAmount(cartTotal);
        setLastTrackingId(result.orderId);
        setIsCheckoutOpen(false);
        setIsOpen(false);
        clearCart();
        setIsSuccessModalOpen(true);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayLater = () => {
    setLastTrackingId(createdOrderId);
    setIsPendingPayment(true);
    setPromptPayQr(null);
    setIsCheckoutOpen(false);
    setIsOpen(false);
    setIsSuccessModalOpen(true);
  };

  const closeAll = () => {
    setIsOpen(false);
    setIsCheckoutOpen(false);
    setPromptPayQr(null);
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
          <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-all duration-300 backdrop-blur-xs"
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
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ShoppingCart size={20} />
            ตะกร้าสินค้าของคุณ
          </h2>
          <button 
            onClick={closeAll}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto text-slate-600">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
              <ShoppingCart size={48} className="text-slate-300" />
              <p className="text-slate-400 text-sm">ไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size || 'M'}-${item.color || 'White'}`} className="flex gap-3 border-b pb-4 border-slate-100">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md bg-slate-50" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-slate-950 truncate">{item.name}</h3>
                    {item.size && item.color && (
                      <p className="text-slate-500 text-xs mt-0.5">ไซส์: {item.size} | สี: {item.color}</p>
                    )}
                    <p className="text-slate-400 text-xs mt-0.5">฿{item.price.toLocaleString("th-TH")} × {item.quantity}</p>
                    <p className="font-semibold text-sm text-slate-900 mt-1">฿{(item.price * item.quantity).toLocaleString("th-TH")}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.size || 'M', item.color || 'White')}
                    className="text-slate-400 hover:text-red-500 self-start p-1 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-center mb-4 font-semibold text-slate-900">
            <span className="text-sm">ยอดรวมทั้งหมด:</span>
            <span className="text-lg">฿{cartTotal.toLocaleString("th-TH")}</span>
          </div>
          <button 
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
          >
            ดำเนินการสั่งซื้อ
          </button>
        </div>

        {/* Sub Drawer (Checkout Form) */}
        <div 
          className={`absolute inset-0 bg-white z-10 transform transition-transform duration-300 ease-in-out flex flex-col ${
            isCheckoutOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Truck size={20} />
              ข้อมูลการสั่งซื้อ
            </h2>
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              {/* Shipping Form */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ที่อยู่จัดส่ง</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อผู้รับ</label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="ชื่อ-นามสกุล"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(formatThaiPhone(e.target.value))}
                    placeholder="095-807-2692"
                    inputMode="numeric"
                    pattern="0[0-9]{2}-[0-9]{3}-[0-9]{4}"
                    minLength={12}
                    maxLength={12}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">ที่อยู่สำหรับการจัดส่ง</label>
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ช่องทางชำระเงิน</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("transfer")}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                      paymentMethod === "transfer" 
                        ? "border-slate-900 bg-slate-50 text-slate-950" 
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <QrCode size={20} />
                    สแกนจ่าย
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                      paymentMethod === "card" 
                        ? "border-slate-900 bg-slate-50 text-slate-950" 
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard size={20} />
                    บัตรเครดิต
                  </button>
                </div>
              </div>

              {/* Credit Card Form Fields */}
              {paymentMethod === "card" && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-fadeIn">
                  <h4 className="text-xs font-bold text-slate-500">ข้อมูลบัตรเครดิต</h4>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">หมายเลขบัตร</label>
                    <input
                      type="text"
                      placeholder="xxxx xxxx xxxx xxxx"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-slate-200 bg-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">ชื่อบนบัตร</label>
                    <input
                      type="text"
                      placeholder="ชื่อ-นามสกุลภาษาอังกฤษ"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-slate-200 bg-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">เดือนหมดอายุ</label>
                      <input
                        type="text"
                        placeholder="MM"
                        maxLength={2}
                        value={cardExpiryMonth}
                        onChange={(e) => setCardExpiryMonth(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-center border border-slate-200 bg-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">ปีหมดอายุ (ค.ศ.)</label>
                      <input
                        type="text"
                        placeholder="YYYY"
                        maxLength={4}
                        value={cardExpiryYear}
                        onChange={(e) => setCardExpiryYear(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-center border border-slate-200 bg-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-center border border-slate-200 bg-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="text-xs text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {errorMsg}
                </div>
              )}
            </form>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center mb-4 font-semibold text-slate-900">
              <span className="text-sm">ยอดชำระ:</span>
              <span className="text-lg">฿{cartTotal.toLocaleString("th-TH")}</span>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : (
                "ชำระเงิน"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* PromptPay QR Code Modal */}
      {promptPayQr && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col items-center text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-1">สแกนจ่ายเงินผ่าน PromptPay</h3>
            <p className="text-slate-500 text-xs mb-4">กรุณาสแกน QR Code ด้านล่างเพื่อทำการชำระเงิน</p>
            
            <div className="bg-white border-2 border-slate-100 p-4 rounded-xl shadow-inner mb-4">
              <img src={promptPayQr} alt="PromptPay QR Code" className="w-48 h-48" />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg w-full mb-6 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase">ยอดเงินที่ต้องชำระ</span>
              <p className="text-lg font-bold text-slate-950 mt-0.5">฿{purchaseAmount.toLocaleString("th-TH")}</p>
              {paymentExpiresAt && <p className="mt-1 text-[10px] text-slate-500">QR ใช้ได้ถึง {new Date(paymentExpiresAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.</p>}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p className="mb-3 text-xs text-amber-700">สถานะจะเปลี่ยนเป็น “ชำระแล้ว” เมื่อระบบได้รับการยืนยันจากผู้ให้บริการชำระเงินเท่านั้น</p>
              <button 
                onClick={handlePayLater}
                className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm"
              >
                ชำระภายหลัง
              </button>
              <Link href="/profile/orders" onClick={handlePayLater} className="w-full bg-slate-100 text-slate-600 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm">ดูคำสั่งซื้อของฉัน</Link>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{isPendingPayment ? "บันทึกออเดอร์ไว้แล้ว" : "สั่งซื้อสินค้าสำเร็จ!"}</h2>
            <p className="text-slate-500 text-sm mb-4">{isPendingPayment ? "ออเดอร์อยู่ในสถานะรอชำระเงิน คุณกลับมาชำระต่อได้จากประวัติคำสั่งซื้อ" : "ระบบได้รับคำสั่งซื้อเรียบร้อยแล้ว"}</p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 w-full mb-6 text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">หมายเลขอ้างอิงออเดอร์</span>
              <p className="text-sm font-mono font-bold text-slate-800 mt-0.5">{lastTrackingId}</p>
            </div>
            
            <div className="flex flex-col gap-2 w-full">
              <Link 
                href="/profile/orders"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors block text-center text-sm"
              >
                {isPendingPayment ? "ไปที่ประวัติคำสั่งซื้อ" : "ดูคำสั่งซื้อของฉัน"}
              </Link>
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
              >
                เลือกซื้อสินค้าต่อ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
