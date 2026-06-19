"use client";

import React, { useState } from "react";
import SidebarFilter from "../components/SidebarFilter";
import HeroBanner from "../components/HeroBanner";
import Product from "../components/ui/Product";
import ProductDetailsModal from "../components/ui/ProductDetailsModal";
import CheckoutModal from "../components/ui/CheckoutModal";
import { useCart } from "../context/CartContext";
import { products } from "./data/product";

export default function Page() {
  const { 
    isCartOpen, 
    cartItems, 
    updateQuantity, 
    toggleSelectItem, 
    toggleSelectAll, 
    clearSelectedItems 
  } = useCart();

  const [activeProduct, setActiveProduct] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [lastPaidAmount, setLastPaidAmount] = useState(0);

  const totalSelectedPrice = cartItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const selectedCount = cartItems.filter((item) => item.selected).length;
  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);

  const handlePayNow = () => {
    if (selectedCount === 0) {
      alert("Please select at least one item to pay.");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = (details) => {
    setShippingInfo(details);
    setLastPaidAmount(totalSelectedPrice);
    setCheckoutSuccess(true);
    setShowCheckoutModal(false);
    clearSelectedItems();
  };

  return (
    <div className="max-w-9xl mx-auto w-full px-4 md:px-6 py-8 flex flex-col md:flex-row gap-6 relative">
      {/* Sidebar Filter */}
      <SidebarFilter />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[900px] flex flex-col gap-6">
        {/* Hero Banner with Categories */}
        <HeroBanner />

        {/* Product Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#9c653f] tracking-wide">
            All Product
          </h2>
          
          {/* Grid Layout (4 columns on large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Product
                key={product.id}
                title={product.title}
                image={product.image}
                rating={product.rating}
                itemsSold={product.itemsSold}
                price={`฿${product.price.toFixed(2)}`}
                onClick={() => setActiveProduct(product)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cart Column */}
      {isCartOpen && (
        <div className="w-full md:w-72 sm:w-[310px] bg-white border border-[#ebd6cb] rounded-3xl p-4 shadow-sm self-start text-slate-800 animate-in fade-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-800">My cart ({cartItems.length})</h3>
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={() => toggleSelectAll(!allSelected)}
                className="text-[11px] text-slate-400 font-semibold hover:text-slate-600 transition-colors cursor-pointer"
              >
                {allSelected ? "deselect all" : "select all"}
              </button>
            </div>
          </div>

          {/* Items list */}
          <div className="space-y-3.5 my-3 max-h-[360px] overflow-y-auto pr-0.5 scrollbar-thin">
            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                Your cart is empty
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2.5 py-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelectItem(item.id)}
                    className="w-4 h-4 rounded-full border border-[#ebd6cb] bg-white flex items-center justify-center flex-shrink-0 cursor-pointer"
                  >
                    {item.selected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7c5c43]" />
                    )}
                  </button>

                  {/* Product image */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 bg-[#FFFAF8] flex items-center justify-center">
                    <img src={item.product.image} alt={item.product.title} className="w-12 h-12 object-contain" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-14">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{item.product.title}</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-[9px] text-[#7c5c43] font-bold bg-[#fbebe3] px-1.5 py-0.5 rounded">
                          {item.selectedSize}
                        </span>
                        <span className="w-2 h-2 rounded-full border border-slate-200" style={{ backgroundColor: item.selectedColor.hex }} title={item.selectedColor.name} />
                        <span className="text-[9px] text-slate-400 font-medium truncate max-w-[80px]">
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-4 h-4 flex items-center justify-center rounded bg-[#fbebe3] text-[#7c5c43] font-bold text-[10px] hover:bg-[#f6decb] transition-colors cursor-pointer select-none"
                        >
                          -
                        </button>
                        <span className="text-[10px] font-semibold px-1.5 text-slate-700">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-4 h-4 flex items-center justify-center rounded bg-[#fbebe3] text-[#7c5c43] font-bold text-[10px] hover:bg-[#f6decb] transition-colors cursor-pointer select-none"
                        >
                          +
                        </button>
                      </div>
                      {/* Price */}
                      <span className="text-xs font-bold text-slate-800">฿{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold">Total Selected ({selectedCount})</span>
                <span className="text-sm font-extrabold text-[#7c5c43]">฿{totalSelectedPrice.toFixed(2)}</span>
              </div>
              <button 
                onClick={handlePayNow}
                className="px-5 py-2 bg-[#7c5c43] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#684b34] active:scale-95 transition-all cursor-pointer"
              >
                Pay now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Details Modal */}
      {activeProduct && (
        <ProductDetailsModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}

      {/* Checkout Modal Form */}
      {showCheckoutModal && (
        <CheckoutModal
          totalAmount={totalSelectedPrice}
          onClose={() => setShowCheckoutModal(false)}
          onConfirm={handleConfirmCheckout}
        />
      )}

      {/* Checkout Success Popup */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800">Payment Successful!</h3>
            <p className="text-xs text-slate-500 mt-2">
              We have received your payment of <span className="font-bold text-[#7c5c43]">฿{lastPaidAmount.toFixed(2)}</span>. Your order will be processed shortly.
            </p>
            {shippingInfo && (
              <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl text-left border border-slate-100/60 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 tracking-wider">SHIPPING INFORMATION</div>
                <div className="text-[11px] font-bold text-slate-700 leading-tight">{shippingInfo.name}</div>
                <div className="text-[10px] text-slate-500 leading-relaxed font-medium">{shippingInfo.address}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Tel: {shippingInfo.phone}</div>
              </div>
            )}
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setShippingInfo(null);
              }}
              className="mt-6 w-full py-2.5 bg-[#7c5c43] hover:bg-[#684b34] text-white text-xs font-bold rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
