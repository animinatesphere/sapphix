import React from "react";
import { motion } from "framer-motion";
import "../women/ProductListingLoading.css";

const ProductListingLoading = () => {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="dancing-woman"
        animate={{ x: [0, 10, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        💃
      </motion.div>
      <motion.h2
        className="loading-text"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Finding the best styles for you...
      </motion.h2>
    </motion.div>
  );
};

export default ProductListingLoading;
