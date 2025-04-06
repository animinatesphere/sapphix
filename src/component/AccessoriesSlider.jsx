import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase";
import "../componentcss/AccessoriesSlider.css";

// Setup your Supabase client

const AccessoriesSlider = () => {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("Admin-product").select("*");
      if (!error) setProducts(data);
    };
    fetchProducts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="accessories-container">
      <h2 className="accessories-title">Accessorise with us</h2>
      <div className="accessories-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>
          &#8249;
        </button>
        <div className="accessories-scroll" ref={scrollRef}>
          {products.map((item) => (
            <div key={item.id} className="accessory-card">
              <img
                src={item.image}
                alt={item.name}
                className="accessory-image"
              />
              <div className="accessory-details">
                <h3>{item.name}</h3>
                <p className="price">₦{item.price}</p>
                <p className="old-price">₦{(item.price * 1.1).toFixed(0)}</p>
                <p className="discount">10% off</p>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll("right")}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default AccessoriesSlider;
