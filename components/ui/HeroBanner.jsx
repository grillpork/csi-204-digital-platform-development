import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[550px] overflow-clip">
      <Splide
        options={{
          type: 'loop',
          autoplay: true,
          interval: 4000,
          arrows: false,
          pagination: true,
          pauseOnHover: false,
        }}
        aria-label="Hero Banner"
      >
        <SplideSlide>
          <img
            className="w-full h-[550px] object-cover object-[center_30%]"
            src="/images/slider_image_1_1782088593433.png"
            alt="Hero 1"
          />
        </SplideSlide>
        <SplideSlide>
          <img
            className="w-full h-[550px] object-cover object-[center_30%]"
            src="/images/slider_image_2_1782088603151.png"
            alt="Hero 2"
          />
        </SplideSlide>
        <SplideSlide>
          <img
            className="w-full h-[550px] object-cover object-[center_30%]"
            src="/images/slider_image_3_1782088613740.png"
            alt="Hero 3"
          />
        </SplideSlide>
      </Splide>
    </div>
  );
}
