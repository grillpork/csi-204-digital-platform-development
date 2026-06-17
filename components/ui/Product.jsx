"use client";

import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useProductStore } from "../../store/product";
import ProductDetailDrawer from "./ProductDetailDrawer";

export default function Product() {
  const addToCart = useProductStore((state) => state.addToCart);
  const favorites = useProductStore((state) => state.favorites);
  const toggleFavorite = useProductStore((state) => state.toggleFavorite);

  const [activeProduct, setActiveProduct] = useState(null);

  return (
    <>
      <div className="grid grid-cols-4 gap-1">
        {products.map((product) => {
          const isFavorited = favorites.includes(product.id);
          
          return (
            <div 
              key={product.id} 
              className="flex flex-col items-start gap-2 relative group cursor-pointer"
              onClick={() => setActiveProduct(product)}
            >
              <img src={product.image} alt={product.name} className="aspect-[3/4] w-full object-cover" />
              <div 
                className="flex gap-8 flex-row w-full justify-between text-background absolute top-0 right-0 p-6 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart 
                  strokeWidth={isFavorited ? 0 : 1} 
                  size={32} 
                  className={`cursor-pointer transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "hover:text-red-400"}`} 
                  onClick={() => toggleFavorite(product.id)}
                />
                <ShoppingCart 
                  strokeWidth={1} 
                  size={32} 
                  className="cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => {
                    addToCart(product);
                  }}
                />
              </div>
              <div className="p-2">
                <p className="text-xl text-gray-800">{product.name}</p>
                <p className="text-2xl text-gray-800">{product.price}.00 AUD</p>
              </div>
            </div>
          );
        })}
      </div>

      <ProductDetailDrawer 
        product={activeProduct} 
        isOpen={!!activeProduct} 
        onClose={() => setActiveProduct(null)} 
      />
    </>
  )
}

const products = [
  {
    id: "1",
    name: "Boyd T-shirt – Waffle Texture T-Shirt with Button Placket",
    price: 100,
    image: "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048"
  },
  {
    id: "2",
    name: "Gucci logo-print Cotton T-shirt | White | FARFETCH",
    price: 200,
    image: "https://cdn-images.farfetch-contents.com/24/09/63/05/24096305_54170622_600.jpg"
  },
  {
    id: "3",
    name: "Gucci Logo Heavy Cotton T-Shirt - Black | Editorialist",
    price: 200,
    image: "https://editorialist.com/thumbnails/600/2024/11/032/965/456/32965456~black_2.webp"
  },
  {
    id: "4",
    name: "Gucci // Jacquard GG Crinkle Shirt – VSP Consignment",
    price: 200,
    image: "https://vspconsignment.com/cdn/shop/files/Gucci-back-monogram-embrd-top4_2400x.jpg?v=1759273918"
  }
];