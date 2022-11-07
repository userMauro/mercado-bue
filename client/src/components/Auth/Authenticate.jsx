import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from 'axios'

import endpointURL from "../../utils/endpointURL"
import Loader from '../Loader/Loader';
import { regex } from '../../utils/regex'
import { setUserData } from '../../redux/user.slice';


export default function Authenticate () {

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    if (isLoading === true) return (
        <Loader />
    )

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const login = async(e) => {
        e.preventDefault(e)
        if (!regex(credentials.email, "email")) return setError('Email inválido')

        setIsLoading(true)

        try {
            const { data } = await axios.post(`${endpointURL}/auth/login`, credentials)

            // guardo credenciales en localStorage
            localStorage.setItem("logCredentials", JSON.stringify(data.msg))

            // guardo credenciales en reducer
            dispatch(setUserData(data.msg))

            // limpio estados locales
            setIsLoading(false)
            setCredentials({email: '', password: ''})
            setError('')

            navigate('/')
        } catch (error) {
            setIsLoading(false)
            setCredentials({
                ...credentials,
                password: ''
            })
            setError(error.response ? error.response.data.msg : 'unexpected error')  
        }
    }

    return (
        <div class="flex flex-col w-screen h-screen justify-center items-center bg-yellow-400">
            <div class="flex flex-col w-2/5 h-4/6 justify-center rounded-md shadow-xl bg-white">
                <h1 class="text-5xl font-semibold text-yellow-400">Mercado Bue!</h1>
                <h2 class="text-2xl font-extralight mb-10 text-gray-400">Ingresa a tu cuenta</h2>
                <form class="flex flex-col items-center gap-2" action="" onSubmit={(e) => login(e)}>
                    <input required 
                        class="pt-2 pb-2 w-full text-center outline-none rounded-md text-gray-400 bg-gray-100"
                        placeholder="ejemplo@mercadobue.com.ar" 
                        type="email" 
                        name="email" 
                        value={credentials.email} 
                        onChange={handleChange} 
                        spellCheck="false" 
                    />
                    <input required 
                        class="pt-2 pb-2 w-full text-center outline-none rounded-md text-gray-400 bg-gray-100"
                        placeholder="******" 
                        type="password" 
                        name="password" 
                        value={credentials.password} 
                        onChange={handleChange} 
                    />
                    <div id="error" class="text-sm text-red-500">{error}</div>
                    <button class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400" type="submit">
                        INGRESAR
                    </button>
                </form>
                <div class="flex flex-col">
                    <Link class="m-auto text-sm text-gray-400 hover:text-yellow-400" to="/auth/confirm/email/resetPass">
                        ¿Olvidaste la contraseña?
                    </Link>
                    <Link class="m-auto text-sm text-gray-400 hover:text-yellow-400" to="/auth/confirm/email/register">
                        Registrarse
                    </Link>
                </div>
            </div>
        </div>
    );
};