import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
// import axios from "axios"

import './App.css';
import Authenticate from "./components/Auth/Authenticate"
import ConfirmEmail from "./components/Auth/ConfirmEmail";
import Home from "./components/Home"
import NotFound from "./components/NotFound"

function App() {

  useEffect(() => {

  }, [])

  // const checkSession = async() => {
  //   const { data } = await axios.get('http://localhost:3001/auth/authorize')

  //   console.log(data)
  // }
  

    // agarrar credenciales del localstorage
    // enviarlas al back y comprar el token

    // seteo credenciales en el local storage
    // window.localStorage.setItem({
    //   "BueCredentials", JSON.stringify({email, username, token, role})
    // })

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}  />
        <Route path="/login" element={<Authenticate />} />
        <Route path="/confirm/email/:token" element={<ConfirmEmail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;