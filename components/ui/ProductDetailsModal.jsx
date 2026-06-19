"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function ProductDetailsModal({ product, onClose }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  if (!product) return null;

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsCartOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/85 border border-slate-200 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>

        {/* Left Side: Product Image */}
        <div className="w-full md:w-1/2 min-h-[300px] md:h-auto bg-[#FFFAF8] relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-slate-100/60 p-4">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-[350px] w-full object-contain rounded-2xl"
          />
        </div>

        {/* Right Side: Product Details & Controls */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[90vh] text-slate-800">
          <div>
            <span className="text-[10px] text-[#9c653f] font-bold tracking-wider uppercase bg-[#fbebe3] px-2.5 py-1 rounded-full">
              New Arrival
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mt-3 leading-snug">
              {product.title}
            </h2>
            
            {/* Rating and Sold */}
            <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center text-yellow-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-slate-700 font-bold">{product.rating}</span>
              </div>
              <span>•</span>
              <span>{product.itemsSold} items sold</span>
            </div>

            {/* Price */}
            <div className="text-xl font-extrabold text-slate-900 mt-3.5">
              ฿{product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 mt-3.5 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-5">
                <span className="text-xs font-bold text-slate-700 block mb-2">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-[#7c5c43] border-[#7c5c43] text-white shadow-xs"
                          : "bg-white border-[#ebd6cb] text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Select Color: <span className="text-slate-500 font-normal">{selectedColor?.name}</span>
                </span>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor?.name === color.name
                          ? "border-[#7c5c43] scale-110 ring-2 ring-[#7c5c43]/20"
                          : "border-slate-200 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.hex.toLowerCase() === "#ffffff" ? "text-slate-800" : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key specs */}
            {product.details && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-slate-700 block mb-2">Product Specifications</span>
                <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-1">
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity and Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Quantity</span>
              {/* Quantity picker */}
              <div className="flex items-center bg-[#fbebe3]/70 border border-[#ebd6cb] rounded-xl px-2 py-1">
                <button
                  onClick={handleDecreaseQuantity}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-[#7c5c43] font-bold text-xs hover:bg-[#ebd6cb] transition-colors cursor-pointer select-none"
                >
                  -
                </button>
                <span className="text-xs font-bold px-4 text-slate-700 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-[#7c5c43] font-bold text-xs hover:bg-[#ebd6cb] transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 mt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 border border-[#7c5c43] text-[#7c5c43] text-xs font-bold rounded-xl hover:bg-slate-50 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 bg-[#7c5c43] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#684b34] active:scale-98 transition-all cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {addedMessage && (
              <div className="text-center text-xs font-semibold text-green-600 animate-fade-in">
                ✓ Added to cart successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
