import React, { useState, useEffect } from "react";
import "../componentcss/herosection.css";
import first from "../assets/Frame 312.png";
import cal from "../assets/suhyeon-choi-G9XMLUAjETM-unsplash.jpg";
import Button from "./Button";
import fash1 from "../assets/fashion/amanda-vick-zw_oaDbfzyE-unsplash.jpg";
import fash2 from "../assets/fashion/filip-rankovic-grobgaard-buoBjo-MkJY-unsplash.jpg";
import fash3 from "../assets/fashion/kahara-5NiZHIvIP4M-unsplash.jpg";
import fash4 from "../assets/fashion/katsiaryna-endruszkiewicz-BteCp6aq4GI-unsplash.jpg";
import fash5 from "../assets/fashion/nicolas-ladino-silva-e0V16a5jz-s-unsplash.jpg";
import fash6 from "../assets/fashion/pesce-huang-I7sZUNgc0lE-unsplash.jpg";
import slide1 from "../sliderpicture/slide1.jpg";
import slide2 from "../sliderpicture/slide2.jpg";
import slide3 from "../sliderpicture/slide3.jpg";
import slide4 from "../sliderpicture/slide4.jpg";
import slide5 from "../sliderpicture/slide5.jpg";
import slide6 from "../sliderpicture/slide6.jpg";
import slide7 from "../sliderpicture/slide7.jpg";
import slide8 from "../sliderpicture/slide8.jpg";
import slide9 from "../sliderpicture/slide9.jpg";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: first,
      text: "It’s the season of love <br/> 20% off all Kimono pieces <br/> from now till Feb 15",
      butt: "Shop Now",
      hasGradient: false,
    },
    {
      image: cal,
      text: "Our imagery blends the vibrant tapestry of African<br/>traditions with the sleek lines of contemporary<br/>fashion, creating a visual narrative that is both bold<br/>and timeless",
      butt: "Shop Now",
    },
    {
      image: fash1,
      text: "Our creations fuse the timeless artistry <br/> of heritage textiles with the daring innovation of contemporary design,<br/>crafting a style that is both evocative and modern.",
      butt: "Shop Now",
    },
    {
      image: fash2,
      text: "Blending cultural legacy with avant-garde<br/> aesthetics, our fashion tells a story of tradition reimagined for the bold<br/>, modern soul.",
      butt: "Shop Now",
    },
    {
      image: fash3,
      text: "We intertwine the delicate intricacies of<br/> the past with the fearless spirit of the present,<br/> curating a wardrobe that is as refined as it is revolutionary",
      butt: "Shop Now",
    },
    {
      image: fash4,
      text: "Where vintage craftsmanship meets<br/> cutting-edge silhouettes, our fashion is a <br/>testament to the harmony of history and modernity.",
      butt: "Shop Now",
    },
    {
      image: fash5,
      text: "Our designs celebrate the echoes of <br/>ancient artistry, redefined through a lens of<br/> contemporary sophistication and effortless style.",
      butt: "Shop Now",
    },
    {
      image: fash6,
      text: "Inspired by heritage, shaped by<br/> innovation—our fashion is a seamless dance <br/>between the elegance of tradition and the pulse of the future.",
      butt: "Shop Now",
    },
    {
      image: slide1,
      text: "Our fashion bridges the past and the <br/> present, celebrating the beauty of age-old <br/>techniques while embracing the innovation of tomorrow",
    },
    {
      image: slide2,
      text: "We merge the rich textures of history <br/> with the sleek, fluid forms of contemporary<br/> fashion, crafting a narrative that is both<br/> powerful and poetic",
      butt: "Shop Now",
    },
    {
      image: slide3,
      text: "We merge the rich textures of history <br/> with the sleek, fluid forms of contemporary<br/> fashion, crafting a narrative that is both<br/> powerful and poetic",
      butt: "Shop Now",
    },
    {
      image: slide4,
      text: "Rooted in tradition, elevated by modern <br/> craftsmanship—our pieces embody a style <br/> that transcends time, <br/>exuding confidence and cultural depth.",
      butt: "Shop Now",
    },
    {
      image: slide5,
      text: "Rooted in tradition, elevated by modern <br/> craftsmanship—our pieces embody a style <br/> that transcends time, <br/>exuding confidence and cultural depth.",
      butt: "Shop Now",
    },
    {
      image: slide6,
      text: "Every stitch carries the whispers of <br/> ancestral artistry, <br/> woven into the bold statements of today’s ever-evolving fashion <br/> landscape.",

      butt: "Shop Now",
    },
    {
      image: slide7,
      text: "Our designs celebrate the echoes of <br/> ancient artistry, redefined through a lens of <br/>contemporary sophistication and effortless style.",
      butt: "Shop Now",
    },
    {
      image: slide8,
      text: "Inspired by heritage, shaped by <br/> innovation—our fashion is a seamless dance <br/>between the elegance of tradition and the pulse of the future.",

      butt: "Shop Now",
    },
    {
      image: slide9,
      text: "Blending cultural legacy with avant-garde <br/> aesthetics, our fashion tells a story of tradition <br/> reimagined for the bold, <br/>modern soul.",
      butt: "Shop Now",
    },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 5) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <h2
              className="slide-text"
              style={{ width: slide.textWidth }}
              dangerouslySetInnerHTML={{
                __html: slide.text.replace(/\n/g, "<br />"),
              }} // Converts `\n` to `<br />`
            />
            <Button>{slide.butt}</Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default HeroSection;
