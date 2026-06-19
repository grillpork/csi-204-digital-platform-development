import React from 'react'

const Product = ({ title, image, rating, itemsSold, price, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all border border-slate-100/60 duration-300 flex flex-col cursor-pointer hover:scale-[1.01]"
    >
      {/* Product Image Container */}
      <div className="h-60 sm:h-45 bg-slate-50 w-full  relative overflow-hidden flex items-center justify-center select-none">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* Heart Icon Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite click if needed
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-xs hover:scale-110 transition-transform active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      {/* Card Details section */}
      <div className="p-4 space-y-2 flex flex-col justify-between flex-grow">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem] leading-tight">
          {title}
        </h3>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-1 text-[10px] sm:text-[8px] text-slate-400 font-medium">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{rating} | {itemsSold} item sold</span>
          </div>
          <span className="text-xs sm:text-[13px] font-bold text-slate-800">{price}</span>
        </div>
      </div>
    </div>
  )
}

export default Product
