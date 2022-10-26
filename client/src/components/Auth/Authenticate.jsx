import React, { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'

import "./Authenticate.css"
import URL from "../../URL"
import { validate } from '../../utils/validate'
import { useNavigate } from 'react-router-dom'

export default function Authenticate () {
    const navigate = useNavigate()
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
        if (!validate(credentials.email, "email")) return setError('Email inválido')

        setIsLoading(true)

        try {
            await axios.post(`${URL}/auth/login`, credentials)
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
            setError(error.response.data.msg)  
        }
    }

    return (
        <div className="Authenticate">
            <div className="authenticate-container">
                <h1>Ingresa a tu cuenta</h1>
                <form action="" onSubmit={(e) => login(e)} className="authenticate-form">
                    <input required placeholder="ejemplo@mercadobue.com.ar" type="email" name="email" value={credentials.email} onChange={handleChange} spellcheck="false" />
                    <input required placeholder="******" type="password" name="password" value={credentials.password} onChange={handleChange} />
                    <div id="error">{error}</div>
                    <button type="submit">INGRESAR</button>
                </form>
                <div className="authenticate-options">
                    <Link id="links" to="/confirm/email/recupass">¿Olvidaste la contraseña?</Link>
                    <Link id="links" to="/confirm/email/register">Registrarse</Link>
                </div>
            </div>
        </div>
    );
};