"use client";

import React, { useState } from "react";
import { X, CreditCard, MapPin, Phone, User } from "lucide-react";

export default function CheckoutModal({ totalAmount, onClose, onConfirm }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleValidation = () => {
    const tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Full name is required";
    if (!form.address.trim()) tempErrors.address = "Shipping address is required";
    if (!form.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{9,15}$/.test(form.phone.trim())) {
      tempErrors.phone = "Invalid phone number format";
    }
    if (!form.cardName.trim()) tempErrors.cardName = "Cardholder name is required";
    if (!form.cardNumber.trim()) {
      tempErrors.cardNumber = "Card/Account number is required";
    } else if (!/^\d{10,19}$/.test(form.cardNumber.replace(/\s/g, ""))) {
      tempErrors.cardNumber = "Must be a valid 10-19 digit card or account number";
    }
    if (!form.expiry.trim()) {
      tempErrors.expiry = "Required";
    } else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      tempErrors.expiry = "MM/YY format";
    }
    if (!form.cvv.trim()) {
      tempErrors.cvv = "Required";
    } else if (!/^\d{3,4}$/.test(form.cvv)) {
      tempErrors.cvv = "3-4 digits";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      onConfirm(form);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Modal Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative animate-in zoom-in-95 duration-200 text-slate-800 max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#FFFAF8]">
          <div>
            <h2 className="text-base font-bold text-slate-800">Checkout & Payment</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Enter your shipping information and payment details
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Form Fields container */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Total Amount Badge */}
          <div className="bg-[#fbebe3]/60 border border-[#ebd6cb] rounded-2xl p-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-[#6b4c4f]">Total Amount Due:</span>
            <span className="text-base font-extrabold text-[#7c5c43]">฿{totalAmount.toFixed(2)}</span>
          </div>

          {/* Section 1: Shipping Address */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-1.5">
              <MapPin className="w-4 h-4 text-[#7c5c43]" />
              <span className="text-xs font-bold text-[#7c5c43]">Shipping Address</span>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">RECIPIENT NAME</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Madison Beer"
                  className={`w-full text-xs bg-slate-50 border rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-[#7c5c43] ${
                    errors.name ? "border-red-400 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                <User className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
              </div>
              {errors.name && <p className="text-[9px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">SHIPPING ADDRESS</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="2"
                placeholder="Street address, building name, province, zip code"
                className={`w-full text-xs bg-slate-50 border rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#7c5c43] resize-none ${
                  errors.address ? "border-red-400 bg-red-50/10" : "border-slate-200"
                }`}
              />
              {errors.address && (
                <p className="text-[9px] text-red-500 mt-1 font-semibold">{errors.address}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">CONTACT PHONE</label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0812345678"
                  className={`w-full text-xs bg-slate-50 border rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-[#7c5c43] ${
                    errors.phone ? "border-red-400 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                <Phone className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
              </div>
              {errors.phone && <p className="text-[9px] text-red-500 mt-1 font-semibold">{errors.phone}</p>}
            </div>
          </div>

          {/* Section 2: Account/Payment Details */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-1.5">
              <CreditCard className="w-4 h-4 text-[#7c5c43]" />
              <span className="text-xs font-bold text-[#7c5c43]">Payment Details (Credit/Debit or Bank Account)</span>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">CARDHOLDER / ACCOUNT NAME</label>
              <input
                type="text"
                name="cardName"
                value={form.cardName}
                onChange={handleChange}
                placeholder="NAME ON CARD"
                className={`w-full text-xs bg-slate-50 border rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#7c5c43] ${
                  errors.cardName ? "border-red-400 bg-red-50/10" : "border-slate-200"
                }`}
              />
              {errors.cardName && (
                <p className="text-[9px] text-red-500 mt-1 font-semibold">{errors.cardName}</p>
              )}
            </div>

            {/* Card Number */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">CARD / ACCOUNT NUMBER</label>
              <input
                type="text"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX XXXX"
                className={`w-full text-xs bg-slate-50 border rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#7c5c43] ${
                  errors.cardNumber ? "border-red-400 bg-red-50/10" : "border-slate-200"
                }`}
              />
              {errors.cardNumber && (
                <p className="text-[9px] text-red-500 mt-1 font-semibold">{errors.cardNumber}</p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">EXPIRY DATE (MM/YY)</label>
                <input
                  type="text"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  placeholder="12/28"
                  maxLength="5"
                  className={`w-full text-xs bg-slate-50 border rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#7c5c43] text-center ${
                    errors.expiry ? "border-red-400 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.expiry && (
                  <p className="text-[9px] text-red-500 mt-1 font-semibold">{errors.expiry}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">CVV / CVC</label>
                <input
                  type="password"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                  className={`w-full text-xs bg-slate-50 border rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#7c5c43] text-center ${
                    errors.cvv ? "border-red-400 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.cvv && (
                  <p className="text-[9px] text-red-500 mt-1 font-semibold">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-[#FFFAF8] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 bg-[#7c5c43] text-white text-xs font-bold rounded-xl hover:bg-[#684b34] active:scale-98 transition-all cursor-pointer shadow-md"
          >
            Confirm Payment
          </button>
        </div>
      </form>
    </div>
  );
}
