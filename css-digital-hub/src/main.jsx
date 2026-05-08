import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

const rootElement = document.getElementById("root");

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error("CSS Digital Hub bootstrap error:", error);
  rootElement.innerHTML = `
    <div style="min-height:100vh;background:#fff;padding:48px 24px;font-family:Arial,sans-serif;color:#111827;">
      <div style="max-width:960px;margin:0 auto;border:1px solid #fecaca;background:#fef2f2;border-radius:24px;padding:32px;">
        <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#dc2626;">Startup error</p>
        <h1 style="margin:0 0 16px;font-size:32px;line-height:1.2;">The website hit an error while loading.</h1>
        <pre style="white-space:pre-wrap;overflow:auto;background:#fff;padding:16px;border-radius:16px;">${String(
          error?.message || error
        )}</pre>
      </div>
    </div>
  `;
}
