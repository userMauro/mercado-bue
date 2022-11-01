import React from "react"
import { Route, Routes } from "react-router-dom"

import './App.css'
import AuthRoute from "./components/AppRoute/AuthRoute"
import NotLogRoute from "./components/AppRoute/NotLogRoute"
import Authenticate from "./components/Auth/Authenticate"
import ConfirmEmail from "./components/Auth/ConfirmEmail"
import Buy from "./components/Buy/Buy"
import NotFound from "./components/NotFound/NotFound"
import Sell from "./components/Sell/Sell"
import Config from "./components/Config/Config.jsx"
import Profile from "./components/Config/Profile"

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Buy />}  />
          <Route path="/sell" element={<Sell />} />
          <Route path="/config" element={<Config />} />
          <Route path="/profile" element={<Profile />} />
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

export default App;