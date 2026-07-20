import React from "react";

const Button = ({ label, type = "primary", onClick, className = "" }) => {
  const buttonClasses = ["btn", `btn-${type}`, className].filter(Boolean).join(" ");

  return (
    <button className={buttonClasses} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
