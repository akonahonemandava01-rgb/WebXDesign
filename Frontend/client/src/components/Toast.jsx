import React, { useEffect } from "react";
import "../styles/AdminDashboardStyles/AdminDashboard.css";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // auto close after 2s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-top">
      {message}
    </div>
  );
};

export default Toast;
