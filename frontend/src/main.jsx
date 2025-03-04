import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { SearchProvider } from "./context/search.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/cart.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <StrictMode>
            <App />
          </StrictMode>
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>
);
