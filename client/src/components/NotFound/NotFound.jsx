import React from 'react';

// utils
const notFound = require('../../assets/error-404.jpg')

export default function NotFound () {
    return (
        <div class="w-screen h-screen">
            <img class="w-screen h-screen" src={notFound} alt="notFound" />
        </div>
    )
}