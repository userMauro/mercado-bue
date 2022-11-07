import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

// utils
const up = require('../../assets/m-up.png')
const down = require('../../assets/m-down.png')
const perfil = require('../../assets/perfil.png')

export default function Profile () {
    const user = useSelector(state => state.userReducer)

    const [menuOne, setMenuOne] = useState(false)
    const [menuTwo, setMenuTwo] = useState(false)


    return (
        <div class="flex flex-col items-center pt-6 gap-6 h-max bg-gray-100">
            <div class="flex flex-row w-1/2 text-left shadow-md rounded-md p-5 bg-white">
                <img class="w-16 h-16 mr-3" src={perfil} alt="perfil" />
                <div class="flex flex-col">
                    <h1 class="text-4xl">{user.username}</h1>
                    <h2 class="text-gray-400">Balvanera, Capital Federal (Buenos Aires)</h2>
                </div>
                
            </div>

            <div class="flex flex-col w-1/2 p-6 text-left shadow-md rounded-md mb-10 bg-white">
                <h1 class="flex flex-row justify-between pt-4 pb-4 pr-3 pl-3 cursor-pointer border-b text-lg items-center hover:bg-gray-100" 
                    onClick={() => setMenuOne(!menuOne)}>Mis datos {
                        menuOne 
                            ? <img class="w-3 h-3 mt-2" src={up} alt="icon" /> 
                            : <img class="w-3 h-3 mt-2" src={down} alt="icon" />}
                </h1>

                { menuOne && (
                    <ul class="flex flex-col text-gray-400">
                        <div class="flex flex-row">
                            <li class="w-full p-3">Usuario</li>
                            <li class="flex flex-row w-full items-center gap-2">{user.username}</li>
                        </div>
                        <div class="flex flex-row">
                            <li class="w-full border-t p-3">Email</li>
                            <li class="flex flex-row w-full gap-2 items-center border-t">{user.email}</li>
                        </div>
                        <div class="flex flex-row">
                            <li class="w-full border-t p-3">Nombre</li>
                            <li class="flex flex-row w-full gap-2 items-center border-t">{user.name ? user.name : ' - '}</li>
                        </div>
                        <div class="flex flex-row">
                            <li class="w-full border-t p-3">Celular</li>
                            <li class="flex flex-row w-full gap-2 items-center border-t">{user.cel ? user.cel : ' - '}</li>
                        </div>
                        <div class="flex flex-row">
                            <li class="w-full border-t p-3">Provincia</li>
                            <li class="flex flex-row w-full gap-2 items-center border-t">{user.province ? user.province : ' - '}</li>
                        </div>
                        <div class="flex flex-row">
                            <li class="w-full border-t p-3">Localidad o barrio</li>
                            <li class="flex flex-row w-full gap-2 items-center border-t">{user.location ? user.location : ' - '}</li>
                        </div>
                    </ul>
                )}
                

                <h1 class="flex flex-row justify-between pt-4 pb-4 pr-3 pl-3 cursor-pointer border-b text-lg items-center hover:bg-gray-100" 
                    onClick={() => setMenuTwo(!menuTwo)}>Seguridad {
                        menuTwo
                        ? <img class="w-3 h-3 mt-2" src={up} alt="icon" /> 
                        : <img class="w-3 h-3 mt-2" src={down} alt="icon" />}
                </h1>

                { menuTwo && (
                    <ul class="flex flex-col text-gray-400">
                            <li class="w-full p-3">Cambiar contraseña</li>
                            <li class="w-full border-t p-3">Cambiar email</li>
                            <li class="w-full border-t p-3 text-red-500">Eliminar cuenta</li>
                    </ul>
                )}
            </div>
        </div>
    )
}