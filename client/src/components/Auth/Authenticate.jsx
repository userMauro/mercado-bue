import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from 'axios'

import URL from "../../utils/endpointURL"
import "../../styles/Auth/Authenticate.css"
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
        <div className="Authenticate">
            <h1 id="loading">Loading...</h1>
        </div>
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
            const { data } = await axios.post(`${URL}/auth/login`, credentials)

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
        <div className="Authenticate">
            <div className="authenticate-container">
                <h1>Ingresa a tu cuenta</h1>
                <form action="" onSubmit={(e) => login(e)} className="authenticate-form">
                    <input required placeholder="ejemplo@mercadobue.com.ar" type="email" name="email" value={credentials.email} onChange={handleChange} spellCheck="false" />
                    <input required placeholder="******" type="password" name="password" value={credentials.password} onChange={handleChange} />
                    <div id="error">{error}</div>
                    <button type="submit">INGRESAR</button>
                </form>
                <div className="authenticate-options">
                    <Link id="links" to="/auth/confirm/email/recupass">¿Olvidaste la contraseña?</Link>
                    <Link id="links" to="/auth/confirm/email/register">Registrarse</Link>
                </div>
            </div>
        </div>
    );
};