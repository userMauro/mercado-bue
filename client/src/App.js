import React from "react";
import { Route, Routes } from "react-router-dom";

import './App.css';
import AuthRoute from "./components/AppRoute/AuthRoute";
import NotLogRoute from "./components/AppRoute/NotLogRoute";
import Authenticate from "./components/Auth/Authenticate"
import ConfirmEmail from "./components/Auth/ConfirmEmail";
import Home from "./components/Home"
import NotFound from "./components/NotFound"

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Home />}  />
        </Route>

        <Route path="/auth" element={<NotLogRoute />}>
          <Route path="login" element={<Authenticate />} />
          <Route path="confirm/email/:action" element={<ConfirmEmail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

{/* <Route path="/" element={<Home />}  />
<Route path="/login" element={<Authenticate />} />
<Route path="/confirm/email/:action" element={<ConfirmEmail />} />
<Route path="*" element={<NotFound />} /> */}

export default App;