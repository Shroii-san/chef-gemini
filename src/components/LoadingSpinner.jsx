import React from "react";
import "../index.css";

export default function LoadingSpinner({ message = "Memuat data..." }) {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <span className="loading-text">{message}</span>
    </div>
  );
}
