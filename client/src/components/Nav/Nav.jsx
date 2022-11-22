import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

// utils
const favorites = require('../../assets/favorites.png')
const chat = require('../../assets/chat.png')
const up = require('../../assets/m-up.png')
const down = require('../../assets/m-down.png')

const { signOut } = require("../../redux/user.slice")

export default function Nav () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const username = useSelector(state => state.userReducer.username)
    const email = useSelector(state => state.userReducer.email)

    let icon
    const [isActive, setIsActive] = useState(false)
    isActive ? icon = <img class="w-3 h-3 mt-2" src={up} alt="icon" /> : icon = <img class="w-3 h-3 mt-2" src={down} alt="icon" />

    // si clickeo fuera de las 'settings', se retrae la barra
    document.addEventListener('click', function(event) {
        if(event.target.id !== 'settings' && event.target.id !== 'btn-settings'){
            setIsActive(false)
        }
    })

    const logOut = () => {
        if (window.confirm('Confirma para desloguear')) {
            try {
                localStorage.removeItem('logCredentials')
                setIsActive(false)
                dispatch(signOut())
                navigate('/auth/login')
            } catch (error) {
                console.log(error)
                setIsActive(false)
            }
        } else {
            setIsActive(false)
        }
    }

    return (
        <div class="flex flex-row w-full pb-3 pt-3 bg-yellow-400">
            <ul class="flex flex-row list-none justify-center items-center p-0 w-full m-0 mr-10">
                <div class="flex flex-row w-9/12 justify-center items-center gap-10">
                    <input 
                        class="outline-none rounded-sm w-2/4 pr-3 pl-3 pt-2 pb-2 shadow-md text-gray-400"
                        type="text" 
                        placeholder='Buscar productos, marcas y más...' 
                    />
                    <Link class="text-gray-700 hover:text-gray-800 active:text-gray-900 active:scale-95" to="/"><li>Comprar</li></Link>
                    <Link class="text-gray-700 hover:text-gray-800 active:text-gray-900 active:scale-95" to="/sell"><li>Vender</li></Link>
                </div>

                <div class="flex flex-row w-1/4 justify-end items-center gap-2 mr-2">
                    <Link id="btn-settings" class="flex justify-center items-center text-gray-400 pl-5 pr-5 p-1 shadow-md rounded-lg bg-yellow-300 active:scale-95" onClick={() => (setIsActive(!isActive))}>
                        <li id="settings" class="flex flex-row text-gray-700">{username}{icon}</li>
                    </Link>

                    {isActive &&  (
                        <div id="settings" class="absolute right-12 top-14 shadow-md pl-4 pr-4 bg-white">
                            <ul id="settings" class="flex flex-col text-start p-3 gap-2 text-gray-400">
                                <li id="settings" class="mb-2">¡Hola {email}!</li>
                                <Link id="settings" to="/profile" onClick={() => setIsActive(false)}><li class="cursor-pointer text-gray-500">Perfil</li></Link>
                                <li id="settings" class="flex border-t pt-3 cursor-pointer text-red-400" onClick={logOut}>Salir</li>
                            </ul>
                        </div>
                    )}

                    <Link to="/favorites">
                        <li><img class="w-6 h-6 hover:scale-110" src={favorites} alt="favorites"/></li>
                    </Link>
                    <Link to="/chat">
                        <li><img class="w-6 h-6 hover:scale-110" src={chat} alt="chat"/></li>
                    </Link>
                </div>
            </ul>
        </div>
    )
}