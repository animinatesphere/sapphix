import React from "react";
import "../componentcss/searchbar.css";

export default function SearchBar() {
  return (
    <div className="search-container">
      <svg
        className="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m1.15-4.15a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search here..."
        className="search-input"
      />
    </div>
  );
}
