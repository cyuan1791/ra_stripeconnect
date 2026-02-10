import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

declare global {
  interface Window {
    asoneId: string;
  }
}


const root = ReactDOM.createRoot(document.getElementById(window.asoneId));

root.render(<App />);
