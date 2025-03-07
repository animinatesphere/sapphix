// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import { AuthProvider } from "./Auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// import { AuthProvider } from "./context/AuthContext";

// ReactDOM.render(
//   <AuthProvider>
//     <App />
//   </AuthProvider>,
//   document.getElementById("root")
// );
