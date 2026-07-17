import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import App from "./app";
import "./index.css";

function SimpleErrorRender({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" style={{ padding: 20 }}>
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary} style={{ marginTop: 10, padding: 10 }}>Try again</button>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.CLIENT_BASE_PATH || "/"}>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <SimpleErrorRender error={error} resetErrorBoundary={resetErrorBoundary} />
        )}
      >
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
