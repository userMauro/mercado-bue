import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { setUserData } from '../../redux/user.slice'
import endpointURL from '../../utils/endpointURL'
import Loader from '../Loader/Loader'

// utils
const up = require('../../assets/m-up.png')
const down = require('../../assets/m-down.png')
const confirm = require('../../assets/confirm.png')
const deny = require('../../assets/deny.png')
const perfil = require('../../assets/perfil.png')

export default function Profile () {
    const dispatch = useDispatch()

    const user = useSelector(state => state.userReducer)

    const [menuOne, setMenuOne] = useState(false)
    const [menuTwo, setMenuTwo] = useState(false)
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [state, setState] = useState({
        username: '',
        name: '',
        dni: '',
        cel: '',
        location: '',
        province: '',
    })

    if (error !== '') {
        setTimeout(() => {
            setError('')
        }, 5000)
    }

    if (isLoading === true) {
        <Loader />
    }

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        })
    }

    const editState = (e) => {
        setEdit(true)

        let element = document.getElementById(e)
        element.disabled = false
        element.focus()
    }

    const confirmEdit = async(e) => {  
        try {
            setIsLoading(true)

            const { data: res } = await axios.put(`${endpointURL}/profile/edit/${e}`, { email: user.email, value: state[e] })

            // actualizo el input
            setState({ ...state, [e]: '' })

            // actualizo las credenciales en el reducer
            dispatch(setUserData( { [e]: res.msg }))

            // actualizo las credenciales en el localStorage
            const creds = JSON.parse(localStorage.getItem("logCredentials"))
            creds[e] = res.msg
            localStorage.setItem("logCredentials", JSON.stringify(creds))

            // desactivo el input
            document.getElementById(e).disabled = true
            return setEdit(false)
        } catch (error) {
            console.log(error.response?.data.msg)
        }
        
        setEdit(false)
        setError(`${e} inválido`)
        setState({ ...state, [e]: '' })
        document.getElementById(e).disabled = true
    }

    const cancelEdit = (e) => {
        setEdit(false)
        setState({ ...state, [e]: '' })
        document.getElementById(e).disabled = true
    }


    return (
        <div id="perfilModal" class="flex flex-col items-center pt-6 gap-6 h-max bg-gray-100">
            <div class="flex flex-row w-1/2 text-left shadow-md rounded-md p-5 bg-white">
                <img class="w-16 h-16 mr-3" src={perfil} alt="perfil" />
                <div class="flex flex-col">
                    <h1 class="text-4xl">{user.username}</h1>
                    <h2 class="text-gray-400">{user.location 
                        ? user.location 
                        : 'Localidad/Barrio sin ingresar'}, {user.province 
                            ? user.province 
                            : 'provincia sin ingresar'}
                    </h2>
                </div>
                
            </div>

            <div class="flex flex-col w-1/2 p-6 text-left shadow-md rounded-md mb-10 bg-white">
                {/* MY DATA */}
                <h1 class="flex flex-row justify-between pt-4 pb-4 pr-3 pl-3 cursor-pointer border-b text-lg items-center hover:bg-gray-100" 
                    onClick={() => setMenuOne(!menuOne)}>Mis datos {
                        menuOne 
                            ? <img class="w-3 h-3 mt-2" src={up} alt="icon" /> 
                            : <img class="w-3 h-3 mt-2" src={down} alt="icon" />}
                </h1>

                { menuOne && (
                    <ul class="flex flex-col text-gray-400">
                        {/* USERNAME */}
                        <div class="flex flex-row hover:bg-gray-50">
                            <li class="w-1/2 p-3">Usuario</li>
                            <li class="flex flex-row w-1/4 items-center gap-2">
                                <input disabled 
                                    id='username' 
                                    value={state.username} 
                                    class="bg-transparent outline-none" 
                                    onChange={(e) => handleChange(e)} 
                                    placeholder={user.username} 
                                />
                            </li>
                            <div id="error" class="flex w-1/4 justify-center items-center text-xs text-red-500">{error}</div>

                            <li class="flex flex-row items-center text-sm text-blue-500 cursor-pointer pr-2 hover:text-blue-600 active:text-blue-400">
                                { !edit && <button onClick={() => editState('username')}>editar</button> }
                                { edit && (
                                    <div class="flex flex-row mr-1 gap-1">
                                        <img class="w-4 h-4 hover:scale-95" src={confirm} alt="confirm" onClick={() => confirmEdit('username')} />
                                        <img class="w-4 h-4 hover:scale-95"  src={deny} alt="deny" onClick={() => cancelEdit('username')} />
                                    </div>
                                )}
                            </li>
                        </div>

                        {/* NAME */}
                        <div class="flex flex-row border-t hover:bg-gray-50">
                            <li class="w-1/2 p-3">Nombre</li>
                            <li class="flex flex-row w-1/4 items-center gap-2">
                                <input disabled 
                                    id='name' 
                                    value={state.name} 
                                    class="bg-transparent outline-none" 
                                    onChange={(e) => handleChange(e)} 
                                    placeholder={user.name ? user.name : ''} 
                                />
                            </li>
                            <div id="error" class="flex w-1/4 justify-center items-center text-xs text-red-500">{error}</div>

                            <li class="flex flex-row items-center text-sm text-blue-500 cursor-pointer pr-2 hover:text-blue-600 active:text-blue-400">
                                { !edit && <button onClick={() => editState('name')}>editar</button> }
                                { edit && (
                                    <div class="flex flex-row mr-1 gap-1">
                                        <img class="w-4 h-4 hover:scale-95" src={confirm} alt="confirm" onClick={() => confirmEdit('name')} />
                                        <img class="w-4 h-4 hover:scale-95"  src={deny} alt="deny" onClick={() => cancelEdit('name')} />
                                    </div>
                                )}
                            </li>
                        </div>

                        {/* CEL */}
                        <div class="flex flex-row border-t hover:bg-gray-50">
                            <li class="w-1/2 p-3">Celular</li>
                            <li class="flex flex-row w-1/4 items-center gap-2">
                                <input disabled 
                                    id='cel' 
                                    value={state.cel} 
                                    class="bg-transparent outline-none" 
                                    onChange={(e) => handleChange(e)} 
                                    placeholder={user.cel ? user.cel : ''} 
                                />
                            </li>
                            <div id="error" class="flex w-1/4 justify-center items-center text-xs text-red-500">{error}</div>

                            <li class="flex flex-row items-center text-sm text-blue-500 cursor-pointer pr-2 hover:text-blue-600 active:text-blue-400">
                                { !edit && <button onClick={() => editState('cel')}>editar</button> }
                                { edit && (
                                    <div class="flex flex-row mr-1 gap-1">
                                        <img class="w-4 h-4 hover:scale-95" src={confirm} alt="confirm" onClick={() => confirmEdit('cel')} />
                                        <img class="w-4 h-4 hover:scale-95"  src={deny} alt="deny" onClick={() => cancelEdit('cel')} />
                                    </div>
                                )}
                            </li>
                        </div>

                        {/* PROVINCE */}
                        <div class="flex flex-row border-t hover:bg-gray-50">
                            <li class="w-1/2 p-3">Provincia</li>
                            <li class="flex flex-row w-1/4 items-center gap-2">
                                <input disabled 
                                    id='province' 
                                    value={state.province} 
                                    class="bg-transparent outline-none" 
                                    onChange={(e) => handleChange(e)} 
                                    placeholder={user.province ? user.province : ''} 
                                />
                            </li>
                            <div id="error" class="flex w-1/4 justify-center items-center text-xs text-red-500">{error}</div>

                            <li class="flex flex-row items-center text-sm text-blue-500 cursor-pointer pr-2 hover:text-blue-600 active:text-blue-400">
                                { !edit && <button onClick={() => editState('province')}>editar</button> }
                                { edit && (
                                    <div class="flex flex-row mr-1 gap-1">
                                        <img class="w-4 h-4 hover:scale-95" src={confirm} alt="confirm" onClick={() => confirmEdit('province')} />
                                        <img class="w-4 h-4 hover:scale-95"  src={deny} alt="deny" onClick={() => cancelEdit('province')} />
                                    </div>
                                )}
                            </li>
                        </div>

                        {/* LOCATION */}
                        <div class="flex flex-row border-t hover:bg-gray-50">
                            <li class="w-1/2 p-3">Localidad o barrio</li>
                            <li class="flex flex-row w-1/4 items-center gap-2">
                                <input disabled 
                                    id='location' 
                                    value={state.location} 
                                    class="bg-transparent outline-none" 
                                    onChange={(e) => handleChange(e)} 
                                    placeholder={user.location ? user.location : ''} 
                                />
                            </li>
                            <div id="error" class="flex w-1/4 justify-center items-center text-xs text-red-500">{error}</div>

                            <li class="flex flex-row items-center text-sm text-blue-500 cursor-pointer pr-2 hover:text-blue-600 active:text-blue-400">
                                { !edit && <button onClick={() => editState('location')}>editar</button> }
                                { edit && (
                                    <div class="flex flex-row mr-1 gap-1">
                                        <img class="w-4 h-4 hover:scale-95" src={confirm} alt="confirm" onClick={() => confirmEdit('location')} />
                                        <img class="w-4 h-4 hover:scale-95"  src={deny} alt="deny" onClick={() => cancelEdit('location')} />
                                    </div>
                                )}
                            </li>
                        </div>
                    </ul>  
                )}
                
                {/* SECURITY */}
                <h1 class="flex flex-row justify-between pt-4 pb-4 pr-3 pl-3 cursor-pointer border-b text-lg items-center hover:bg-gray-100" 
                    onClick={() => setMenuTwo(!menuTwo)}>Seguridad {
                        menuTwo
                        ? <img class="w-3 h-3 mt-2" src={up} alt="icon" /> 
                        : <img class="w-3 h-3 mt-2" src={down} alt="icon" />}
                </h1>

                { menuTwo && (
                    <ul class="flex flex-col text-gray-400">
                        <li class="w-auto p-3 cursor-pointer hover:text-gray-500">Cambiar contraseña</li>
                        <li class="border-t p-3 cursor-pointer hover:text-gray-500">Cambiar email</li>
                        <li class="border-t p-3 cursor-pointer text-red-500 hover:text-red-600">Eliminar cuenta</li>
                    </ul>
                )}
            </div>
        </div>
    )
}