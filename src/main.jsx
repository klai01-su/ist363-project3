import React from "react";
import ReactDOM from "react-dom/client"; // or from 'react-dom' in older versions
import App from "./App"; // import the App component
import "./index.css"; // global styles if any

// React 18 approach to rendering the root component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
