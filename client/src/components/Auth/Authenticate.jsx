import React, { useState } from 'react'
import axios from 'axios'

import "./Authenticate.css"
import URL from "../../URL"
import { validate } from '../../utils/validate'

export default function Authenticate () {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const cleanStates = () => {
        setCredentials({email: '', password: ''})
        setError('')
    }

    const login = async(e) => {
        e.preventDefault(e)
        try {
            const { data } = await axios.post(`${URL}/auth/login`, credentials)
            alert(data.msg)
            cleanStates()
        } catch (error) {
            setError(error.response.data.msg)  
        }
    }

    const requestPassForgot = async() => {
        if (!validate(credentials.email, "email")) return setError('Email inválido')
        setIsLoading(true)

        try {
            const { data } = await axios.get(`${URL}/auth/resetPass/${credentials.email}`)
            setIsLoading(false)
            console.log(data)
            cleanStates()
            setError(data.msg)
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)  
        }
    }

    const startRegister = async() => {
        if (!validate(credentials.email, "email")) return setError('Email inválido')
        setIsLoading(true)

        try {
            const { data } = await axios.get(`${URL}/auth/register/${credentials.email}`)
            setIsLoading(false)
            cleanStates()
            setError(data.msg)
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)
        }   
    }

    if (isLoading === true) return (
        <div className="Authenticate">
            <h1 id="loading">Loading...</h1>
        </div>
    )

    return (
        <div className="Authenticate">
            <div className="authenticate-container">
                <form action="" onSubmit={(e) => login(e)} className="authenticate-form">
                    <input required placeholder="ejemplo@mercadobue.com.ar" type="email" name="email" value={credentials.email} onChange={handleChange} spellcheck="false" />
                    <input required placeholder="******" type="password" name="password" value={credentials.password} onChange={handleChange} />
                    <div id="error">{error}</div>
                    <button type="submit">INGRESAR</button>
                </form>
                <div className="authenticate-options">
                    <p onClick={(() => requestPassForgot())}>¿Olvidaste la contraseña?</p>
                    <p onClick={(() => startRegister())}>Registrarse</p>
                </div>
            </div>
        </div>
    );
};