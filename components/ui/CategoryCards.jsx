export default function CategoryCards() {
  const categories = [
    {
      title: "WOMENSWEAR",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", // placeholder
    },
    {
      title: "MENSWEAR",
      image: "https://d29c1z66frfv6c.cloudfront.net/pub/media/catalog/product/large/19b8737d559af263c5973d63d3bb77dbb91edb7b_xxl-1.jpg", // placeholder
    },
    {
      title: "KIDSWEAR",
      image: "https://contents.mediadecathlon.com/p2722640/k$418611ca4411a4f2dbb7e9b3e33b2cf8/kids-unisex-multisports-cotton-t-shirt-red-domyos-8772496.jpg?f=1920x0&format=auto", // placeholder
    }
  ];

  return (
    <div className="w-full px-0 py-2 mt-0">
      <div className="flex flex-col md:flex-row gap-0">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="relative flex-1 aspect-[4/3] md:aspect-[5/4] lg:aspect-[4/3] overflow-hidden group cursor-pointer bg-slate-100"
          >
            <img 
              src={category.image} 
              alt={category.title} 
              className="w-full h-full object-cover object-top"
            />
            {/* Subtle gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/10 transition-colors duration-300" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-2xl lg:text-3xl font-bold tracking-widest uppercase drop-shadow-lg">
                {category.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
