import React from "react";

const gif = require('../../assets/gif-loading.gif')

export default function Loader() {

    return (
        <div className="Authenticate">
            {/* <h1 id="loading">Cargando...</h1> */}
            <img id="gif-loading" src={gif} alt="gif-loading" />
        </div>
    )  
}