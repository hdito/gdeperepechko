import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { UserProvider } from "./UserProvider";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";

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

const AppContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContainer>
        <AuthProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </AuthProvider>
      </AppContainer>
    </BrowserRouter>
  </React.StrictMode>
);
