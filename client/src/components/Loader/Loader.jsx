import React from "react";

const gif = require('../../assets/gif-loading.gif')

export default function Loader() {
    return (
        <div class="flex w-screen h-screen justify-center items-center bg-yellow-400">
            <img class="mt-5" src={gif} alt="gif-loading" />
        </div>
    )  
}