import HeroSection from "../components/HeroSection";
import Product from "../components/ui/Product";
import CategoryCards from "../components/ui/CategoryCards";
import PlatformProcess from "../components/ui/PlatformProcess";

export default function Page() {
  return (
    <div className=" bg-white flex flex-col">
      <HeroSection />
      <PlatformProcess />
      <CategoryCards />
      <Product />
    </div>
  )
}
