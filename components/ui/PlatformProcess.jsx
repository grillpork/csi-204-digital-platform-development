import { CircleDollarSign, Users, Truck, CreditCard, ShieldCheck, Smartphone } from "lucide-react";

export default function PlatformProcess() {
  const processes = [
    {
      icon: CircleDollarSign,
      title: "Value-for-money",
      desc: "We offer competitive prices on millions of items"
    },
    {
      icon: Users,
      title: "Shoppers worldwide",
      desc: "More than 300 million shoppers from 200+ countries & regions"
    },
    {
      icon: Truck,
      title: "Fast delivery",
      desc: "Faster delivery on selected items thanks to our improved logistics"
    },
    {
      icon: CreditCard,
      title: "Safe payments",
      desc: "Safe payment methods preferred by international shoppers"
    },
    {
      icon: ShieldCheck,
      title: "Buyer protection",
      desc: "Get a refund if items arrive late or not as described"
    },
    {
      icon: Smartphone,
      title: "Download the app",
      desc: "Shop anywhere & anytime"
    }
  ];

  return (
    <div className="w-full bg-white py-12 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row items-center xl:items-start gap-12 xl:gap-8">
        {/* Left side: Title */}
        <div className="flex-shrink-0 text-center xl:text-left xl:w-[280px]">
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">
            Better choices,<br />better prices
          </h2>
        </div>

        {/* Right side: Process list */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8 xl:gap-4">
          {processes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="mb-4 text-slate-800 transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon size={40} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-2">{item.title}</h3>
                <p className="text-xs leading-snug text-slate-500 max-w-[180px]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
