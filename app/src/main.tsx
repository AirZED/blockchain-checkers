import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Wallet } from "./utils/wallet.tsx";
import { SocketProvider } from "./context/socketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Wallet>
          <App />
        </Wallet>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
);
