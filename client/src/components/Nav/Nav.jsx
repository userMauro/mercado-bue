import React from 'react'
import { Link } from 'react-router-dom'

// utils
import imgSettings from "../../assets/config.png"

export default function Nav () {
    return (
        <div class="flex flex-row w-full pb-2 pt-2 bg-yellow-400">
            <ul class="flex flex-row list-none justify-center items-center p-0 w-full m-0 gap-10">
                <input 
                    class="outline-none rounded-sm w-2/6 pr-3 pl-3 pt-2 pb-2 shadow-md text-gray-400"
                    type="text" 
                    placeholder='Buscar productos, marcas y más...' 
                />
                <Link class=" text-gray-700 hover:text-gray-900" to="/"><li>Comprar</li></Link>
                <Link class=" text-gray-700 hover:text-gray-900" to="/sell"><li>Vender</li></Link>
                <Link class=" text-gray-700 hover:text-gray-900" to="/favorites"><li>Favoritos</li></Link>
                <Link to="/settings"><li><img class="w-8 h-8 hover:scale-125" src={imgSettings} alt ="settings" /></li></Link>
            </ul>
        </div>
    )
}