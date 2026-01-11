import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import AuthForm from "./AuthForm.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App/>
  </StrictMode>
);

