import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./Routes/AuthProvider";
import ScrollToTop from "./Components/AppScrollToTop";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../firebase-messaging-sw.js")
      .then(function (registration) {
        // Successful registration
        console.log(
          "Hooray. Registration successful, scope is:",
          registration.scope
        );
      })
      .catch(function (error) {
        // Failed registration, service worker won’t be installed
        console.log(
          "Whoops. Service worker registration failed, error:",
          error
        );
      });
  });
}

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
    100: "#ffd600",
  },
};

const theme = extendTheme({ colors });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <ScrollToTop>
            <App />
          </ScrollToTop>
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
