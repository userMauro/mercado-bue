import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

// utils
import endpointURL from "../../utils/endpointURL"
import NotFound from '../NotFound/NotFound'
import Loader from '../Loader/Loader'
import { regex } from '../../utils/regex'


export default function ConfirmEmail () {
    const navigate = useNavigate()
    const { action } = useParams()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1)
    const [codes, setCodes] = useState({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''})

    const [credentials, setCredentials] = useState({
        email: '',
        token: '',
        username: '',
        password: '',
        password2: ''
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

    const checkEmail = async() => {
        if (!regex(credentials.email, "email")) return setError('Email inválido')

        setIsLoading(true)

        try {
            const {data } = await axios.get(`${endpointURL}/auth/${action}/${credentials.email}`)
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

    let code;
    const handleCode = (e) => {
        const id = e.target.id[4].toString()
        const eValue = (e.target.value).toUpperCase().replace(/[^A-Z0-9]/,'')

        if (id >= 1 && id <= 6 ) {
            setCodes({
                ...codes,
                [id]: eValue
            })

            if (Number(id) !== 6) {
                document.getElementById(`code${Number(id) + 1}`).focus()
            } else {
                code = codes[1] + codes[2] + codes[3] + codes[4] + codes[5] + eValue

                // si están los 6 dígitos del code, lo envío al back
                if (code.length === 6) return checkCode(e)
            }
        }
    }

    const checkCode = async() => {
        setIsLoading(true)

        try {
            const { email, token } = credentials
            await axios.post(`${endpointURL}/auth/confirm/code`, {email, code, token})
            setIsLoading(false)
            setError('')
            setStep(3)
        } catch (error) {
            setIsLoading(false)
            setCodes({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''})
            setError('Expired or invalid token')  
        }
    }

    const createAccount = async() => {
        if (!regex(credentials.username, "username")) return setError('Username inválido')

        setIsLoading(true)

        try {
            const { username, password, email } = credentials // hashear password en front o back? como se resuelve?
            await axios.post(`${endpointURL}/auth/register/create`, {username, password, email})
            setIsLoading(false)
            setError('')
            setStep(4)
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)  
        }
    }

    const changePass = async() => {
        const { password, password2, email } = credentials

        if (password === '') return setError('Ingresa una contraseña nueva')
        if (password !== password2) return setError('Las contraseñas no coinciden')

        setIsLoading(true)

        try {
            await axios.put(`${endpointURL}/auth/resetPass/confirm`, {password, email})
            setIsLoading(false)
            setError('')
            setStep(4)
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)  
        }
    }

    const toAuth = () => {
        setCredentials('')
        navigate('/auth/login')
    }

    // step 0: not fount 404
    if (action !== "register" && action !== "resetPass") return <NotFound />

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
                <span id="error">{error}</span>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px"}}>
                    <button type="submit" onClick={(e) => checkEmail(e)}>CONFIRMAR</button>
                    <Link id="links" to="/auth/login"><button>CANCELAR</button></Link>
                </div>
            </div>
        </div>
    )

    // step 2: confirmar code
    if (step === 2) return (
        <div className="Authenticate">
            <div className="authenticate-container">
                <h1>Revisa tu email</h1>
                <h2>Ingrese el código</h2>
                {/* <input required type="text" name="code" value={credentials.code} onChange={handleChange} /> */}
                <div className="authenticate-codes">
                    <input type="text" id="code1" value={codes[1]} onChange={handleCode} maxLength="1" autoFocus />
                    <input type="text" id="code2" value={codes[2]} onChange={handleCode} maxLength="1" />
                    <input type="text" id="code3" value={codes[3]} onChange={handleCode} maxLength="1" />
                    <input type="text" id="code4" value={codes[4]} onChange={handleCode} maxLength="1" />
                    <input type="text" id="code5" value={codes[5]} onChange={handleCode} maxLength="1" />
                    <input type="text" id="code6" value={codes[6]} onChange={handleCode} maxLength="1" />
                </div>
                <span id="error">{error}</span>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px"}}>
                    {/* <button disabled id="btn-countdown" type="submit" onClick={() => checkEmail()}>0:${count}</button> */}
                    <Link id="links" to="/auth/login"><button>CANCELAR</button></Link>
                </div>
            </div>
        </div>
    )  

    // step 3: crear cuenta con username y pass / crear contraseña nueva
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
                        <button type="submit" onClick={createAccount}>CONFIRMAR</button>
                        <Link id="links" to="/auth/login"><button>CANCELAR</button></Link>
                    </div>
                    <span id="error">{error}</span>
                </div>
            </div>   
        )

        if (action === "resetPass") return (
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

    // step 4: mensaje final
    if (step === 4) return (
        <div className="Authenticate">
            <div className="authenticate-container">
                <h1 style={{ fontSize: "30px", marginBottom: "0px"}}>{credentials.email}</h1>
                {(action === "register") && (<h2>¡Cuenta creada con éxito!</h2>)} 
                {(action === "resetPass") && (<h2>¡Contraseña modificada con éxito!</h2>)} 
                <button type="submit" onClick={toAuth}>REGRESAR</button>
            </div>
        </div>  
    )
}