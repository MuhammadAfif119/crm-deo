import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./Routes/AuthProvider";
import ScrollToTop from "./Components/AppScrollToTop";

import * as Sentry from "@sentry/react";
// import WebConfigProvider from './Hooks/Contexts/WebConfig/WebConfigProvider';
// import WebConfig from './Hooks/Contexts/WebConfig/WebConfigProvider';

// const isLocalhost = () => {
// 	return (
// 		window.location.hostname === "localhost" ||
// 		window.location.hostname === "127.0.0.1"
// 	);
// };

// if (!isLocalhost()) {
	Sentry.init({
		dsn: "https://649bf87c1b5b49828274a19362ce3f73@o1121849.ingest.sentry.io/4505526450782208",
		integrations: [
			new Sentry.BrowserTracing(),
			new Sentry.Replay(),
		],
		// Performance Monitoring
		tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
		// Session Replay
		replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
		replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/]
	});
// }


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
