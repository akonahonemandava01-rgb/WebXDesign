import React from "react";
import "../styles/Dashboard.css";

const SearchBar = ({ placeholder, onSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button className="btn-primary">Search</button>
    </div>
  );
};

export default SearchBar;
