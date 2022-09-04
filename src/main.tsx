import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { UserProvider } from "./UserProvider";
import { css } from "@linaria/core";

const globals = css`
  :global() {
    :root {
      font-family: Helvetica, sans-serif;
    }

    h1,
    h2,
    h3,
    p,
    body {
      margin: 0;
    }
    h1,
    h2,
    h3 {
      cursor: default;
    }
    table,
    tr,
    td,
    th,
    thead,
    tbody {
      border: none;
      border-collapse: collapse;
    }
  }
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
