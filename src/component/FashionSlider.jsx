import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import "../componentcss/swiperb.css";

// Import your images
import slide1 from "../sliderpicture/slide1.jpg";
import slide2 from "../sliderpicture/slide2.jpg";
import slide3 from "../sliderpicture/slide3.jpg";
import slide4 from "../sliderpicture/slide4.jpg";
import slide5 from "../sliderpicture/slide5.jpg";
import slide6 from "../sliderpicture/slide6.jpg";
import slide7 from "../sliderpicture/slide7.jpg";
import slide8 from "../sliderpicture/slide8.jpg";
import slide9 from "../sliderpicture/slide9.jpg";
import slide10 from "../sliderpicture/slide10.jpg";
import slide11 from "../sliderpicture/slide11.jpg";
import slide12 from "../sliderpicture/slide12.jpg";
import slide13 from "../sliderpicture/slide13.jpg";
import slide14 from "../sliderpicture/slide14.jpg";

// Image Array
const fashionImages = [
  { src: slide1, alt: "Fashion 1" },
  { src: slide2, alt: "Fashion 2" },
  { src: slide3, alt: "Fashion 3" },
  { src: slide4, alt: "Fashion 4" },
  { src: slide5, alt: "Fashion 5" },
  { src: slide6, alt: "Fashion 6" },
  { src: slide7, alt: "Fashion 7" },
  { src: slide8, alt: "Fashion 8" },
  { src: slide9, alt: "Fashion 9" },
  { src: slide10, alt: "Fashion 10" },
  { src: slide11, alt: "Fashion 11" },
  { src: slide12, alt: "Fashion 12" },
  { src: slide13, alt: "Fashion 13" },
  { src: slide14, alt: "Fashion 14" },
];

const FashionSlider = () => {
  return (
    <motion.div
      className="fashion-slider-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="fashion-heading">Tag @Sapphix to share your style</h2>

      <div className="slider-wrapper">
        {/* Left Arrow */}
        <button className="swiper-button-prev">
          <FaChevronLeft />
        </button>

        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={10}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            790: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="fashion-slider"
        >
          {fashionImages.map((item, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="fashion-slide"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img src={item.src} alt={item.alt} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Right Arrow */}
        <button className="swiper-button-next">
          <FaChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

export default FashionSlider;
