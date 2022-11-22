import React from "react"
import { Route, Routes } from "react-router-dom"

// routes
import AuthRoute from "./components/AppRoute/AuthRoute"
import NotLogRoute from "./components/AppRoute/NotLogRoute"
import NotFound from "./components/NotFound/NotFound"

import Authenticate from "./components/Auth/Authenticate"
import ConfirmEmail from "./components/Auth/ConfirmEmail"

import Buy from "./components/Buy/Buy"
import Sell from "./components/Sell/Sell"
import Profile from "./components/Settings/Profile" 

export default function App() {

  return (
    <div class="text-center">
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Buy />}  />
          <Route path="/sell" element={<Sell />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/auth" element={<NotLogRoute />}>
          <Route path="login" element={<Authenticate />} />
          <Route path="confirm/email/:action" element={<ConfirmEmail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}