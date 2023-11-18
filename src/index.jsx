import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import register from "./registerServiceWorker";
import { Provider as ReduxProvider } from "react-redux";
import store, { persistedStore } from "./store";
import "bootstrap/dist/css/bootstrap.css";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// optional configuration
const defaultOptions = {
  position: "bottom center",
  timeout: 5000,
  offset: "5px",
  transition: "fade", //scale
};

ReactDOM.render(
  <BrowserRouter>
    <ReduxProvider store={store}>
      <PersistGate
        persistor={persistedStore}
        loading={
          <div className="container mt-5">
            <h1>Iniciandp App...</h1>
          </div>
        }>
        <AlertProvider template={AlertTemplate} {...defaultOptions}>
          <App />
        </AlertProvider>
      </PersistGate>
    </ReduxProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

register();
