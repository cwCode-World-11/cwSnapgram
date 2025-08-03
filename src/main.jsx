import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./context/AuthContext.jsx";
import TanstackProvider from "./lib/tanstackQuery/TanstackProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <TanstackProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TanstackProvider>
    </BrowserRouter>
  </StrictMode>
);
