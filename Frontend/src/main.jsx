import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";  // <-- تغيير من BrowserRouter إلى HashRouter
import { Provider } from "react-redux";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import { store } from "./app/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);