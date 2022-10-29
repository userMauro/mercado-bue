import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

// utils
import endpointURL from "../../utils/endpointURL"
import NotFound from '../NotFound/NotFound'
import { regex } from '../../utils/regex'


export default function ConfirmEmail () {
    const navigate = useNavigate()
    const { action } = useParams()
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    // const [count, setCount] = useState(59)
    const [isLoading, setIsLoading] = useState(false)

    const [credentials, setCredentials] = useState({
        email: '',
        code: '',
        token: '',
        username: '',
        password: '',
        password2: ''
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

    // const countDown = () => {
    //     console.log(count)
    //     while (count > 0) {
    //         setCount(count - 1)
    //         setTimeout(1000)
    //         console.log(count)
    //     }
    //     alert('fin')
    // }

    const checkEmail = async(e) => {
        e.preventDefault(e)

        if (!regex(credentials.email, "email")) return setError('Email inválido')

        setIsLoading(true)

        if (action === "register") {
            try {
                const {data } = await axios.get(`${endpointURL}/auth/register/${credentials.email}`)
                setCredentials({
                    ...credentials,
                    token: data.msg,
                })
                setIsLoading(false)
                setError('')
                setStep(2)
            } catch (error) {
                setIsLoading(false)
                setError(error.response.data.msg)
            } 
        } else if (action === "recupass") {
            try {
                const {data } = await axios.get(`${endpointURL}/auth/resetPass/${credentials.email}`)
                setCredentials({
                    ...credentials,
                    token: data.msg,
                })
                setIsLoading(false)
                setError('')
                setStep(2)
            } catch (error) {
                setIsLoading(false)
                setError(error.response.data.msg)  
            }
        }
    }

    const checkCode = async(e) => {
        e.preventDefault(e)

        setIsLoading(true)

        try {
            const { email, code, token } = credentials
            await axios.post(`${endpointURL}/auth/confirm/code`, {email, code, token})
            setIsLoading(false)
            setError('')
            setStep(3)
        } catch (error) {
            setIsLoading(false)
            setError('Expired or invalid token')  
        }
    }

    const createAccount = async(e) => {
        e.preventDefault(e)

        setIsLoading(true)

        try {
            const { username, password, email } = credentials // hashear password en front o back? como se resuelve?
            await axios.post(`${endpointURL}/auth/register/create`, {username, password, email})
            setIsLoading(false)
            alert('Cuenta creada exitosamente, accede para terminar el registro')
            setError('')
            setCredentials('')
            navigate('/auth/login')
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)  
        }
    }

    const changePass = async(e) => {
        e.preventDefault(e)

        const { password, password2, email } = credentials

        if (password !== password2) {
            return setError('Las contraseñas no coinciden')
        }

        setIsLoading(true)

        try {
            await axios.put(`${endpointURL}/auth/resetPass/confirm`, {password, email})
            alert('Contraseña modificada exitosamente')
            setError('')
            setCredentials('')
            setIsLoading(false)
            navigate('/auth/login')
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)  
        }
    }

    // step 0: not fount 404
    if (action !== "register" && action !== "recupass") return <NotFound />

    // step 1: confirmar email
    if (step === 1) return (
        <div className="Authenticate">
            <div className="authenticate-container">
                <h1>Enviar código</h1>
                <h2>Ingresa tu email</h2>
                <input required placeholder="ejemplo@mercadobue.com.ar" 
                    type="email" name="email" value={credentials.email} 
                    onChange={handleChange} spellCheck="false" 
                />
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px"}}>
                    <button type="submit" onClick={(e) => checkEmail(e)}>CONFIRMAR</button>
                    <Link id="links" to="/auth/login"><button>CANCELAR</button></Link>
                </div>
                <span id="error">{error}</span>
            </div>
        </div>
    )

    // step 2: confirmar code
    if (step === 2) return (
        <div className="Authenticate">
            <div className="authenticate-container">
                <h1>Verificar</h1>
                <h2>Ingrese el código</h2>
                <input required type="text" name="code" value={credentials.code} onChange={handleChange} />
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px"}}>
                    <button disabled id="btn-countdown" type="submit" onClick={() => checkEmail()}>0:00{/*count*/}</button>
                    <button id="btn-countdown" type="submit" onClick={(e) => checkCode(e)}>CONFIRMAR</button>
                    <Link id="links" to="/auth/login"><button>CANCELAR</button></Link>
                </div>
                <span id="error">{error}</span>
            </div>
        </div>
    )  

    // step 3: crear cuenta con email, username y pass
    if (step === 3) {
        if (action === "register") return (
            <div className="Authenticate">
                <div className="authenticate-container">
                    <h1 style={{ fontSize: "30px", marginBottom: "0px"}}>{credentials.email}</h1>
                    <h2>Crea tu cuenta</h2>
                    <input required placeholder="Nombre de usuario" type="text" name="username" value={credentials.username} onChange={handleChange} />
                    <input required placeholder="Contraseña" type="password" name="password" value={credentials.password} onChange={handleChange} />
                    <input required placeholder="Repetir contraseña" type="password" name="password2" value={credentials.password2} onChange={handleChange} />
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px"}}>
                        <button type="submit" onClick={(e) => createAccount(e)}>CONFIRMAR</button>
                        <Link id="links" to="/auth/login"><button>CANCELAR</button></Link>
                    </div>
                    <span id="error">{error}</span>
                </div>
            </div>   
        )

        if (action === "recupass") return (
            <div className="Authenticate">
                <div className="authenticate-container">
                    <h1 style={{ fontSize: "30px", marginBottom: "0px"}}>{credentials.email}</h1>
                    <h2>Ingrese la nueva contraseña</h2>
                    <input required placeholder="Nueva contraseña" type="password" name="password" value={credentials.password} onChange={handleChange} />
                    <input required placeholder="Repetir nueva contraseña" type="password" name="password2" value={credentials.password2} onChange={handleChange} />
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px"}}>
                        <button type="submit" onClick={changePass}>CONFIRMAR</button>
                        <Link id="links" to="/auth/login"><button>CANCELAR</button></Link>
                    </div>
                    <span id="error">{error}</span>
                </div>
            </div> 
        )
    }
}